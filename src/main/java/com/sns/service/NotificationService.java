package com.sns.service;

import com.sns.common.ErrorCode;
import com.sns.common.SnsException;
import com.sns.dto.notification.NotificationDto.NotificationResponse;
import com.sns.entity.Notification;
import com.sns.entity.Notification.NotificationType;
import com.sns.entity.User;
import com.sns.repository.NotificationRepository;
import com.sns.repository.UserRepository;
import com.sns.repository.PostRepository;
import com.sns.repository.CommentRepository;
import com.sns.repository.FollowRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final FollowRepository followRepository;

    @Transactional
    public void createNotification(Long userId, Long actorId, NotificationType type,
                                   Long postId, Long commentId, Long followId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new SnsException(ErrorCode.USER_NOT_FOUND));
        User actor = actorId != null ? userRepository.findById(actorId)
                .orElseThrow(() -> new SnsException(ErrorCode.USER_NOT_FOUND)) : null;

        Notification notification = Notification.builder()
                .user(user)
                .actor(actor)
                .type(type)
                .build();
        if (postId != null) {
            notification.setPost(postRepository.findById(postId)
                    .orElseThrow(() -> new SnsException(ErrorCode.POST_NOT_FOUND)));
        }
        if (commentId != null) {
            notification.setComment(commentRepository.findById(commentId)
                    .orElseThrow(() -> new SnsException(ErrorCode.COMMENT_NOT_FOUND)));
        }
        if (followId != null) {
            notification.setFollow(followRepository.findById(followId)
                    .orElseThrow(() -> new SnsException(ErrorCode.FOLLOW_RELATION_NOT_FOUND)));
        }

        notificationRepository.save(notification);
    }

    @Transactional(readOnly = true)
    public List<NotificationResponse> getNotifications(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new SnsException(ErrorCode.USER_NOT_FOUND));
        return notificationRepository.findAllByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new SnsException(ErrorCode.INVALID_REQUEST, "알림을 찾을 수 없습니다."));
        notification.setIsRead(true);
        notification.setReadAt(java.time.LocalDateTime.now());
    }

    private NotificationResponse toResponse(Notification notification) {
        String postImageUrl = null;
        if (notification.getPost() != null && 
            notification.getPost().getImageUrls() != null && 
            !notification.getPost().getImageUrls().isEmpty()) {
            postImageUrl = notification.getPost().getImageUrls().get(0);
        }
        
        return NotificationResponse.builder()
                .id(notification.getId())
                .userId(notification.getUser().getId())
                .actorId(notification.getActor() != null ? notification.getActor().getId() : null)
                .actorUsername(notification.getActor() != null ? notification.getActor().getUsername() : null)
                .actorProfileImageUrl(notification.getActor() != null ? notification.getActor().getProfileImageUrl() : null)
                .type(notification.getType())
                .postId(notification.getPost() != null ? notification.getPost().getId() : null)
                .postImageUrl(postImageUrl)
                .commentId(notification.getComment() != null ? notification.getComment().getId() : null)
                .followId(notification.getFollow() != null ? notification.getFollow().getId() : null)
                .isRead(Boolean.TRUE.equals(notification.getIsRead()))
                .createdAt(notification.getCreatedAt())
                .build();
    }
}

