package com.sns.repository;

import com.sns.entity.Story;
import com.sns.entity.StoryView;
import com.sns.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StoryViewRepository extends JpaRepository<StoryView, Long> {
    Optional<StoryView> findByUserAndStory(User user, Story story);
    long countByStory(Story story);
}


