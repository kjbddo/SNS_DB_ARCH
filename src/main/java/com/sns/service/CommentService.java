package com.sns.service;

import com.sns.common.ErrorCode;
import com.sns.common.SnsException;
import com.sns.dto.comment.CommentDto.CommentResponse;
import com.sns.dto.comment.CommentDto.CreateRequest;
import com.sns.dto.comment.CommentDto.UpdateRequest;
import com.sns.entity.Comment;
import com.sns.entity.Post;
import com.sns.entity.User;
import com.sns.repository.CommentRepository;
import com.sns.repository.PostRepository;
import com.sns.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    @Transactional
    public CommentResponse create(CreateRequest request) {
        Post post = postRepository.findById(request.getPostId())
                .orElseThrow(() -> new SnsException(ErrorCode.POST_NOT_FOUND));
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new SnsException(ErrorCode.USER_NOT_FOUND));
        Comment parent = null;
        if (request.getParentCommentId() != null) {
            parent = commentRepository.findById(request.getParentCommentId())
                    .orElseThrow(() -> new SnsException(ErrorCode.COMMENT_NOT_FOUND));
        }

        Comment comment = Comment.builder()
                .post(post)
                .user(user)
                .parentComment(parent)
                .content(request.getContent())
                .build();

        return toResponse(commentRepository.save(comment));
    }

    @Transactional
    public CommentResponse update(Long commentId, Long userId, UpdateRequest request) {
        Comment comment = getOwnedComment(commentId, userId);
        comment.setContent(request.getContent());
        return toResponse(comment);
    }

    @Transactional
    public void delete(Long commentId, Long userId) {
        Comment comment = getOwnedComment(commentId, userId);
        commentRepository.delete(comment);
    }

    @Transactional(readOnly = true)
    public List<CommentResponse> getComments(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new SnsException(ErrorCode.POST_NOT_FOUND));
        return commentRepository.findAllByPostOrderByCreatedAtAsc(post)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private Comment getOwnedComment(Long commentId, Long userId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new SnsException(ErrorCode.COMMENT_NOT_FOUND));
        if (!comment.getUser().getId().equals(userId)) {
            throw new SnsException(ErrorCode.ACCESS_DENIED);
        }
        return comment;
    }

    private CommentResponse toResponse(Comment comment) {
        return CommentResponse.builder()
                .id(comment.getId())
                .postId(comment.getPost().getId())
                .userId(comment.getUser().getId())
                .parentCommentId(comment.getParentComment() != null ? comment.getParentComment().getId() : null)
                .content(comment.getContent())
                .build();
    }
}

