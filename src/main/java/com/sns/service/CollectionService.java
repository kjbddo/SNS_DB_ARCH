package com.sns.service;

import com.sns.common.ErrorCode;
import com.sns.common.SnsException;
import com.sns.dto.collection.CollectionDto.CollectionResponse;
import com.sns.dto.collection.CollectionDto.CreateCollectionRequest;
import com.sns.dto.collection.CollectionDto.UpdateCollectionRequest;
import com.sns.dto.collection.SavedPostDto.SavePostRequest;
import com.sns.dto.collection.SavedPostDto.SavedPostResponse;
import com.sns.entity.Post;
import com.sns.entity.SavedCollection;
import com.sns.entity.SavedPost;
import com.sns.entity.User;
import com.sns.repository.PostRepository;
import com.sns.repository.SavedCollectionRepository;
import com.sns.repository.SavedPostRepository;
import com.sns.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CollectionService {

    private final SavedCollectionRepository savedCollectionRepository;
    private final SavedPostRepository savedPostRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;

    @Transactional
    public CollectionResponse createCollection(CreateCollectionRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new SnsException(ErrorCode.USER_NOT_FOUND));

        SavedCollection collection = SavedCollection.builder()
                .user(user)
                .name(request.getName())
                .description(request.getDescription())
                .coverImageUrl(request.getCoverImageUrl())
                .isDefault(Boolean.TRUE.equals(request.getIsDefault()))
                .build();

        return toCollectionResponse(savedCollectionRepository.save(collection));
    }

    @Transactional
    public CollectionResponse updateCollection(Long collectionId, Long userId, UpdateCollectionRequest request) {
        SavedCollection collection = getOwnedCollection(collectionId, userId);
        if (request.getName() != null) collection.setName(request.getName());
        if (request.getDescription() != null) collection.setDescription(request.getDescription());
        if (request.getCoverImageUrl() != null) collection.setCoverImageUrl(request.getCoverImageUrl());
        if (request.getIsDefault() != null) collection.setIsDefault(request.getIsDefault());
        return toCollectionResponse(collection);
    }

    @Transactional
    public void deleteCollection(Long collectionId, Long userId) {
        SavedCollection collection = getOwnedCollection(collectionId, userId);
        savedCollectionRepository.delete(collection);
    }

    @Transactional(readOnly = true)
    public List<CollectionResponse> getCollections(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new SnsException(ErrorCode.USER_NOT_FOUND));
        return savedCollectionRepository.findAllByUser(user)
                .stream()
                .map(this::toCollectionResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public SavedPostResponse savePost(SavePostRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new SnsException(ErrorCode.USER_NOT_FOUND));
        Post post = postRepository.findById(request.getPostId())
                .orElseThrow(() -> new SnsException(ErrorCode.POST_NOT_FOUND));
        SavedCollection collection = null;
        if (request.getCollectionId() != null) {
            collection = getOwnedCollection(request.getCollectionId(), user.getId());
        }

        savedPostRepository.findByUserAndPostAndCollection(user, post, collection)
                .ifPresent(existing -> {
                    throw new SnsException(ErrorCode.DUPLICATED_RESOURCE, "이미 저장된 게시물입니다.");
                });

        SavedPost savedPost = SavedPost.builder()
                .user(user)
                .post(post)
                .collection(collection)
                .build();
        return toSavedResponse(savedPostRepository.save(savedPost));
    }

    @Transactional
    public void removeSavedPost(Long savedPostId, Long userId) {
        SavedPost savedPost = savedPostRepository.findById(savedPostId)
                .orElseThrow(() -> new SnsException(ErrorCode.INVALID_REQUEST, "저장된 게시물을 찾을 수 없습니다."));
        if (!savedPost.getUser().getId().equals(userId)) {
            throw new SnsException(ErrorCode.ACCESS_DENIED);
        }
        savedPostRepository.delete(savedPost);
    }

    @Transactional(readOnly = true)
    public List<SavedPostResponse> getSavedPosts(Long userId, Long collectionId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new SnsException(ErrorCode.USER_NOT_FOUND));
        
        List<SavedPost> savedPosts;
        if (collectionId != null) {
            SavedCollection collection = savedCollectionRepository.findById(collectionId)
                    .orElseThrow(() -> new SnsException(ErrorCode.COLLECTION_NOT_FOUND));
            if (!collection.getUser().getId().equals(userId)) {
                throw new SnsException(ErrorCode.ACCESS_DENIED);
            }
            savedPosts = savedPostRepository.findAllByCollection(collection);
        } else {
            savedPosts = savedPostRepository.findAllByUser(user);
        }
        
        return savedPosts.stream()
                .map(this::toSavedResponse)
                .collect(Collectors.toList());
    }

    private SavedCollection getOwnedCollection(Long collectionId, Long userId) {
        SavedCollection collection = savedCollectionRepository.findById(collectionId)
                .orElseThrow(() -> new SnsException(ErrorCode.COLLECTION_NOT_FOUND));
        if (!collection.getUser().getId().equals(userId)) {
            throw new SnsException(ErrorCode.ACCESS_DENIED);
        }
        return collection;
    }

    private CollectionResponse toCollectionResponse(SavedCollection collection) {
        return CollectionResponse.builder()
                .id(collection.getId())
                .userId(collection.getUser().getId())
                .name(collection.getName())
                .description(collection.getDescription())
                .coverImageUrl(collection.getCoverImageUrl())
                .isDefault(collection.getIsDefault())
                .build();
    }

    private SavedPostResponse toSavedResponse(SavedPost savedPost) {
        Post post = savedPost.getPost();
        String postImageUrl = null;
        if (post.getImageUrls() != null && !post.getImageUrls().isEmpty()) {
            postImageUrl = post.getImageUrls().get(0);
        }
        
        return SavedPostResponse.builder()
                .id(savedPost.getId())
                .userId(savedPost.getUser().getId())
                .postId(savedPost.getPost().getId())
                .collectionId(savedPost.getCollection() != null ? savedPost.getCollection().getId() : null)
                .postImageUrl(postImageUrl)
                .postCaption(post.getCaption())
                .build();
    }
}

