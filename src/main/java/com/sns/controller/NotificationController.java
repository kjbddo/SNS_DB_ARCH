package com.sns.controller;

import com.sns.common.ApiResponse;
import com.sns.dto.notification.NotificationDto.NotificationResponse;
import com.sns.entity.Notification.NotificationType;
import com.sns.service.NotificationService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @PostMapping
    public ApiResponse<Void> createNotification(@RequestBody CreateNotificationRequest request) {
        notificationService.createNotification(
                request.getUserId(),
                request.getActorId(),
                request.getType(),
                request.getPostId(),
                request.getCommentId(),
                request.getFollowId()
        );
        return ApiResponse.ok();
    }

    @GetMapping("/user/{userId}")
    public ApiResponse<List<NotificationResponse>> getNotifications(@PathVariable Long userId) {
        return ApiResponse.ok(notificationService.getNotifications(userId));
    }

    @PostMapping("/{notificationId}/read")
    public ApiResponse<Void> markAsRead(@PathVariable Long notificationId) {
        notificationService.markAsRead(notificationId);
        return ApiResponse.ok();
    }

    @Getter
    @Setter
    public static class CreateNotificationRequest {
        private Long userId;
        private Long actorId;
        private NotificationType type;
        private Long postId;
        private Long commentId;
        private Long followId;
    }
}

