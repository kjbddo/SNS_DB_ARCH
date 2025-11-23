package com.sns.repository;

import com.sns.entity.Comment;
import com.sns.entity.Like;
import com.sns.entity.Post;
import com.sns.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LikeRepository extends JpaRepository<Like, Long> {
    Optional<Like> findByUserAndPost(User user, Post post);
    Optional<Like> findByUserAndComment(User user, Comment comment);
    long countByPost(Post post);
    long countByComment(Comment comment);
}


