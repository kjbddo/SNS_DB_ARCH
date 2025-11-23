package com.sns.controller;

import com.sns.common.ApiResponse;
import com.sns.dto.follow.FollowDto.FollowResponse;
import com.sns.dto.follow.FollowDto.UserFollowResponse;
import com.sns.service.FollowService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/follows")
@RequiredArgsConstructor
public class FollowController {

    private final FollowService followService;

    @PostMapping
    public ApiResponse<FollowResponse> follow(@RequestParam Long followerId,
                                              @RequestParam Long followingId) {
        return ApiResponse.ok(followService.follow(followerId, followingId));
    }

    @DeleteMapping
    public ApiResponse<Void> unfollow(@RequestParam Long followerId,
                                      @RequestParam Long followingId) {
        followService.unfollow(followerId, followingId);
        return ApiResponse.ok();
    }

    @GetMapping("/followers/{userId}")
    public ApiResponse<List<UserFollowResponse>> getFollowers(@PathVariable Long userId) {
        return ApiResponse.ok(followService.getFollowers(userId));
    }

    @GetMapping("/followings/{userId}")
    public ApiResponse<List<UserFollowResponse>> getFollowings(@PathVariable Long userId) {
        return ApiResponse.ok(followService.getFollowings(userId));
    }
}

