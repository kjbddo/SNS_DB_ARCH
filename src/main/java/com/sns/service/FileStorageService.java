package com.sns.service;

import com.sns.common.ErrorCode;
import com.sns.common.SnsException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileStorageService {

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    @Value("${file.base-url:http://localhost:8080}")
    private String baseUrl;

    /**
     * 단일 파일 업로드
     */
    public String uploadFile(MultipartFile file, String subDirectory) {
        if (file.isEmpty()) {
            throw new SnsException(ErrorCode.INVALID_REQUEST, "파일이 비어있습니다.");
        }

        try {
            // 파일 확장자 검증
            String originalFilename = file.getOriginalFilename();
            if (originalFilename == null || originalFilename.isEmpty()) {
                throw new SnsException(ErrorCode.INVALID_REQUEST, "파일명이 없습니다.");
            }

            String extension = getFileExtension(originalFilename);
            String fileName = UUID.randomUUID().toString() + extension;
            
            // 저장 디렉토리 생성
            Path uploadPath = Paths.get(uploadDir, subDirectory);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // 파일 저장
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // URL 생성
            return baseUrl + "/media/" + subDirectory + "/" + fileName;
        } catch (IOException e) {
            throw new SnsException(ErrorCode.INTERNAL_ERROR, "파일 저장에 실패했습니다: " + e.getMessage());
        }
    }

    /**
     * 여러 파일 업로드
     */
    public List<String> uploadFiles(List<MultipartFile> files, String subDirectory) {
        List<String> urls = new ArrayList<>();
        for (MultipartFile file : files) {
            if (!file.isEmpty()) {
                urls.add(uploadFile(file, subDirectory));
            }
        }
        return urls;
    }

    /**
     * 프로필 이미지 업로드
     */
    public String uploadProfileImage(MultipartFile file) {
        validateImageFile(file);
        return uploadFile(file, "profiles");
    }

    /**
     * 게시물 이미지 업로드
     */
    public String uploadPostImage(MultipartFile file) {
        validateImageFile(file);
        return uploadFile(file, "posts/images");
    }

    /**
     * 게시물 동영상 업로드
     */
    public String uploadPostVideo(MultipartFile file) {
        validateVideoFile(file);
        return uploadFile(file, "posts/videos");
    }

    /**
     * 스토리 이미지 업로드
     */
    public String uploadStoryImage(MultipartFile file) {
        validateImageFile(file);
        return uploadFile(file, "stories/images");
    }

    /**
     * 스토리 동영상 업로드
     */
    public String uploadStoryVideo(MultipartFile file) {
        validateVideoFile(file);
        return uploadFile(file, "stories/videos");
    }

    /**
     * 파일 확장자 추출
     */
    private String getFileExtension(String filename) {
        int lastDotIndex = filename.lastIndexOf('.');
        if (lastDotIndex == -1) {
            return "";
        }
        return filename.substring(lastDotIndex);
    }

    /**
     * 이미지 파일 검증
     */
    private void validateImageFile(MultipartFile file) {
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new SnsException(ErrorCode.INVALID_REQUEST, "이미지 파일만 업로드 가능합니다.");
        }
    }

    /**
     * 동영상 파일 검증
     */
    private void validateVideoFile(MultipartFile file) {
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("video/")) {
            throw new SnsException(ErrorCode.INVALID_REQUEST, "동영상 파일만 업로드 가능합니다.");
        }
    }
}

