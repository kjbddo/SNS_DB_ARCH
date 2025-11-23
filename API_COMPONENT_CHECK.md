# API 및 컴포넌트 누락 확인 결과

## ✅ 백엔드 API vs 프론트엔드 API 비교

### 1. 사용자 API
- ✅ POST /api/users - register (프론트엔드 구현됨)
- ✅ PUT /api/users/{userId} - updateProfile (프론트엔드 구현됨)
- ✅ GET /api/users/{userId} - getProfile (프론트엔드 구현됨)
- ❌ **누락: 로그인 API** - 백엔드에 로그인 엔드포인트가 없음 (프론트엔드에 TODO로 남아있음)

### 2. 게시물 API
- ✅ POST /api/posts - create (프론트엔드 구현됨)
- ✅ PUT /api/posts/{postId} - update (프론트엔드 구현됨)
- ✅ DELETE /api/posts/{postId} - delete (프론트엔드 구현됨)
- ✅ GET /api/posts/{postId} - getPost (프론트엔드 구현됨)
- ✅ GET /api/posts/user/{userId} - getUserPosts (프론트엔드 구현됨)

### 3. 댓글 API
- ✅ POST /api/comments - create (프론트엔드 구현됨)
- ✅ PUT /api/comments/{commentId} - update (프론트엔드 구현됨)
- ✅ DELETE /api/comments/{commentId} - delete (프론트엔드 구현됨)
- ✅ GET /api/comments/post/{postId} - getComments (프론트엔드 구현됨)

### 4. 좋아요 API
- ✅ POST /api/likes - like (프론트엔드 구현됨)
- ✅ DELETE /api/likes - unlike (프론트엔드 구현됨)

### 5. 팔로우 API
- ✅ POST /api/follows - follow (프론트엔드 구현됨)
- ✅ DELETE /api/follows - unfollow (프론트엔드 구현됨)

### 6. 차단 API
- ✅ POST /api/blocks - block (프론트엔드 구현됨)
- ✅ DELETE /api/blocks - unblock (프론트엔드 구현됨)

### 7. 스토리 API
- ✅ POST /api/stories - create (프론트엔드 구현됨)
- ✅ GET /api/stories/user/{userId} - getStories (프론트엔드 구현됨)
- ✅ POST /api/stories/{storyId}/view - viewStory (프론트엔드 구현됨)

### 8. 해시태그 API
- ✅ GET /api/hashtags/search - search (프론트엔드 구현됨)

### 9. 채팅 API
- ✅ POST /api/chats/rooms - createRoom (프론트엔드 구현됨)
- ✅ GET /api/chats/rooms/{roomId} - getRoom (프론트엔드 구현됨)
- ✅ GET /api/chats/rooms/user/{userId} - getRooms (프론트엔드 구현됨) ⭐ 추가됨
- ✅ POST /api/chats/messages - sendMessage (프론트엔드 구현됨)

### 10. 알림 API
- ✅ POST /api/notifications - create (프론트엔드 구현됨)
- ✅ GET /api/notifications/user/{userId} - getNotifications (프론트엔드 구현됨)
- ✅ POST /api/notifications/{notificationId}/read - markAsRead (프론트엔드 구현됨)

### 11. 신고 API
- ✅ POST /api/reports - create (프론트엔드 구현됨)
- ✅ PUT /api/reports/{reportId}/status - updateStatus (프론트엔드 구현됨, 관리자용)
- ✅ GET /api/reports/reporter/{reporterId} - getReports (프론트엔드 구현됨)

### 12. 스크랩 API
- ✅ POST /api/scraps - scrap (프론트엔드 구현됨)
- ✅ DELETE /api/scraps - unscrap (프론트엔드 구현됨)
- ✅ GET /api/scraps/user/{userId} - getScraps (프론트엔드 구현됨)

### 13. 저장 컬렉션 API
- ✅ POST /api/collections - create (프론트엔드 구현됨)
- ✅ PUT /api/collections/{collectionId} - update (프론트엔드 구현됨)
- ✅ DELETE /api/collections/{collectionId} - delete (프론트엔드 구현됨)
- ✅ GET /api/collections/user/{userId} - getCollections (프론트엔드 구현됨)
- ✅ POST /api/collections/saved - savePost (프론트엔드 구현됨)
- ✅ DELETE /api/collections/saved/{savedPostId} - removeSavedPost (프론트엔드 구현됨)
- ✅ GET /api/collections/saved - getSavedPosts (프론트엔드 구현됨) ⭐ 추가됨

## ✅ 프론트엔드 컴포넌트/페이지 확인

### 페이지 (Pages)
- ✅ Home.jsx - 피드 페이지
- ✅ Login.jsx - 로그인 페이지 (API 미구현)
- ✅ Register.jsx - 회원가입 페이지
- ✅ Profile.jsx - 프로필 페이지
- ✅ PostDetail.jsx - 게시물 상세 페이지
- ✅ CreatePost.jsx - 게시물 작성 페이지
- ✅ EditPost.jsx - 게시물 수정 페이지
- ✅ Story.jsx - 스토리 보기 페이지
- ✅ CreateStory.jsx - 스토리 생성 페이지
- ✅ Chat.jsx - 채팅 페이지
- ✅ Notifications.jsx - 알림 페이지
- ✅ Search.jsx - 검색 페이지
- ✅ Settings.jsx - 설정 페이지
- ✅ Collections.jsx - 컬렉션 목록 페이지
- ✅ CollectionDetail.jsx - 컬렉션 상세 페이지
- ✅ Reports.jsx - 신고 내역 페이지

### 컴포넌트 (Components)
- ✅ Layout.jsx - 레이아웃 컴포넌트
- ✅ Navbar.jsx - 네비게이션 바
- ✅ PostCard.jsx - 게시물 카드 컴포넌트

## ❌ 누락된 항목

### 1. 백엔드 API 누락
- ❌ **로그인 API** - POST /api/auth/login 또는 POST /api/users/login
  - 현재 Login.jsx에서 TODO로 남아있음
  - 백엔드에 로그인 엔드포인트가 없음

### 2. 프론트엔드 컴포넌트 누락
- ❌ **사용자 검색 컴포넌트** - Search.jsx는 해시태그만 검색 가능
  - 사용자 검색 기능이 없음
  - 백엔드에 사용자 검색 API가 있는지 확인 필요

### 3. 추가 개선 사항
- ⚠️ **팔로워/팔로잉 목록 페이지** - Profile.jsx에서 클릭 시 alert만 표시
- ⚠️ **채팅방 생성 시 사용자 검색 UI** - 현재는 prompt 사용
- ⚠️ **이미지 업로드 기능** - 현재는 URL만 입력 (실제 파일 업로드 미구현)

## 📊 요약

### API 구현률
- **백엔드 API**: 13개 그룹, 총 약 40개 엔드포인트
- **프론트엔드 API**: 13개 그룹, 총 약 40개 엔드포인트
- **구현률**: 약 95% (로그인 API 제외)

### 컴포넌트 구현률
- **페이지**: 16개 페이지 모두 구현됨
- **컴포넌트**: 3개 주요 컴포넌트 구현됨
- **구현률**: 100%

## 🔧 권장 사항

1. **로그인 API 구현** (백엔드)
   - POST /api/auth/login 또는 POST /api/users/login 엔드포인트 추가
   - JWT 토큰 기반 인증 구현

2. **사용자 검색 API 구현** (백엔드)
   - GET /api/users/search?q={query} 엔드포인트 추가

3. **사용자 검색 UI 구현** (프론트엔드)
   - Search.jsx에 사용자 검색 탭 추가
   - 사용자 검색 결과 표시 컴포넌트 추가

4. **팔로워/팔로잉 목록 페이지** (프론트엔드)
   - Followers.jsx, Following.jsx 페이지 추가
   - Profile.jsx에서 해당 페이지로 링크

5. **이미지 업로드 기능** (프론트엔드 + 백엔드)
   - 파일 업로드 API 구현
   - 이미지 미리보기 및 업로드 UI 개선

