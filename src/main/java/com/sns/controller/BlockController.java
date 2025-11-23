package com.sns.controller;

import com.sns.common.ApiResponse;
import com.sns.service.BlockService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/blocks")
@RequiredArgsConstructor
public class BlockController {

    private final BlockService blockService;

    @PostMapping
    public ApiResponse<Void> block(@RequestParam Long blockerId, @RequestParam Long blockedId) {
        blockService.block(blockerId, blockedId);
        return ApiResponse.ok();
    }

    @DeleteMapping
    public ApiResponse<Void> unblock(@RequestParam Long blockerId, @RequestParam Long blockedId) {
        blockService.unblock(blockerId, blockedId);
        return ApiResponse.ok();
    }
}

