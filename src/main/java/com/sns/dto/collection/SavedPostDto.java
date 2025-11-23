package com.sns.dto.collection;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

public class SavedPostDto {

    @Getter
    @Setter
    public static class SavePostRequest {
        private Long userId;
        private Long postId;
        private Long collectionId;
    }

    @Getter
    @Builder
    public static class SavedPostResponse {
        private Long id;
        private Long userId;
        private Long postId;
        private Long collectionId;
        private String postImageUrl;
        private String postCaption;
    }
}

