package com.sns.dto.follow;

import lombok.Builder;
import lombok.Getter;

public class FollowDto {

    @Getter
    @Builder
    public static class FollowResponse {
        private Long id;
        private Long followerId;
        private Long followingId;
    }

    @Getter
    @Builder
    public static class UserFollowResponse {
        private Long userId;
        private String username;
        private String name;
        private String profileImageUrl;
        private Boolean isFollowing;
    }
}

