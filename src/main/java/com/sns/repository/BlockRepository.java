package com.sns.repository;

import com.sns.entity.Block;
import com.sns.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BlockRepository extends JpaRepository<Block, Long> {
    boolean existsByBlockerAndBlocked(User blocker, User blocked);
    Optional<Block> findByBlockerAndBlocked(User blocker, User blocked);
}


