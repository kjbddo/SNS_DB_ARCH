package com.sns.repository;

import com.sns.entity.Story;
import com.sns.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface StoryRepository extends JpaRepository<Story, Long> {
    List<Story> findAllByUserAndExpiresAtAfterOrderByCreatedAtDesc(User user, LocalDateTime now);
}


