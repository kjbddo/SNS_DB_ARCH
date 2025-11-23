package com.sns.dto.post;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

public class PostDto {

    @Getter
    @Setter
    public static class CreateRequest {
        private Long userId;
        private String caption;
        private List<String> imageUrls;
        private List<String> videoUrls;
        private String location;
        private List<Long> taggedUserIds;
        private List<String> hashtags;
    }

    @Getter
    @Setter
    public static class UpdateRequest {
        private String caption;
        private List<String> imageUrls;
        private List<String> videoUrls;
        private String location;
        private List<Long> taggedUserIds;
        private List<String> hashtags;
    }

    @Getter
    @Builder
    public static class PostResponse {
        private Long id;
        private Long userId;
        private String username;
        private String profileImageUrl;
        private String caption;
        private List<String> imageUrls;
        private List<String> videoUrls;
        private String location;
        private Long likeCount;
        private Long commentCount;
        private List<Long> taggedUserIds;
        private List<String> hashtags;
        private LocalDateTime createdAt;
    }
}

