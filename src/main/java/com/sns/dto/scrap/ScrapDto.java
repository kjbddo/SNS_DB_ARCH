package com.sns.dto.scrap;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

public class ScrapDto {

    @Getter
    @Setter
    public static class ScrapRequest {
        private Long userId;
        private Long postId;
    }

    @Getter
    @Builder
    public static class ScrapResponse {
        private Long id;
        private Long userId;
        private Long postId;
        private String postImageUrl;
        private String postCaption;
    }
}

