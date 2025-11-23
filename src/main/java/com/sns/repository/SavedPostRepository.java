package com.sns.repository;

import com.sns.entity.Post;
import com.sns.entity.SavedCollection;
import com.sns.entity.SavedPost;
import com.sns.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SavedPostRepository extends JpaRepository<SavedPost, Long> {
    Optional<SavedPost> findByUserAndPostAndCollection(User user, Post post, SavedCollection collection);
    List<SavedPost> findAllByUser(User user);
    List<SavedPost> findAllByCollection(SavedCollection collection);
}


