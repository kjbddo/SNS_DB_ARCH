# React API 구현 상태 확인

## ✅ 완전히 구현된 API

### 1. User API (3/3)
- ✅ POST /api/users - register
- ✅ PUT /api/users/{userId} - updateProfile
- ✅ GET /api/users/{userId} - getProfile

### 2. Post API (5/5)
- ✅ POST /api/posts - create
- ✅ PUT /api/posts/{postId} - update
- ✅ DELETE /api/posts/{postId} - delete
- ✅ GET /api/posts/{postId} - getPost
- ✅ GET /api/posts/user/{userId} - getUserPosts

### 3. Comment API (4/4)
- ✅ POST /api/comments - create
- ✅ PUT /api/comments/{commentId} - update
- ✅ DELETE /api/comments/{commentId} - delete
- ✅ GET /api/comments/post/{postId} - getComments

### 4. Like API (2/2)
- ✅ POST /api/likes - like
- ✅ DELETE /api/likes - unlike

### 5. Follow API (2/2)
- ✅ POST /api/follows - follow
- ✅ DELETE /api/follows - unfollow

### 6. Block API (2/2)
- ✅ POST /api/blocks - block
- ✅ DELETE /api/blocks - unblock

### 7. Story API (3/3)
- ✅ POST /api/stories - create
- ✅ GET /api/stories/user/{userId} - getStories
- ✅ POST /api/stories/{storyId}/view - viewStory

### 8. Hashtag API (1/1)
- ✅ GET /api/hashtags/search - search

### 9. Chat API (3/3)
- ✅ POST /api/chats/rooms - createRoom
- ✅ GET /api/chats/rooms/{roomId} - getRoom
- ✅ POST /api/chats/messages - sendMessage

### 10. Notification API (3/3)
- ✅ POST /api/notifications - create
- ✅ GET /api/notifications/user/{userId} - getNotifications
- ✅ POST /api/notifications/{notificationId}/read - markAsRead

### 11. Report API (3/3)
- ✅ POST /api/reports - create
- ✅ PUT /api/reports/{reportId}/status - updateStatus
- ✅ GET /api/reports/reporter/{reporterId} - getReports

### 12. Scrap API (3/3)
- ✅ POST /api/scraps - scrap
- ✅ DELETE /api/scraps - unscrap
- ✅ GET /api/scraps/user/{userId} - getScraps

### 13. Collection API (6/6)
- ✅ POST /api/collections - create
- ✅ PUT /api/collections/{collectionId} - update
- ✅ DELETE /api/collections/{collectionId} - delete
- ✅ GET /api/collections/user/{userId} - getCollections
- ✅ POST /api/collections/saved - savePost
- ✅ DELETE /api/collections/saved/{savedPostId} - removeSavedPost

## 📊 통계

- **총 API 엔드포인트**: 35개
- **구현 완료**: 35개 (100%)
- **미구현**: 0개

## ⚠️ 주의사항

### 1. DELETE 요청의 body 전달 방식
- **Like API**: `api.delete('/likes', { data })` - 올바름
- **Scrap API**: `api.delete('/scraps', { data })` - 올바름
- 하지만 백엔드에서 `@RequestBody`로 받는 경우, 일부 브라우저/서버에서 문제가 될 수 있음

### 2. 페이지에서 실제 사용되지 않는 API
다음 API들은 `api.js`에는 정의되어 있지만, 실제 페이지에서 사용되지 않음:
- `blockAPI` - 차단 기능 UI 없음
- `reportAPI` - 신고 기능 UI 없음
- `collectionAPI` - 컬렉션 관리 UI 없음 (일부만 사용)
- `storyAPI.create` - 스토리 생성 UI 없음
- `commentAPI.update` - 댓글 수정 UI 없음
- `postAPI.delete` - 게시물 삭제 UI 없음

### 3. 누락된 기능/페이지
- 게시물 삭제 버튼 (PostDetail 페이지)
- 댓글 수정/삭제 UI (PostDetail 페이지)
- 스토리 생성 페이지
- 컬렉션 관리 페이지
- 신고 기능 UI
- 차단 기능 UI

## ✅ 결론

**모든 API가 `api.js`에 올바르게 구현되어 있습니다!** (35/35)

다만, 일부 API는 UI가 아직 구현되지 않아 실제로 사용되지 않고 있습니다.

