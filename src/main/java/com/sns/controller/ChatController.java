package com.sns.controller;

import com.sns.common.ApiResponse;
import com.sns.dto.chat.ChatDto.ChatRoomResponse;
import com.sns.dto.chat.ChatDto.ChatRoomWithMessages;
import com.sns.dto.chat.ChatDto.CreateRoomRequest;
import com.sns.dto.chat.ChatDto.MessageResponse;
import com.sns.dto.chat.ChatDto.SendMessageRequest;
import com.sns.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chats")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping("/rooms")
    public ApiResponse<ChatRoomResponse> createRoom(@RequestBody CreateRoomRequest request) {
        return ApiResponse.ok(chatService.createRoom(request));
    }

    @GetMapping("/rooms/{roomId}")
    public ApiResponse<ChatRoomWithMessages> getRoom(@PathVariable Long roomId) {
        return ApiResponse.ok(chatService.getRoomWithMessages(roomId));
    }

    @GetMapping("/rooms/user/{userId}")
    public ApiResponse<List<ChatRoomResponse>> getRoomsByUser(@PathVariable Long userId) {
        return ApiResponse.ok(chatService.getRoomsByUser(userId));
    }

    @PostMapping("/messages")
    public ApiResponse<MessageResponse> sendMessage(@RequestBody SendMessageRequest request) {
        return ApiResponse.ok(chatService.sendMessage(request));
    }
}

