package com.sns.controller;

import com.sns.common.ApiResponse;
import com.sns.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileController {

    private final FileStorageService fileStorageService;

    @PostMapping("/upload/profile")
    public ApiResponse<Map<String, String>> uploadProfileImage(@RequestParam("file") MultipartFile file) {
        String url = fileStorageService.uploadProfileImage(file);
        Map<String, String> response = new HashMap<>();
        response.put("url", url);
        return ApiResponse.ok(response);
    }

    @PostMapping("/upload/post/image")
    public ApiResponse<Map<String, String>> uploadPostImage(@RequestParam("file") MultipartFile file) {
        String url = fileStorageService.uploadPostImage(file);
        Map<String, String> response = new HashMap<>();
        response.put("url", url);
        return ApiResponse.ok(response);
    }

    @PostMapping("/upload/post/images")
    public ApiResponse<Map<String, List<String>>> uploadPostImages(@RequestParam("files") List<MultipartFile> files) {
        List<String> urls = fileStorageService.uploadFiles(files, "posts/images");
        Map<String, List<String>> response = new HashMap<>();
        response.put("urls", urls);
        return ApiResponse.ok(response);
    }

    @PostMapping("/upload/post/video")
    public ApiResponse<Map<String, String>> uploadPostVideo(@RequestParam("file") MultipartFile file) {
        String url = fileStorageService.uploadPostVideo(file);
        Map<String, String> response = new HashMap<>();
        response.put("url", url);
        return ApiResponse.ok(response);
    }

    @PostMapping("/upload/post/videos")
    public ApiResponse<Map<String, List<String>>> uploadPostVideos(@RequestParam("files") List<MultipartFile> files) {
        List<String> urls = fileStorageService.uploadFiles(files, "posts/videos");
        Map<String, List<String>> response = new HashMap<>();
        response.put("urls", urls);
        return ApiResponse.ok(response);
    }

    @PostMapping("/upload/story/image")
    public ApiResponse<Map<String, String>> uploadStoryImage(@RequestParam("file") MultipartFile file) {
        String url = fileStorageService.uploadStoryImage(file);
        Map<String, String> response = new HashMap<>();
        response.put("url", url);
        return ApiResponse.ok(response);
    }

    @PostMapping("/upload/story/video")
    public ApiResponse<Map<String, String>> uploadStoryVideo(@RequestParam("file") MultipartFile file) {
        String url = fileStorageService.uploadStoryVideo(file);
        Map<String, String> response = new HashMap<>();
        response.put("url", url);
        return ApiResponse.ok(response);
    }
}

