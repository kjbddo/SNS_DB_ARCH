package com.sns.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Controller
public class ApiViewController {

    @GetMapping("/api-docs")
    public String apiDocs(Model model) {
        model.addAttribute("apiGroups", apiGroups());
        return "api-docs";
    }

    private List<ApiGroup> apiGroups() {
        return List.of(
                new ApiGroup("사용자", List.of(
                        new ApiEndpoint("POST", "/api/users", "회원가입", "Body: RegisterRequest"),
                        new ApiEndpoint("POST", "/api/users/login", "로그인", "Body: LoginRequest"),
                        new ApiEndpoint("PUT", "/api/users/{userId}", "프로필 수정", "Body: UpdateProfileRequest"),
                        new ApiEndpoint("GET", "/api/users/{userId}", "프로필 조회", "-"),
                        new ApiEndpoint("GET", "/api/users/search", "사용자 검색", "Query: q")
                )),
                new ApiGroup("게시물", List.of(
                        new ApiEndpoint("POST", "/api/posts", "게시물 작성", "Body: CreateRequest"),
                        new ApiEndpoint("PUT", "/api/posts/{postId}", "게시물 수정", "Query: userId, Body: UpdateRequest"),
                        new ApiEndpoint("DELETE", "/api/posts/{postId}", "게시물 삭제", "Query: userId"),
                        new ApiEndpoint("GET", "/api/posts/{postId}", "게시물 상세 조회", "-"),
                        new ApiEndpoint("GET", "/api/posts/user/{userId}", "사용자 게시물 목록", "-"),
                        new ApiEndpoint("GET", "/api/posts/feed/{userId}", "피드 게시물 목록", "-")
                )),
                new ApiGroup("댓글", List.of(
                        new ApiEndpoint("POST", "/api/comments", "댓글 작성", "Body: CreateRequest"),
                        new ApiEndpoint("PUT", "/api/comments/{commentId}", "댓글 수정", "Query: userId, Body: UpdateRequest"),
                        new ApiEndpoint("DELETE", "/api/comments/{commentId}", "댓글 삭제", "Query: userId"),
                        new ApiEndpoint("GET", "/api/comments/post/{postId}", "게시물 댓글 목록", "-")
                )),
                new ApiGroup("좋아요", List.of(
                        new ApiEndpoint("POST", "/api/likes", "좋아요 추가", "Body: LikeRequest"),
                        new ApiEndpoint("DELETE", "/api/likes", "좋아요 취소", "Body: LikeRequest")
                )),
                new ApiGroup("팔로우", List.of(
                        new ApiEndpoint("POST", "/api/follows", "팔로우", "Query: followerId, followingId"),
                        new ApiEndpoint("DELETE", "/api/follows", "언팔로우", "Query: followerId, followingId"),
                        new ApiEndpoint("GET", "/api/follows/followers/{userId}", "팔로워 목록", "-"),
                        new ApiEndpoint("GET", "/api/follows/followings/{userId}", "팔로잉 목록", "-")
                )),
                new ApiGroup("차단", List.of(
                        new ApiEndpoint("POST", "/api/blocks", "차단", "Query: blockerId, blockedId"),
                        new ApiEndpoint("DELETE", "/api/blocks", "차단 해제", "Query: blockerId, blockedId")
                )),
                new ApiGroup("스토리", List.of(
                        new ApiEndpoint("POST", "/api/stories", "스토리 생성", "Body: CreateRequest"),
                        new ApiEndpoint("GET", "/api/stories/user/{userId}", "사용자 스토리 조회", "-"),
                        new ApiEndpoint("POST", "/api/stories/{storyId}/view", "스토리 조회 기록", "Query: viewerId")
                )),
                new ApiGroup("해시태그", List.of(
                        new ApiEndpoint("GET", "/api/hashtags/search", "해시태그별 게시물 검색", "Query: tag")
                )),
                new ApiGroup("채팅", List.of(
                        new ApiEndpoint("POST", "/api/chats/rooms", "채팅방 생성", "Body: CreateRoomRequest"),
                        new ApiEndpoint("GET", "/api/chats/rooms/{roomId}", "채팅방 및 메시지 조회", "-"),
                        new ApiEndpoint("GET", "/api/chats/rooms/user/{userId}", "사용자 채팅방 목록", "-"),
                        new ApiEndpoint("POST", "/api/chats/messages", "메시지 전송", "Body: SendMessageRequest")
                )),
                new ApiGroup("알림", List.of(
                        new ApiEndpoint("POST", "/api/notifications", "알림 생성", "Body: CreateNotificationRequest"),
                        new ApiEndpoint("GET", "/api/notifications/user/{userId}", "사용자 알림 목록", "-"),
                        new ApiEndpoint("POST", "/api/notifications/{notificationId}/read", "알림 읽음 처리", "-")
                )),
                new ApiGroup("신고", List.of(
                        new ApiEndpoint("POST", "/api/reports", "신고 생성", "Body: CreateReportRequest"),
                        new ApiEndpoint("PUT", "/api/reports/{reportId}/status", "신고 상태 변경", "Body: UpdateStatusRequest"),
                        new ApiEndpoint("GET", "/api/reports/reporter/{reporterId}", "사용자 신고 목록", "-")
                )),
                new ApiGroup("스크랩", List.of(
                        new ApiEndpoint("POST", "/api/scraps", "게시물 스크랩", "Body: ScrapRequest"),
                        new ApiEndpoint("DELETE", "/api/scraps", "스크랩 취소", "Body: ScrapRequest"),
                        new ApiEndpoint("GET", "/api/scraps/user/{userId}", "사용자 스크랩 목록", "-")
                )),
                new ApiGroup("저장 컬렉션", List.of(
                        new ApiEndpoint("POST", "/api/collections", "컬렉션 생성", "Body: CreateCollectionRequest"),
                        new ApiEndpoint("PUT", "/api/collections/{collectionId}", "컬렉션 수정", "Query: userId, Body: UpdateCollectionRequest"),
                        new ApiEndpoint("DELETE", "/api/collections/{collectionId}", "컬렉션 삭제", "Query: userId"),
                        new ApiEndpoint("GET", "/api/collections/user/{userId}", "사용자 컬렉션 목록", "-"),
                        new ApiEndpoint("POST", "/api/collections/saved", "게시물 저장", "Body: SavePostRequest"),
                        new ApiEndpoint("DELETE", "/api/collections/saved/{savedPostId}", "저장 게시물 제거", "Query: userId"),
                        new ApiEndpoint("GET", "/api/collections/saved", "저장된 게시물 목록", "Query: userId, collectionId(optional)")
                ))
        );
    }

    private record ApiGroup(String title, List<ApiEndpoint> endpoints) {
    }

    private record ApiEndpoint(String method, String path, String description, String payload) {
    }
}


