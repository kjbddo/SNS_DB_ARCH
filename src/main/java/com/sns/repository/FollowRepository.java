package com.sns.repository;

import com.sns.entity.Follow;
import com.sns.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FollowRepository extends JpaRepository<Follow, Long> {
    boolean existsByFollowerAndFollowing(User follower, User following);
    Optional<Follow> findByFollowerAndFollowing(User follower, User following);
    long countByFollowing(User following);
    long countByFollower(User follower);
    List<Follow> findAllByFollower(User follower);
    List<Follow> findAllByFollowing(User following);
}


