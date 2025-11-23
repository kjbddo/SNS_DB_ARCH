package com.sns.repository;

import com.sns.entity.ChatRoom;
import com.sns.entity.DirectMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DirectMessageRepository extends JpaRepository<DirectMessage, Long> {
    List<DirectMessage> findAllByChatRoomOrderByCreatedAtAsc(ChatRoom chatRoom);
    Optional<DirectMessage> findTopByChatRoomOrderByCreatedAtDesc(ChatRoom chatRoom);
}


