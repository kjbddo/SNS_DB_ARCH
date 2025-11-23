package com.sns.controller;

import com.sns.common.ApiResponse;
import com.sns.dto.story.StoryDto.CreateRequest;
import com.sns.dto.story.StoryDto.StoryResponse;
import com.sns.service.StoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stories")
@RequiredArgsConstructor
public class StoryController {

    private final StoryService storyService;

    @PostMapping
    public ApiResponse<StoryResponse> createStory(@RequestBody CreateRequest request) {
        return ApiResponse.ok(storyService.create(request));
    }

    @GetMapping("/user/{userId}")
    public ApiResponse<List<StoryResponse>> getStories(@PathVariable Long userId) {
        return ApiResponse.ok(storyService.getActiveStories(userId));
    }

    @PostMapping("/{storyId}/view")
    public ApiResponse<Void> viewStory(@PathVariable Long storyId, @RequestParam Long viewerId) {
        storyService.viewStory(storyId, viewerId);
        return ApiResponse.ok();
    }
}

