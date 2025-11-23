package com.sns.dto.notification;

import com.sns.entity.Notification.NotificationType;
import lombok.Builder;
import lombok.Getter;

public class NotificationDto {

    @Getter
    @Builder
    public static class NotificationResponse {
        private Long id;
        private Long userId;
        private Long actorId;
        private NotificationType type;
        private Long postId;
        private Long commentId;
        private Long followId;
        private boolean read;
    }
}

