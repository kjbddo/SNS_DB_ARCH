package com.sns.controller;

import com.sns.common.ApiResponse;
import com.sns.dto.post.PostDto.PostResponse;
import com.sns.service.HashtagService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/hashtags")
@RequiredArgsConstructor
public class HashtagController {

    private final HashtagService hashtagService;

    @GetMapping("/search")
    public ApiResponse<List<PostResponse>> getPostsByHashtag(@RequestParam String tag) {
        return ApiResponse.ok(hashtagService.getPostsByHashtag(tag));
    }
}

