package com.sns.controller;

import com.sns.common.ApiResponse;
import com.sns.dto.like.LikeDto.LikeRequest;
import com.sns.dto.like.LikeDto.LikeResponse;
import com.sns.service.LikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/likes")
@RequiredArgsConstructor
public class LikeController {

    private final LikeService likeService;

    @PostMapping
    public ApiResponse<LikeResponse> like(@RequestBody LikeRequest request) {
        return ApiResponse.ok(likeService.like(request));
    }

    @DeleteMapping
    public ApiResponse<Void> unlike(@RequestBody LikeRequest request) {
        likeService.unlike(request);
        return ApiResponse.ok();
    }
}

