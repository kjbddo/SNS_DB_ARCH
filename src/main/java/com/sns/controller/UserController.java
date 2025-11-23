package com.sns.controller;

import com.sns.common.ApiResponse;
import com.sns.dto.user.UserDto.LoginRequest;
import com.sns.dto.user.UserDto.LoginResponse;
import com.sns.dto.user.UserDto.RegisterRequest;
import com.sns.dto.user.UserDto.UpdateProfileRequest;
import com.sns.dto.user.UserDto.UserResponse;
import com.sns.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
// CORS는 CorsConfig에서 전역으로 관리하므로 개별 컨트롤러에서는 제거
public class UserController {

    private final UserService userService;

    @PostMapping
    public ApiResponse<UserResponse> register(@RequestBody RegisterRequest request) {
        return ApiResponse.ok(userService.register(request));
    }

    @PostMapping("/login")
    public ApiResponse<LoginResponse> login(@RequestBody LoginRequest request) {
        return ApiResponse.ok(userService.login(request));
    }

    @PutMapping("/{userId}")
    public ApiResponse<UserResponse> updateProfile(@PathVariable Long userId,
                                                   @RequestBody UpdateProfileRequest request) {
        return ApiResponse.ok(userService.updateProfile(userId, request));
    }

    @GetMapping("/{userId}")
    public ApiResponse<UserResponse> getProfile(@PathVariable Long userId) {
        return ApiResponse.ok(userService.getProfile(userId));
    }

    @GetMapping("/search")
    public ApiResponse<List<UserResponse>> searchUsers(@RequestParam String q) {
        return ApiResponse.ok(userService.searchUsers(q));
    }
}

