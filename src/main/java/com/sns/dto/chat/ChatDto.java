package com.sns.dto.chat;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

public class ChatDto {

    @Getter
    @Setter
    public static class CreateRoomRequest {
        private Long user1Id;
        private Long user2Id;
    }

    @Getter
    @Builder
    public static class ChatRoomResponse {
        private Long id;
        private Long user1Id;
        private Long user2Id;
        private Long otherUserId;
        private String otherUsername;
        private String otherProfileImageUrl;
        private String lastMessage;
        private java.time.LocalDateTime lastMessageAt;
    }

    @Getter
    @Setter
    public static class SendMessageRequest {
        private Long chatRoomId;
        private Long senderId;
        private Long receiverId;
        private String content;
        private String imageUrl;
    }

    @Getter
    @Builder
    public static class MessageResponse {
        private Long id;
        private Long chatRoomId;
        private Long senderId;
        private Long receiverId;
        private String content;
        private String imageUrl;
        private boolean read;
    }

    @Getter
    @Builder
    public static class ChatRoomWithMessages {
        private ChatRoomResponse room;
        private List<MessageResponse> messages;
    }
}

