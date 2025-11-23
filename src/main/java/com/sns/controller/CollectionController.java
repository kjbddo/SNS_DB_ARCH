package com.sns.controller;

import com.sns.common.ApiResponse;
import com.sns.dto.collection.CollectionDto.CollectionResponse;
import com.sns.dto.collection.CollectionDto.CreateCollectionRequest;
import com.sns.dto.collection.CollectionDto.UpdateCollectionRequest;
import com.sns.dto.collection.SavedPostDto.SavePostRequest;
import com.sns.dto.collection.SavedPostDto.SavedPostResponse;
import com.sns.service.CollectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/collections")
@RequiredArgsConstructor
public class CollectionController {

    private final CollectionService collectionService;

    @PostMapping
    public ApiResponse<CollectionResponse> createCollection(@RequestBody CreateCollectionRequest request) {
        return ApiResponse.ok(collectionService.createCollection(request));
    }

    @PutMapping("/{collectionId}")
    public ApiResponse<CollectionResponse> updateCollection(@PathVariable Long collectionId,
                                                            @RequestParam Long userId,
                                                            @RequestBody UpdateCollectionRequest request) {
        return ApiResponse.ok(collectionService.updateCollection(collectionId, userId, request));
    }

    @DeleteMapping("/{collectionId}")
    public ApiResponse<Void> deleteCollection(@PathVariable Long collectionId,
                                              @RequestParam Long userId) {
        collectionService.deleteCollection(collectionId, userId);
        return ApiResponse.ok();
    }

    @GetMapping("/user/{userId}")
    public ApiResponse<List<CollectionResponse>> getCollections(@PathVariable Long userId) {
        return ApiResponse.ok(collectionService.getCollections(userId));
    }

    @PostMapping("/saved")
    public ApiResponse<SavedPostResponse> savePost(@RequestBody SavePostRequest request) {
        return ApiResponse.ok(collectionService.savePost(request));
    }

    @DeleteMapping("/saved/{savedPostId}")
    public ApiResponse<Void> removeSavedPost(@PathVariable Long savedPostId,
                                             @RequestParam Long userId) {
        collectionService.removeSavedPost(savedPostId, userId);
        return ApiResponse.ok();
    }

    @GetMapping("/saved")
    public ApiResponse<List<SavedPostResponse>> getSavedPosts(
            @RequestParam Long userId,
            @RequestParam(required = false) Long collectionId) {
        return ApiResponse.ok(collectionService.getSavedPosts(userId, collectionId));
    }
}

