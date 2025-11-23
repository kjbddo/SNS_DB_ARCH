package com.sns.controller;

import com.sns.common.ApiResponse;
import com.sns.dto.scrap.ScrapDto.ScrapRequest;
import com.sns.dto.scrap.ScrapDto.ScrapResponse;
import com.sns.service.ScrapService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/scraps")
@RequiredArgsConstructor
public class ScrapController {

    private final ScrapService scrapService;

    @PostMapping
    public ApiResponse<ScrapResponse> scrap(@RequestBody ScrapRequest request) {
        return ApiResponse.ok(scrapService.scrap(request));
    }

    @DeleteMapping
    public ApiResponse<Void> unscrap(@RequestBody ScrapRequest request) {
        scrapService.unscrap(request);
        return ApiResponse.ok();
    }

    @GetMapping("/user/{userId}")
    public ApiResponse<List<ScrapResponse>> getScraps(@PathVariable Long userId) {
        return ApiResponse.ok(scrapService.getScraps(userId));
    }
}

