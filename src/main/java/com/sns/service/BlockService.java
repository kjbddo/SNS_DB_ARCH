package com.sns.service;

import com.sns.common.ErrorCode;
import com.sns.common.SnsException;
import com.sns.entity.Block;
import com.sns.entity.User;
import com.sns.repository.BlockRepository;
import com.sns.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class BlockService {

    private final BlockRepository blockRepository;
    private final UserRepository userRepository;

    @Transactional
    public void block(Long blockerId, Long blockedId) {
        if (blockerId.equals(blockedId)) {
            throw new SnsException(ErrorCode.INVALID_REQUEST, "자기 자신을 차단할 수 없습니다.");
        }
        User blocker = userRepository.findById(blockerId)
                .orElseThrow(() -> new SnsException(ErrorCode.USER_NOT_FOUND));
        User blocked = userRepository.findById(blockedId)
                .orElseThrow(() -> new SnsException(ErrorCode.USER_NOT_FOUND));

        if (blockRepository.existsByBlockerAndBlocked(blocker, blocked)) {
            throw new SnsException(ErrorCode.DUPLICATED_RESOURCE, "이미 차단된 사용자입니다.");
        }

        Block block = Block.builder()
                .blocker(blocker)
                .blocked(blocked)
                .build();
        blockRepository.save(block);
    }

    @Transactional
    public void unblock(Long blockerId, Long blockedId) {
        User blocker = userRepository.findById(blockerId)
                .orElseThrow(() -> new SnsException(ErrorCode.USER_NOT_FOUND));
        User blocked = userRepository.findById(blockedId)
                .orElseThrow(() -> new SnsException(ErrorCode.USER_NOT_FOUND));

        Block block = blockRepository.findByBlockerAndBlocked(blocker, blocked)
                .orElseThrow(() -> new SnsException(ErrorCode.INVALID_REQUEST, "차단 상태가 아닙니다."));
        blockRepository.delete(block);
    }
}

