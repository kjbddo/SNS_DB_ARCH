package com.sns.repository;

import com.sns.entity.Post;
import com.sns.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findAllByUserOrderByCreatedAtDesc(User user);
    long countByUser(User user);
    List<Post> findAllByUserInOrderByCreatedAtDesc(List<User> users);
}


