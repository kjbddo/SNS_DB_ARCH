package com.sns.service;

import com.sns.common.ErrorCode;
import com.sns.common.SnsException;
import com.sns.dto.like.LikeDto.LikeRequest;
import com.sns.dto.like.LikeDto.LikeResponse;
import com.sns.entity.Comment;
import com.sns.entity.Like;
import com.sns.entity.Notification.NotificationType;
import com.sns.entity.Post;
import com.sns.entity.User;
import com.sns.repository.CommentRepository;
import com.sns.repository.LikeRepository;
import com.sns.repository.PostRepository;
import com.sns.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class LikeService {

    private final LikeRepository likeRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final NotificationService notificationService;

    @Transactional
    public LikeResponse like(LikeRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new SnsException(ErrorCode.USER_NOT_FOUND));

        if (request.getPostId() != null) {
            Post post = postRepository.findById(request.getPostId())
                    .orElseThrow(() -> new SnsException(ErrorCode.POST_NOT_FOUND));
            likeRepository.findByUserAndPost(user, post).ifPresent(existing -> {
                throw new SnsException(ErrorCode.DUPLICATED_RESOURCE, "이미 좋아요를 눌렀습니다.");
            });
            Like like = Like.builder()
                    .user(user)
                    .post(post)
                    .build();
            Like savedLike = likeRepository.save(like);
            
            // 자신의 게시물이 아닌 경우에만 알림 생성
            if (!post.getUser().getId().equals(user.getId())) {
                notificationService.createNotification(
                        post.getUser().getId(),  // 알림을 받을 사용자 (게시물 작성자)
                        user.getId(),            // 알림을 발생시킨 사용자 (좋아요 누른 사람)
                        NotificationType.LIKE,
                        post.getId(),            // 게시물 ID
                        null,                    // 댓글 ID
                        null                     // 팔로우 ID
                );
            }
            
            return toResponse(savedLike);
        } else if (request.getCommentId() != null) {
            Comment comment = commentRepository.findById(request.getCommentId())
                    .orElseThrow(() -> new SnsException(ErrorCode.COMMENT_NOT_FOUND));
            likeRepository.findByUserAndComment(user, comment).ifPresent(existing -> {
                throw new SnsException(ErrorCode.DUPLICATED_RESOURCE, "이미 좋아요를 눌렀습니다.");
            });
            Like like = Like.builder()
                    .user(user)
                    .comment(comment)
                    .build();
            Like savedLike = likeRepository.save(like);
            
            // 자신의 댓글이 아닌 경우에만 알림 생성
            if (!comment.getUser().getId().equals(user.getId())) {
                notificationService.createNotification(
                        comment.getUser().getId(),  // 알림을 받을 사용자 (댓글 작성자)
                        user.getId(),               // 알림을 발생시킨 사용자 (좋아요 누른 사람)
                        NotificationType.LIKE,
                        comment.getPost().getId(),  // 게시물 ID
                        comment.getId(),            // 댓글 ID
                        null                        // 팔로우 ID
                );
            }
            
            return toResponse(savedLike);
        }
        throw new SnsException(ErrorCode.INVALID_REQUEST, "postId 또는 commentId가 필요합니다.");
    }

    @Transactional
    public void unlike(LikeRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new SnsException(ErrorCode.USER_NOT_FOUND));

        if (request.getPostId() != null) {
            Post post = postRepository.findById(request.getPostId())
                    .orElseThrow(() -> new SnsException(ErrorCode.POST_NOT_FOUND));
            Like like = likeRepository.findByUserAndPost(user, post)
                    .orElseThrow(() -> new SnsException(ErrorCode.INVALID_REQUEST, "좋아요 상태가 아닙니다."));
            likeRepository.delete(like);
        } else if (request.getCommentId() != null) {
            Comment comment = commentRepository.findById(request.getCommentId())
                    .orElseThrow(() -> new SnsException(ErrorCode.COMMENT_NOT_FOUND));
            Like like = likeRepository.findByUserAndComment(user, comment)
                    .orElseThrow(() -> new SnsException(ErrorCode.INVALID_REQUEST, "좋아요 상태가 아닙니다."));
            likeRepository.delete(like);
        } else {
            throw new SnsException(ErrorCode.INVALID_REQUEST, "postId 또는 commentId가 필요합니다.");
        }
    }

    private LikeResponse toResponse(Like like) {
        return LikeResponse.builder()
                .id(like.getId())
                .userId(like.getUser().getId())
                .postId(like.getPost() != null ? like.getPost().getId() : null)
                .commentId(like.getComment() != null ? like.getComment().getId() : null)
                .build();
    }
}

