package com.sns.dto.comment;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

public class CommentDto {

    @Getter
    @Setter
    public static class CreateRequest {
        private Long postId;
        private Long userId;
        private Long parentCommentId;
        private String content;
    }

    @Getter
    @Setter
    public static class UpdateRequest {
        private String content;
    }

    @Getter
    @Builder
    public static class CommentResponse {
        private Long id;
        private Long postId;
        private Long userId;
        private Long parentCommentId;
        private String content;
    }
}

