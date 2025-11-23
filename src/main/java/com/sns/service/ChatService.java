package com.sns.service;

import com.sns.common.ErrorCode;
import com.sns.common.SnsException;
import com.sns.dto.chat.ChatDto.ChatRoomResponse;
import com.sns.dto.chat.ChatDto.ChatRoomWithMessages;
import com.sns.dto.chat.ChatDto.CreateRoomRequest;
import com.sns.dto.chat.ChatDto.MessageResponse;
import com.sns.dto.chat.ChatDto.SendMessageRequest;
import com.sns.entity.ChatRoom;
import com.sns.entity.DirectMessage;
import com.sns.entity.User;
import com.sns.repository.ChatRoomRepository;
import com.sns.repository.DirectMessageRepository;
import com.sns.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatRoomRepository chatRoomRepository;
    private final DirectMessageRepository directMessageRepository;
    private final UserRepository userRepository;

    @Transactional
    public ChatRoomResponse createRoom(CreateRoomRequest request) {
        User user1 = userRepository.findById(request.getUser1Id())
                .orElseThrow(() -> new SnsException(ErrorCode.USER_NOT_FOUND));
        User user2 = userRepository.findById(request.getUser2Id())
                .orElseThrow(() -> new SnsException(ErrorCode.USER_NOT_FOUND));

        ChatRoom room = findRoom(user1, user2)
                .orElseGet(() -> {
                    ChatRoom newRoom = ChatRoom.builder()
                            .user1(user1)
                            .user2(user2)
                            .build();
                    return chatRoomRepository.save(newRoom);
                });
        return toRoomResponse(room);
    }

    @Transactional
    public MessageResponse sendMessage(SendMessageRequest request) {
        ChatRoom room = chatRoomRepository.findById(request.getChatRoomId())
                .orElseThrow(() -> new SnsException(ErrorCode.CHAT_ROOM_NOT_FOUND));
        User sender = userRepository.findById(request.getSenderId())
                .orElseThrow(() -> new SnsException(ErrorCode.USER_NOT_FOUND));
        User receiver = userRepository.findById(request.getReceiverId())
                .orElseThrow(() -> new SnsException(ErrorCode.USER_NOT_FOUND));

        if (!isParticipant(room, sender) || !isParticipant(room, receiver)) {
            throw new SnsException(ErrorCode.ACCESS_DENIED);
        }

        DirectMessage message = DirectMessage.builder()
                .chatRoom(room)
                .sender(sender)
                .receiver(receiver)
                .content(request.getContent())
                .imageUrl(request.getImageUrl())
                .build();

        return toMessageResponse(directMessageRepository.save(message));
    }

    @Transactional(readOnly = true)
    public ChatRoomWithMessages getRoomWithMessages(Long roomId) {
        ChatRoom room = chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new SnsException(ErrorCode.CHAT_ROOM_NOT_FOUND));
        List<MessageResponse> messages = directMessageRepository.findAllByChatRoomOrderByCreatedAtAsc(room)
                .stream()
                .map(this::toMessageResponse)
                .collect(Collectors.toList());
        return ChatRoomWithMessages.builder()
                .room(toRoomResponse(room))
                .messages(messages)
                .build();
    }

    @Transactional(readOnly = true)
    public List<ChatRoomResponse> getRoomsByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new SnsException(ErrorCode.USER_NOT_FOUND));
        return chatRoomRepository.findByUser1OrUser2OrderByLastMessageAtDesc(user, user)
                .stream()
                .map(room -> toRoomResponse(room, userId))
                .collect(Collectors.toList());
    }

    private boolean isParticipant(ChatRoom room, User user) {
        return room.getUser1().getId().equals(user.getId()) || room.getUser2().getId().equals(user.getId());
    }

    private java.util.Optional<ChatRoom> findRoom(User user1, User user2) {
        if (user1.getId() < user2.getId()) {
            return chatRoomRepository.findByUser1AndUser2(user1, user2);
        }
        return chatRoomRepository.findByUser2AndUser1(user1, user2);
    }

    private ChatRoomResponse toRoomResponse(ChatRoom room) {
        return toRoomResponse(room, null);
    }

    private ChatRoomResponse toRoomResponse(ChatRoom room, Long currentUserId) {
        User otherUser = (currentUserId != null && room.getUser1().getId().equals(currentUserId))
            ? room.getUser2() : room.getUser1();
        DirectMessage lastMessage = directMessageRepository
            .findTopByChatRoomOrderByCreatedAtDesc(room)
            .orElse(null);
        
        return ChatRoomResponse.builder()
                .id(room.getId())
                .user1Id(room.getUser1().getId())
                .user2Id(room.getUser2().getId())
                .otherUserId(otherUser.getId())
                .otherUsername(otherUser.getUsername())
                .otherProfileImageUrl(otherUser.getProfileImageUrl())
                .lastMessage(lastMessage != null ? lastMessage.getContent() : null)
                .lastMessageAt(room.getLastMessageAt())
                .build();
    }

    private MessageResponse toMessageResponse(DirectMessage message) {
        return MessageResponse.builder()
                .id(message.getId())
                .chatRoomId(message.getChatRoom().getId())
                .senderId(message.getSender().getId())
                .receiverId(message.getReceiver().getId())
                .content(message.getContent())
                .imageUrl(message.getImageUrl())
                .read(Boolean.TRUE.equals(message.getIsRead()))
                .build();
    }
}

