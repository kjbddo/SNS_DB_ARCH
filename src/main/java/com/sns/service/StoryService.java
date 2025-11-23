package com.sns.service;

import com.sns.common.ErrorCode;
import com.sns.common.SnsException;
import com.sns.dto.story.StoryDto.CreateRequest;
import com.sns.dto.story.StoryDto.StoryResponse;
import com.sns.entity.Story;
import com.sns.entity.StoryView;
import com.sns.entity.User;
import com.sns.repository.StoryRepository;
import com.sns.repository.StoryViewRepository;
import com.sns.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StoryService {

    private final StoryRepository storyRepository;
    private final StoryViewRepository storyViewRepository;
    private final UserRepository userRepository;

    @Transactional
    public StoryResponse create(CreateRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new SnsException(ErrorCode.USER_NOT_FOUND));

        Story story = Story.builder()
                .user(user)
                .imageUrl(request.getImageUrl())
                .videoUrl(request.getVideoUrl())
                .text(request.getText())
                .expiresAt(LocalDateTime.now().plusHours(24))
                .build();

        return toResponse(storyRepository.save(story));
    }

    @Transactional(readOnly = true)
    public List<StoryResponse> getActiveStories(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new SnsException(ErrorCode.USER_NOT_FOUND));
        return storyRepository.findAllByUserAndExpiresAtAfterOrderByCreatedAtDesc(user, LocalDateTime.now())
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void viewStory(Long storyId, Long viewerId) {
        Story story = storyRepository.findById(storyId)
                .orElseThrow(() -> new SnsException(ErrorCode.STORY_NOT_FOUND));
        if (story.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new SnsException(ErrorCode.INVALID_REQUEST, "만료된 스토리입니다.");
        }
        User viewer = userRepository.findById(viewerId)
                .orElseThrow(() -> new SnsException(ErrorCode.USER_NOT_FOUND));

        storyViewRepository.findByUserAndStory(viewer, story)
                .orElseGet(() -> storyViewRepository.save(StoryView.builder()
                        .user(viewer)
                        .story(story)
                        .build()));
    }

    private StoryResponse toResponse(Story story) {
        long viewCount = storyViewRepository.countByStory(story);
        return StoryResponse.builder()
                .id(story.getId())
                .userId(story.getUser().getId())
                .username(story.getUser().getUsername())
                .profileImageUrl(story.getUser().getProfileImageUrl())
                .imageUrl(story.getImageUrl())
                .videoUrl(story.getVideoUrl())
                .text(story.getText())
                .viewCount(viewCount)
                .createdAt(story.getCreatedAt())
                .build();
    }
}

