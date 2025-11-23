package com.sns.controller;

import com.sns.common.ApiResponse;
import com.sns.dto.post.PostDto.CreateRequest;
import com.sns.dto.post.PostDto.PostResponse;
import com.sns.dto.post.PostDto.UpdateRequest;
import com.sns.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @PostMapping
    public ApiResponse<PostResponse> createPost(@RequestBody CreateRequest request) {
        return ApiResponse.ok(postService.createPost(request));
    }

    @PutMapping("/{postId}")
    public ApiResponse<PostResponse> updatePost(@PathVariable Long postId,
                                                @RequestParam Long userId,
                                                @RequestBody UpdateRequest request) {
        return ApiResponse.ok(postService.updatePost(postId, userId, request));
    }

    @DeleteMapping("/{postId}")
    public ApiResponse<Void> deletePost(@PathVariable Long postId, @RequestParam Long userId) {
        postService.deletePost(postId, userId);
        return ApiResponse.ok();
    }

    @GetMapping("/{postId}")
    public ApiResponse<PostResponse> getPost(@PathVariable Long postId) {
        return ApiResponse.ok(postService.getPost(postId));
    }

    @GetMapping("/user/{userId}")
    public ApiResponse<List<PostResponse>> getUserPosts(@PathVariable Long userId) {
        return ApiResponse.ok(postService.getUserPosts(userId));
    }

    @GetMapping("/feed/{userId}")
    public ApiResponse<List<PostResponse>> getFeedPosts(@PathVariable Long userId) {
        return ApiResponse.ok(postService.getFeedPosts(userId));
    }
}

