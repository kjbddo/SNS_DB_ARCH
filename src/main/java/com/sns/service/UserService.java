package com.sns.service;

import com.sns.common.ErrorCode;
import com.sns.common.SnsException;
import com.sns.dto.user.UserDto.LoginRequest;
import com.sns.dto.user.UserDto.LoginResponse;
import com.sns.dto.user.UserDto.RegisterRequest;
import com.sns.dto.user.UserDto.UpdateProfileRequest;
import com.sns.dto.user.UserDto.UserResponse;
import com.sns.entity.User;
import com.sns.repository.FollowRepository;
import com.sns.repository.PostRepository;
import com.sns.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final FollowRepository followRepository;
    private final PostRepository postRepository;

    @Transactional
    public UserResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new SnsException(ErrorCode.DUPLICATED_RESOURCE, "이미 존재하는 사용자명입니다.");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new SnsException(ErrorCode.DUPLICATED_RESOURCE, "이미 존재하는 이메일입니다.");
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(request.getPassword()) // TODO: 추후 암호화 적용
                .name(request.getName())
                .isPrivate(false)
                .build();

        return toResponse(userRepository.save(user));
    }

    @Transactional
    public UserResponse updateProfile(Long userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new SnsException(ErrorCode.USER_NOT_FOUND));

        if (request.getName() != null) user.setName(request.getName());
        if (request.getBio() != null) user.setBio(request.getBio());
        if (request.getProfileImageUrl() != null) user.setProfileImageUrl(request.getProfileImageUrl());
        if (request.getIsPrivate() != null) user.setIsPrivate(request.getIsPrivate());

        return toResponse(user);
    }

    @Transactional(readOnly = true)
    public UserResponse getProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new SnsException(ErrorCode.USER_NOT_FOUND));
        return toResponse(user);
    }

    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new SnsException(ErrorCode.USER_NOT_FOUND, "사용자명 또는 비밀번호가 올바르지 않습니다."));
        
        // TODO: 추후 비밀번호 암호화 적용 시 BCrypt 등으로 검증
        if (!user.getPassword().equals(request.getPassword())) {
            throw new SnsException(ErrorCode.INVALID_REQUEST, "사용자명 또는 비밀번호가 올바르지 않습니다.");
        }

        // TODO: JWT 토큰 생성 로직 추가
        String token = "temp_token_" + user.getId(); // 임시 토큰

        return LoginResponse.builder()
                .userId(user.getId())
                .username(user.getUsername())
                .token(token)
                .build();
    }

    @Transactional(readOnly = true)
    public List<UserResponse> searchUsers(String query) {
        List<User> users = userRepository.findByUsernameContainingIgnoreCaseOrNameContainingIgnoreCase(query, query);
        return users.stream()
                .map(this::toResponse)
                .toList();
    }

    private UserResponse toResponse(User user) {
        long followerCount = followRepository.countByFollowing(user);
        long followingCount = followRepository.countByFollower(user);
        long postCount = postRepository.countByUser(user);

        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .name(user.getName())
                .bio(user.getBio())
                .profileImageUrl(user.getProfileImageUrl())
                .isPrivate(user.getIsPrivate())
                .followerCount(followerCount)
                .followingCount(followingCount)
                .postCount(postCount)
                .build();
    }
}

