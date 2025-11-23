package com.sns.dto.like;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

public class LikeDto {

    @Getter
    @Setter
    public static class LikeRequest {
        private Long userId;
        private Long postId;
        private Long commentId;
    }

    @Getter
    @Builder
    public static class LikeResponse {
        private Long id;
        private Long userId;
        private Long postId;
        private Long commentId;
    }
}

