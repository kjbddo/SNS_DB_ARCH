package com.sns.service;

import com.sns.common.ErrorCode;
import com.sns.common.SnsException;
import com.sns.dto.post.PostDto.CreateRequest;
import com.sns.dto.post.PostDto.PostResponse;
import com.sns.dto.post.PostDto.UpdateRequest;
import com.sns.entity.Hashtag;
import com.sns.entity.Post;
import com.sns.entity.PostHashtag;
import com.sns.entity.PostTag;
import com.sns.entity.User;
import com.sns.repository.CommentRepository;
import com.sns.repository.FollowRepository;
import com.sns.repository.HashtagRepository;
import com.sns.repository.LikeRepository;
import com.sns.repository.PostHashtagRepository;
import com.sns.repository.PostRepository;
import com.sns.repository.PostTagRepository;
import com.sns.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final PostTagRepository postTagRepository;
    private final PostHashtagRepository postHashtagRepository;
    private final HashtagRepository hashtagRepository;
    private final LikeRepository likeRepository;
    private final CommentRepository commentRepository;
    private final FollowRepository followRepository;

    @Transactional
    public PostResponse createPost(CreateRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new SnsException(ErrorCode.USER_NOT_FOUND));

        Post post = Post.builder()
                .user(user)
                .imageUrls(new ArrayList<>(Optional.ofNullable(request.getImageUrls()).orElseGet(ArrayList::new)))
                .videoUrls(new ArrayList<>(Optional.ofNullable(request.getVideoUrls()).orElseGet(ArrayList::new)))
                .caption(request.getCaption())
                .location(request.getLocation())
                .build();

        Post saved = postRepository.save(post);
        applyTags(saved, request.getTaggedUserIds());
        applyHashtags(saved, request.getHashtags());
        return toResponse(saved);
    }

    @Transactional
    public PostResponse updatePost(Long postId, Long userId, UpdateRequest request) {
        Post post = getOwnedPost(postId, userId);

        if (request.getCaption() != null) post.setCaption(request.getCaption());
        if (request.getLocation() != null) post.setLocation(request.getLocation());
        if (request.getImageUrls() != null) {
            post.getImageUrls().clear();
            post.getImageUrls().addAll(request.getImageUrls());
        }
        if (request.getVideoUrls() != null) {
            post.getVideoUrls().clear();
            post.getVideoUrls().addAll(request.getVideoUrls());
        }

        postTagRepository.deleteAllByPost(post);
        applyTags(post, request.getTaggedUserIds());

        postHashtagRepository.deleteAllByPost(post);
        applyHashtags(post, request.getHashtags());

        return toResponse(post);
    }

    @Transactional
    public void deletePost(Long postId, Long userId) {
        Post post = getOwnedPost(postId, userId);
        postRepository.delete(post);
    }

    @Transactional(readOnly = true)
    public PostResponse getPost(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new SnsException(ErrorCode.POST_NOT_FOUND));
        return toResponse(post);
    }

    @Transactional(readOnly = true)
    public List<PostResponse> getUserPosts(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new SnsException(ErrorCode.USER_NOT_FOUND));
        return postRepository.findAllByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PostResponse> getFeedPosts(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new SnsException(ErrorCode.USER_NOT_FOUND));
        
        // 팔로우한 사용자들의 ID 목록 가져오기
        List<Long> followingIds = followRepository.findAllByFollower(user)
                .stream()
                .map(follow -> follow.getFollowing().getId())
                .collect(Collectors.toList());
        
        // 자신의 게시물도 포함
        followingIds.add(userId);
        
        // 팔로우한 사용자들의 User 엔티티 가져오기
        List<User> followingUsers = userRepository.findAllById(followingIds);
        
        // 팔로우한 사용자들의 게시물 가져오기
        return postRepository.findAllByUserInOrderByCreatedAtDesc(followingUsers)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private Post getOwnedPost(Long postId, Long userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new SnsException(ErrorCode.POST_NOT_FOUND));
        if (!post.getUser().getId().equals(userId)) {
            throw new SnsException(ErrorCode.ACCESS_DENIED);
        }
        return post;
    }

    private void applyTags(Post post, List<Long> taggedUserIds) {
        if (taggedUserIds == null) return;
        Set<Long> uniqueIds = taggedUserIds.stream().collect(Collectors.toSet());
        uniqueIds.forEach(id -> userRepository.findById(id).ifPresent(user -> {
            PostTag tag = PostTag.builder()
                    .post(post)
                    .taggedUser(user)
                    .build();
            postTagRepository.save(tag);
        }));
    }

    private void applyHashtags(Post post, List<String> hashtags) {
        if (hashtags == null) return;
        hashtags.stream()
                .map(tag -> tag.startsWith("#") ? tag.substring(1) : tag)
                .map(String::toLowerCase)
                .map(tag -> hashtagRepository.findByTag(tag)
                        .orElseGet(() -> hashtagRepository.save(Hashtag.builder().tag(tag).build())))
                .forEach(hashtag -> {
                    PostHashtag postHashtag = PostHashtag.builder()
                            .post(post)
                            .hashtag(hashtag)
                            .build();
                    postHashtagRepository.save(postHashtag);
                });
    }

    private PostResponse toResponse(Post post) {
        long likeCount = likeRepository.countByPost(post);
        long commentCount = commentRepository.countByPost(post);
        List<Long> taggedUsers = postTagRepository.findAllByPost(post).stream()
                .map(tag -> tag.getTaggedUser().getId())
                .collect(Collectors.toList());
        List<String> hashtags = postHashtagRepository.findAllByPost(post).stream()
                .map(ph -> ph.getHashtag().getTag())
                .collect(Collectors.toList());

        return PostResponse.builder()
                .id(post.getId())
                .userId(post.getUser().getId())
                .username(post.getUser().getUsername())
                .profileImageUrl(post.getUser().getProfileImageUrl())
                .caption(post.getCaption())
                .imageUrls(post.getImageUrls())
                .videoUrls(post.getVideoUrls())
                .location(post.getLocation())
                .likeCount(likeCount)
                .commentCount(commentCount)
                .taggedUserIds(taggedUsers)
                .hashtags(hashtags)
                .createdAt(post.getCreatedAt())
                .build();
    }
}

