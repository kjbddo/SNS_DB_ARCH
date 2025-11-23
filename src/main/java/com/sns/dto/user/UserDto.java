package com.sns.dto.user;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserDto {

    @Getter
    @Setter
    public static class RegisterRequest {
        private String username;
        private String email;
        private String password;
        private String name;
    }

    @Getter
    @Setter
    public static class UpdateProfileRequest {
        private String name;
        private String bio;
        private String profileImageUrl;
        private Boolean isPrivate;
    }

    @Getter
    @Setter
    public static class LoginRequest {
        private String username;
        private String password;
    }

    @Getter
    @Builder
    public static class LoginResponse {
        private Long userId;
        private String username;
        private String token; // TODO: JWT 토큰 구현 시 사용
    }

    @Getter
    @Builder
    public static class UserResponse {
        private Long id;
        private String username;
        private String email;
        private String name;
        private String bio;
        private String profileImageUrl;
        private Boolean isPrivate;
        private Long followerCount;
        private Long followingCount;
        private Long postCount;
    }
}

