package com.sns.controller;

import com.sns.common.ApiResponse;
import com.sns.dto.comment.CommentDto.CommentResponse;
import com.sns.dto.comment.CommentDto.CreateRequest;
import com.sns.dto.comment.CommentDto.UpdateRequest;
import com.sns.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @PostMapping
    public ApiResponse<CommentResponse> createComment(@RequestBody CreateRequest request) {
        return ApiResponse.ok(commentService.create(request));
    }

    @PutMapping("/{commentId}")
    public ApiResponse<CommentResponse> updateComment(@PathVariable Long commentId,
                                                      @RequestParam Long userId,
                                                      @RequestBody UpdateRequest request) {
        return ApiResponse.ok(commentService.update(commentId, userId, request));
    }

    @DeleteMapping("/{commentId}")
    public ApiResponse<Void> deleteComment(@PathVariable Long commentId,
                                           @RequestParam Long userId) {
        commentService.delete(commentId, userId);
        return ApiResponse.ok();
    }

    @GetMapping("/post/{postId}")
    public ApiResponse<List<CommentResponse>> getComments(@PathVariable Long postId) {
        return ApiResponse.ok(commentService.getComments(postId));
    }
}

