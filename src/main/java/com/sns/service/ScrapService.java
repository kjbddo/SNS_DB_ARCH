package com.sns.service;

import com.sns.common.ErrorCode;
import com.sns.common.SnsException;
import com.sns.dto.scrap.ScrapDto.ScrapRequest;
import com.sns.dto.scrap.ScrapDto.ScrapResponse;
import com.sns.entity.Post;
import com.sns.entity.ScrappedPost;
import com.sns.entity.User;
import com.sns.repository.PostRepository;
import com.sns.repository.ScrappedPostRepository;
import com.sns.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ScrapService {

    private final ScrappedPostRepository scrappedPostRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;

    @Transactional
    public ScrapResponse scrap(ScrapRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new SnsException(ErrorCode.USER_NOT_FOUND));
        Post post = postRepository.findById(request.getPostId())
                .orElseThrow(() -> new SnsException(ErrorCode.POST_NOT_FOUND));

        scrappedPostRepository.findByUserAndPost(user, post)
                .ifPresent(existing -> {
                    throw new SnsException(ErrorCode.DUPLICATED_RESOURCE, "이미 스크랩한 게시물입니다.");
                });

        ScrappedPost scrappedPost = ScrappedPost.builder()
                .user(user)
                .post(post)
                .build();

        return toResponse(scrappedPostRepository.save(scrappedPost));
    }

    @Transactional
    public void unscrap(ScrapRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new SnsException(ErrorCode.USER_NOT_FOUND));
        Post post = postRepository.findById(request.getPostId())
                .orElseThrow(() -> new SnsException(ErrorCode.POST_NOT_FOUND));

        ScrappedPost scrappedPost = scrappedPostRepository.findByUserAndPost(user, post)
                .orElseThrow(() -> new SnsException(ErrorCode.INVALID_REQUEST, "스크랩 상태가 아닙니다."));
        scrappedPostRepository.delete(scrappedPost);
    }

    @Transactional(readOnly = true)
    public List<ScrapResponse> getScraps(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new SnsException(ErrorCode.USER_NOT_FOUND));
        return scrappedPostRepository.findAllByUser(user)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private ScrapResponse toResponse(ScrappedPost scrappedPost) {
        Post post = scrappedPost.getPost();
        String postImageUrl = null;
        if (post.getImageUrls() != null && !post.getImageUrls().isEmpty()) {
            postImageUrl = post.getImageUrls().get(0);
        }
        
        return ScrapResponse.builder()
                .id(scrappedPost.getId())
                .userId(scrappedPost.getUser().getId())
                .postId(scrappedPost.getPost().getId())
                .postImageUrl(postImageUrl)
                .postCaption(post.getCaption())
                .build();
    }
}

