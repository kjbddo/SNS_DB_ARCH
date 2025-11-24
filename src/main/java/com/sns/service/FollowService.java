package com.sns.service;

import com.sns.common.ErrorCode;
import com.sns.common.SnsException;
import com.sns.dto.follow.FollowDto.FollowResponse;
import com.sns.dto.follow.FollowDto.UserFollowResponse;
import com.sns.entity.Follow;
import com.sns.entity.Notification.NotificationType;
import com.sns.entity.User;
import com.sns.repository.FollowRepository;
import com.sns.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FollowService {

    private final FollowRepository followRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Transactional
    public FollowResponse follow(Long followerId, Long followingId) {
        if (followerId.equals(followingId)) {
            throw new SnsException(ErrorCode.INVALID_REQUEST, "자기 자신을 팔로우할 수 없습니다.");
        }
        User follower = userRepository.findById(followerId)
                .orElseThrow(() -> new SnsException(ErrorCode.USER_NOT_FOUND));
        User following = userRepository.findById(followingId)
                .orElseThrow(() -> new SnsException(ErrorCode.USER_NOT_FOUND));

        if (followRepository.existsByFollowerAndFollowing(follower, following)) {
            throw new SnsException(ErrorCode.DUPLICATED_RESOURCE, "이미 팔로우 중입니다.");
        }

        Follow follow = Follow.builder()
                .follower(follower)
                .following(following)
                .build();

        Follow savedFollow = followRepository.save(follow);
        
        // 팔로우 당한 사용자에게 알림 생성
        notificationService.createNotification(
                following.getId(),  // 알림을 받을 사용자 (팔로우 당한 사람)
                follower.getId(),   // 알림을 발생시킨 사용자 (팔로우 한 사람)
                NotificationType.FOLLOW,
                null,               // 게시물 ID
                null,               // 댓글 ID
                savedFollow.getId() // 팔로우 ID
        );
        
        return toResponse(savedFollow);
    }

    @Transactional
    public void unfollow(Long followerId, Long followingId) {
        User follower = userRepository.findById(followerId)
                .orElseThrow(() -> new SnsException(ErrorCode.USER_NOT_FOUND));
        User following = userRepository.findById(followingId)
                .orElseThrow(() -> new SnsException(ErrorCode.USER_NOT_FOUND));

        Follow follow = followRepository.findByFollowerAndFollowing(follower, following)
                .orElseThrow(() -> new SnsException(ErrorCode.FOLLOW_RELATION_NOT_FOUND));
        followRepository.delete(follow);
    }

    @Transactional(readOnly = true)
    public List<UserFollowResponse> getFollowers(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new SnsException(ErrorCode.USER_NOT_FOUND));
        return followRepository.findAllByFollowing(user)
                .stream()
                .map(follow -> toUserResponse(follow.getFollower(), userId))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<UserFollowResponse> getFollowings(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new SnsException(ErrorCode.USER_NOT_FOUND));
        return followRepository.findAllByFollower(user)
                .stream()
                .map(follow -> toUserResponse(follow.getFollowing(), userId))
                .collect(Collectors.toList());
    }

    private FollowResponse toResponse(Follow follow) {
        return FollowResponse.builder()
                .id(follow.getId())
                .followerId(follow.getFollower().getId())
                .followingId(follow.getFollowing().getId())
                .build();
    }

    private UserFollowResponse toUserResponse(User user, Long currentUserId) {
        boolean isFollowing = currentUserId != null && 
                followRepository.existsByFollowerAndFollowing(
                        userRepository.findById(currentUserId).orElse(null), 
                        user);
        return UserFollowResponse.builder()
                .userId(user.getId())
                .username(user.getUsername())
                .name(user.getName())
                .profileImageUrl(user.getProfileImageUrl())
                .isFollowing(isFollowing)
                .build();
    }
}

