package com.sns.repository;

import com.sns.entity.Post;
import com.sns.entity.ScrappedPost;
import com.sns.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ScrappedPostRepository extends JpaRepository<ScrappedPost, Long> {
    boolean existsByUserAndPost(User user, Post post);
    Optional<ScrappedPost> findByUserAndPost(User user, Post post);
    List<ScrappedPost> findAllByUser(User user);
}


