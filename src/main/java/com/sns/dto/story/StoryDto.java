package com.sns.dto.story;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

public class StoryDto {

    @Getter
    @Setter
    public static class CreateRequest {
        private Long userId;
        private String imageUrl;
        private String videoUrl;
        private String text;
    }

    @Getter
    @Builder
    public static class StoryResponse {
        private Long id;
        private Long userId;
        private String username;
        private String profileImageUrl;
        private String imageUrl;
        private String videoUrl;
        private String text;
        private Long viewCount;
        private LocalDateTime createdAt;
    }
}

