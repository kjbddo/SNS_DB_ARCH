package com.sns.dto.notification;

import com.sns.entity.Notification.NotificationType;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

public class NotificationDto {

    @Getter
    @Builder
    public static class NotificationResponse {
        private Long id;
        private Long userId;
        private Long actorId;
        private String actorUsername;
        private String actorProfileImageUrl;
        private NotificationType type;
        private Long postId;
        private String postImageUrl;
        private Long commentId;
        private Long followId;
        private boolean isRead;
        private LocalDateTime createdAt;
    }
}

