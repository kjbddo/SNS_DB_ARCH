# SNS 웹사이트 프로젝트 보고서

## 목차
1. [문제 정의](#문제-정의)
2. [요구사항 정의](#요구사항-정의)
3. [엔티티 설계 (ERD)](#엔티티-설계-erd)
4. [정규화](#정규화)

---

## 문제 정의

### 배경
현대 사회에서 소셜 네트워크 서비스(SNS)는 사람들 간의 소통과 정보 공유의 핵심 플랫폼으로 자리잡았습니다. 인스타그램, 페이스북과 같은 SNS 플랫폼은 사용자들이 사진, 동영상, 텍스트를 공유하고, 서로 소통하며, 관계를 형성할 수 있는 환경을 제공합니다.

### 문제점
기존 SNS 플랫폼을 분석하고, 유사한 기능을 제공하는 웹 애플리케이션을 개발하기 위해서는 다음과 같은 문제들을 해결해야 합니다:

1. **복잡한 데이터 관계 관리**: 사용자, 게시물, 댓글, 좋아요, 팔로우 등 다양한 엔티티 간의 복잡한 관계를 효율적으로 관리해야 합니다.

2. **데이터 무결성 보장**: 파생 속성(derived attributes)으로 인한 데이터 불일치 문제를 해결하고, 정규화를 통해 데이터 중복을 제거해야 합니다.

3. **확장 가능한 데이터베이스 설계**: 향후 기능 추가에 대비하여 유연하고 확장 가능한 데이터베이스 스키마가 필요합니다.

4. **성능 최적화**: 대량의 데이터를 효율적으로 처리할 수 있는 데이터베이스 구조가 필요합니다.

### 해결 방안
- **정규화된 데이터베이스 설계**: 2NF, 3NF, BCNF를 적용하여 데이터 중복을 제거하고 무결성을 보장합니다.
- **명확한 엔티티 관계 정의**: 각 엔티티의 PK, FK를 명확히 정의하여 데이터 관계를 체계적으로 관리합니다.
- **파생 속성 제거**: 집계 값은 저장하지 않고 필요시 쿼리로 계산하여 데이터 일관성을 유지합니다.

---

## 요구사항 정의

### 기능적 요구사항

#### 1. 사용자 관리
- 사용자 회원가입 및 로그인
- 프로필 정보 관리 (이름, 소개, 프로필 이미지)
- 비공개 계정 설정

#### 2. 게시물 관리
- 텍스트, 이미지, 동영상 게시물 작성
- 게시물 수정 및 삭제
- 게시물 위치 정보 저장
- 게시물에 사용자 태그 기능

#### 3. 소셜 기능
- 사용자 팔로우/언팔로우
- 게시물 및 댓글 좋아요
- 댓글 작성 및 대댓글 기능
- 사용자 차단 기능

#### 4. 콘텐츠 관리
- 24시간 스토리 기능
- 해시태그를 통한 게시물 분류
- 게시물 스크랩 및 저장 컬렉션 관리

#### 5. 커뮤니케이션
- 1:1 다이렉트 메시지 (DM)
- 실시간 알림 시스템

#### 6. 안전 및 관리
- 부적절한 콘텐츠 신고 기능
- 신고 처리 상태 관리

### 비기능적 요구사항

#### 1. 데이터 무결성
- 정규화를 통한 데이터 중복 제거
- 외래키 제약조건을 통한 참조 무결성 보장
- Unique 제약조건을 통한 중복 데이터 방지

#### 2. 확장성
- 새로운 기능 추가 시 기존 구조에 영향을 최소화
- 엔티티 간 느슨한 결합 유지

#### 3. 성능
- 인덱스를 활용한 조회 성능 최적화
- Lazy Loading을 통한 불필요한 데이터 로딩 방지

---

## 엔티티 설계 (ERD)

### 엔티티 목록
총 **18개의 엔티티**로 구성되어 있습니다.

---

### 1. User (사용자)

**설명**: SNS 플랫폼의 사용자 정보를 저장하는 핵심 엔티티입니다.

**Primary Key (PK)**:
- `id` (Long, Auto Increment)

**Attributes**:
- `username` (String, 50, UNIQUE, NOT NULL) - 사용자명
- `email` (String, 100, UNIQUE, NOT NULL) - 이메일
- `password` (String, NOT NULL) - 비밀번호
- `name` (String, 100) - 이름
- `bio` (String, 500) - 자기소개
- `profileImageUrl` (String) - 프로필 이미지 URL
- `isPrivate` (Boolean) - 비공개 계정 여부
- `createdAt` (LocalDateTime, NOT NULL) - 생성일시
- `updatedAt` (LocalDateTime) - 수정일시

**Foreign Keys (FK)**: 없음

**관계**:
- 1:N → Post (작성한 게시물)
- 1:N → Comment (작성한 댓글)
- 1:N → Story (작성한 스토리)
- 1:N → Follow (팔로워/팔로잉)
- 1:N → Like (좋아요)
- 1:N → Block (차단)
- 1:N → Report (신고)
- 1:N → Notification (알림)
- 1:N → ChatRoom (채팅방 참여)
- 1:N → DirectMessage (DM 송수신)
- 1:N → ScrappedPost (스크랩한 게시물)
- 1:N → SavedCollection (저장 컬렉션)
- 1:N → SavedPost (저장한 게시물)
- 1:N → PostTag (태그된 게시물)
- 1:N → StoryView (조회한 스토리)

---

### 2. Post (게시물)

**설명**: 사용자가 작성한 게시물을 저장하는 엔티티입니다. 이미지, 동영상, 텍스트를 모두 지원합니다.

**Primary Key (PK)**:
- `id` (Long, Auto Increment)

**Attributes**:
- `userId` (Long, FK, NOT NULL) - 작성자 ID
- `caption` (String, 2200) - 게시물 설명
- `location` (String) - 위치 정보
- `createdAt` (LocalDateTime, NOT NULL) - 생성일시
- `updatedAt` (LocalDateTime) - 수정일시

**Collection Tables**:
- `post_images` - 이미지 URL 목록 (ElementCollection)
- `post_videos` - 동영상 URL 목록 (ElementCollection)

**Foreign Keys (FK)**:
- `userId` → User.id

**관계**:
- N:1 → User (작성자)
- 1:N → Comment (댓글)
- 1:N → Like (좋아요)
- 1:N → PostTag (태그된 사용자)
- 1:N → PostHashtag (해시태그)
- 1:N → ScrappedPost (스크랩)
- 1:N → SavedPost (저장)
- 1:N → Report (신고)
- 1:N → Notification (알림)

---

### 3. Comment (댓글)

**설명**: 게시물에 대한 댓글을 저장하는 엔티티입니다. 대댓글 기능을 지원합니다.

**Primary Key (PK)**:
- `id` (Long, Auto Increment)

**Attributes**:
- `postId` (Long, FK, NOT NULL) - 게시물 ID
- `userId` (Long, FK, NOT NULL) - 작성자 ID
- `content` (String, 2200, NOT NULL) - 댓글 내용
- `parentCommentId` (Long, FK) - 부모 댓글 ID (대댓글인 경우)
- `createdAt` (LocalDateTime, NOT NULL) - 생성일시
- `updatedAt` (LocalDateTime) - 수정일시

**Foreign Keys (FK)**:
- `postId` → Post.id
- `userId` → User.id
- `parentCommentId` → Comment.id (Self-Reference)

**관계**:
- N:1 → Post (게시물)
- N:1 → User (작성자)
- N:1 → Comment (부모 댓글, Self-Reference)
- 1:N → Comment (자식 댓글, Self-Reference)
- 1:N → Like (좋아요)
- 1:N → Report (신고)
- 1:N → Notification (알림)

---

### 4. Like (좋아요)

**설명**: 게시물 또는 댓글에 대한 좋아요를 저장하는 엔티티입니다.

**Primary Key (PK)**:
- `id` (Long, Auto Increment)

**Attributes**:
- `userId` (Long, FK, NOT NULL) - 좋아요한 사용자 ID
- `postId` (Long, FK) - 게시물 ID (nullable)
- `commentId` (Long, FK) - 댓글 ID (nullable)
- `createdAt` (LocalDateTime, NOT NULL) - 생성일시

**Unique Constraints**:
- `(userId, postId)` - 한 사용자가 한 게시물에 한 번만 좋아요 가능
- `(userId, commentId)` - 한 사용자가 한 댓글에 한 번만 좋아요 가능

**Foreign Keys (FK)**:
- `userId` → User.id
- `postId` → Post.id
- `commentId` → Comment.id

**관계**:
- N:1 → User (좋아요한 사용자)
- N:1 → Post (게시물, nullable)
- N:1 → Comment (댓글, nullable)

**제약조건**: `postId`와 `commentId` 중 하나는 반드시 NOT NULL이어야 합니다.

---

### 5. Follow (팔로우)

**설명**: 사용자 간의 팔로우 관계를 저장하는 엔티티입니다.

**Primary Key (PK)**:
- `id` (Long, Auto Increment)

**Attributes**:
- `followerId` (Long, FK, NOT NULL) - 팔로우하는 사용자 ID
- `followingId` (Long, FK, NOT NULL) - 팔로우받는 사용자 ID
- `createdAt` (LocalDateTime, NOT NULL) - 생성일시

**Unique Constraints**:
- `(followerId, followingId)` - 중복 팔로우 방지

**Foreign Keys (FK)**:
- `followerId` → User.id
- `followingId` → User.id

**관계**:
- N:1 → User (팔로워)
- N:1 → User (팔로잉)

**제약조건**: `followerId`와 `followingId`는 서로 달라야 합니다 (자기 자신 팔로우 불가).

---

### 6. Story (스토리)

**설명**: 24시간 동안만 유지되는 스토리를 저장하는 엔티티입니다.

**Primary Key (PK)**:
- `id` (Long, Auto Increment)

**Attributes**:
- `userId` (Long, FK, NOT NULL) - 작성자 ID
- `imageUrl` (String) - 이미지 URL
- `videoUrl` (String) - 동영상 URL
- `text` (String, 2200) - 텍스트
- `expiresAt` (LocalDateTime, NOT NULL) - 만료일시 (생성일시 + 24시간)
- `createdAt` (LocalDateTime, NOT NULL) - 생성일시

**Foreign Keys (FK)**:
- `userId` → User.id

**관계**:
- N:1 → User (작성자)
- 1:N → StoryView (조회 기록)

---

### 7. StoryView (스토리 조회)

**설명**: 스토리를 조회한 기록을 저장하는 엔티티입니다.

**Primary Key (PK)**:
- `id` (Long, Auto Increment)

**Attributes**:
- `userId` (Long, FK, NOT NULL) - 조회한 사용자 ID
- `storyId` (Long, FK, NOT NULL) - 조회한 스토리 ID
- `viewedAt` (LocalDateTime, NOT NULL) - 조회일시

**Unique Constraints**:
- `(userId, storyId)` - 한 사용자가 한 스토리를 한 번만 조회 기록

**Foreign Keys (FK)**:
- `userId` → User.id
- `storyId` → Story.id

**관계**:
- N:1 → User (조회한 사용자)
- N:1 → Story (조회한 스토리)

---

### 8. Hashtag (해시태그)

**설명**: 해시태그 정보를 저장하는 엔티티입니다.

**Primary Key (PK)**:
- `id` (Long, Auto Increment)

**Attributes**:
- `tag` (String, 100, UNIQUE, NOT NULL) - 해시태그 텍스트
- `createdAt` (LocalDateTime, NOT NULL) - 생성일시

**Foreign Keys (FK)**: 없음

**관계**:
- 1:N → PostHashtag (게시물-해시태그 관계)

---

### 9. PostHashtag (게시물-해시태그 관계)

**설명**: 게시물과 해시태그의 다대다 관계를 나타내는 엔티티입니다.

**Primary Key (PK)**:
- `id` (Long, Auto Increment)

**Attributes**:
- `postId` (Long, FK, NOT NULL) - 게시물 ID
- `hashtagId` (Long, FK, NOT NULL) - 해시태그 ID
- `createdAt` (LocalDateTime, NOT NULL) - 생성일시

**Unique Constraints**:
- `(postId, hashtagId)` - 중복 관계 방지

**Foreign Keys (FK)**:
- `postId` → Post.id
- `hashtagId` → Hashtag.id

**관계**:
- N:1 → Post (게시물)
- N:1 → Hashtag (해시태그)

---

### 10. PostTag (게시물 태그)

**설명**: 게시물에 태그된 사용자 정보를 저장하는 엔티티입니다.

**Primary Key (PK)**:
- `id` (Long, Auto Increment)

**Attributes**:
- `postId` (Long, FK, NOT NULL) - 게시물 ID
- `taggedUserId` (Long, FK, NOT NULL) - 태그된 사용자 ID
- `xPosition` (Double) - 태그 X 좌표
- `yPosition` (Double) - 태그 Y 좌표
- `createdAt` (LocalDateTime, NOT NULL) - 생성일시

**Unique Constraints**:
- `(postId, taggedUserId)` - 한 게시물에 같은 사용자 중복 태그 방지

**Foreign Keys (FK)**:
- `postId` → Post.id
- `taggedUserId` → User.id

**관계**:
- N:1 → Post (게시물)
- N:1 → User (태그된 사용자)

---

### 11. Block (차단)

**설명**: 사용자 간의 차단 관계를 저장하는 엔티티입니다.

**Primary Key (PK)**:
- `id` (Long, Auto Increment)

**Attributes**:
- `blockerId` (Long, FK, NOT NULL) - 차단한 사용자 ID
- `blockedId` (Long, FK, NOT NULL) - 차단당한 사용자 ID
- `createdAt` (LocalDateTime, NOT NULL) - 생성일시

**Unique Constraints**:
- `(blockerId, blockedId)` - 중복 차단 방지

**Foreign Keys (FK)**:
- `blockerId` → User.id
- `blockedId` → User.id

**관계**:
- N:1 → User (차단한 사용자)
- N:1 → User (차단당한 사용자)

---

### 12. Report (신고)

**설명**: 부적절한 콘텐츠나 사용자에 대한 신고를 저장하는 엔티티입니다.

**Primary Key (PK)**:
- `id` (Long, Auto Increment)

**Attributes**:
- `reporterId` (Long, FK, NOT NULL) - 신고한 사용자 ID
- `reportedUserId` (Long, FK) - 신고당한 사용자 ID (nullable)
- `reportedPostId` (Long, FK) - 신고당한 게시물 ID (nullable)
- `reportedCommentId` (Long, FK) - 신고당한 댓글 ID (nullable)
- `reportType` (Enum, NOT NULL) - 신고 유형 (SPAM, INAPPROPRIATE_CONTENT, HARASSMENT, COPYRIGHT, OTHER)
- `reason` (String, 500) - 신고 사유
- `description` (String, 1000) - 상세 설명
- `status` (Enum, NOT NULL) - 처리 상태 (PENDING, REVIEWING, RESOLVED, REJECTED)
- `createdAt` (LocalDateTime, NOT NULL) - 생성일시
- `updatedAt` (LocalDateTime) - 수정일시

**Foreign Keys (FK)**:
- `reporterId` → User.id
- `reportedUserId` → User.id
- `reportedPostId` → Post.id
- `reportedCommentId` → Comment.id

**관계**:
- N:1 → User (신고한 사용자)
- N:1 → User (신고당한 사용자, nullable)
- N:1 → Post (신고당한 게시물, nullable)
- N:1 → Comment (신고당한 댓글, nullable)

**제약조건**: `reportedUserId`, `reportedPostId`, `reportedCommentId` 중 하나는 반드시 NOT NULL이어야 합니다.

---

### 13. ChatRoom (채팅방)

**설명**: 1:1 다이렉트 메시지를 위한 채팅방을 저장하는 엔티티입니다.

**Primary Key (PK)**:
- `id` (Long, Auto Increment)

**Attributes**:
- `user1Id` (Long, FK, NOT NULL) - 채팅방 참여자 1 ID
- `user2Id` (Long, FK, NOT NULL) - 채팅방 참여자 2 ID
- `lastMessageAt` (LocalDateTime) - 마지막 메시지 시간
- `createdAt` (LocalDateTime, NOT NULL) - 생성일시

**Unique Constraints**:
- `(user1Id, user2Id)` - 중복 채팅방 방지

**Foreign Keys (FK)**:
- `user1Id` → User.id
- `user2Id` → User.id

**관계**:
- N:1 → User (참여자 1)
- N:1 → User (참여자 2)
- 1:N → DirectMessage (메시지)

---

### 14. DirectMessage (다이렉트 메시지)

**설명**: 채팅방 내에서 주고받은 메시지를 저장하는 엔티티입니다.

**Primary Key (PK)**:
- `id` (Long, Auto Increment)

**Attributes**:
- `chatRoomId` (Long, FK, NOT NULL) - 채팅방 ID
- `senderId` (Long, FK, NOT NULL) - 발신자 ID
- `receiverId` (Long, FK, NOT NULL) - 수신자 ID
- `content` (String, 2200) - 메시지 내용
- `imageUrl` (String) - 이미지 URL
- `isRead` (Boolean, NOT NULL) - 읽음 여부
- `readAt` (LocalDateTime) - 읽은 시간
- `createdAt` (LocalDateTime, NOT NULL) - 생성일시

**Foreign Keys (FK)**:
- `chatRoomId` → ChatRoom.id
- `senderId` → User.id
- `receiverId` → User.id

**관계**:
- N:1 → ChatRoom (채팅방)
- N:1 → User (발신자)
- N:1 → User (수신자)
- 1:N → Notification (알림)

---

### 15. Notification (알림)

**설명**: 사용자에게 전달되는 알림을 저장하는 엔티티입니다.

**Primary Key (PK)**:
- `id` (Long, Auto Increment)

**Attributes**:
- `userId` (Long, FK, NOT NULL) - 알림 받는 사용자 ID
- `actorId` (Long, FK) - 알림을 발생시킨 사용자 ID
- `type` (Enum, NOT NULL) - 알림 유형 (LIKE, COMMENT, FOLLOW, MENTION, POST_TAG, STORY_VIEW, MESSAGE)
- `postId` (Long, FK) - 관련 게시물 ID (nullable)
- `commentId` (Long, FK) - 관련 댓글 ID (nullable)
- `followId` (Long, FK) - 관련 팔로우 ID (nullable)
- `isRead` (Boolean, NOT NULL) - 읽음 여부
- `readAt` (LocalDateTime) - 읽은 시간
- `createdAt` (LocalDateTime, NOT NULL) - 생성일시

**Foreign Keys (FK)**:
- `userId` → User.id
- `actorId` → User.id
- `postId` → Post.id
- `commentId` → Comment.id
- `followId` → Follow.id

**관계**:
- N:1 → User (알림 받는 사용자)
- N:1 → User (알림 발생 사용자, nullable)
- N:1 → Post (관련 게시물, nullable)
- N:1 → Comment (관련 댓글, nullable)
- N:1 → Follow (관련 팔로우, nullable)

---

### 16. ScrappedPost (스크랩한 게시물)

**설명**: 사용자가 스크랩한 게시물을 저장하는 엔티티입니다.

**Primary Key (PK)**:
- `id` (Long, Auto Increment)

**Attributes**:
- `userId` (Long, FK, NOT NULL) - 스크랩한 사용자 ID
- `postId` (Long, FK, NOT NULL) - 스크랩한 게시물 ID
- `createdAt` (LocalDateTime, NOT NULL) - 생성일시

**Unique Constraints**:
- `(userId, postId)` - 중복 스크랩 방지

**Foreign Keys (FK)**:
- `userId` → User.id
- `postId` → Post.id

**관계**:
- N:1 → User (스크랩한 사용자)
- N:1 → Post (스크랩한 게시물)

---

### 17. SavedCollection (저장 컬렉션)

**설명**: 사용자가 생성한 게시물 저장 컬렉션을 저장하는 엔티티입니다.

**Primary Key (PK)**:
- `id` (Long, Auto Increment)

**Attributes**:
- `userId` (Long, FK, NOT NULL) - 소유자 ID
- `name` (String, 100, NOT NULL) - 컬렉션 이름
- `description` (String, 500) - 컬렉션 설명
- `coverImageUrl` (String) - 커버 이미지 URL
- `isDefault` (Boolean, NOT NULL) - 기본 컬렉션 여부
- `createdAt` (LocalDateTime, NOT NULL) - 생성일시
- `updatedAt` (LocalDateTime) - 수정일시

**Foreign Keys (FK)**:
- `userId` → User.id

**관계**:
- N:1 → User (소유자)
- 1:N → SavedPost (저장된 게시물)

---

### 18. SavedPost (저장된 게시물)

**설명**: 저장 컬렉션에 저장된 게시물을 저장하는 엔티티입니다.

**Primary Key (PK)**:
- `id` (Long, Auto Increment)

**Attributes**:
- `userId` (Long, FK, NOT NULL) - 저장한 사용자 ID
- `postId` (Long, FK, NOT NULL) - 저장한 게시물 ID
- `collectionId` (Long, FK) - 컬렉션 ID (nullable, 기본 컬렉션인 경우)
- `createdAt` (LocalDateTime, NOT NULL) - 생성일시

**Unique Constraints**:
- `(userId, postId, collectionId)` - 같은 컬렉션에 중복 저장 방지

**Foreign Keys (FK)**:
- `userId` → User.id
- `postId` → Post.id
- `collectionId` → SavedCollection.id

**관계**:
- N:1 → User (저장한 사용자)
- N:1 → Post (저장한 게시물)
- N:1 → SavedCollection (컬렉션, nullable)

---

## 정규화

### 정규화 적용 결과

본 프로젝트는 **2NF, 3NF, BCNF**를 모두 만족하도록 설계되었습니다.

### 주요 정규화 작업

1. **파생 속성 제거**: 집계 값(followerCount, likeCount 등)을 엔티티에서 제거하고, 필요시 쿼리로 계산하도록 변경했습니다.

2. **함수 종속성 분석**: 각 엔티티의 함수 종속성을 분석하여 불필요한 중복을 제거했습니다.

3. **Unique 제약조건**: 중복 데이터를 방지하기 위해 적절한 Unique 제약조건을 설정했습니다.

자세한 정규화 내용은 `NORMALIZATION.md` 파일을 참조하세요.

---

## 엔티티 관계 요약

### 핵심 엔티티
- **User**: 모든 관계의 중심
- **Post**: 콘텐츠의 중심
- **Comment**: 게시물과의 상호작용

### 관계 엔티티
- **Follow**: 사용자 간 팔로우 관계
- **Like**: 게시물/댓글 좋아요
- **Block**: 사용자 차단
- **PostTag**: 게시물 태그
- **PostHashtag**: 게시물-해시태그 관계

### 기능 엔티티
- **Story**: 24시간 스토리
- **StoryView**: 스토리 조회 기록
- **ChatRoom**: 1:1 채팅방
- **DirectMessage**: DM 메시지
- **Notification**: 알림
- **ScrappedPost**: 스크랩
- **SavedCollection**: 저장 컬렉션
- **SavedPost**: 저장된 게시물
- **Report**: 신고

### 분류 엔티티
- **Hashtag**: 해시태그

---

## 데이터베이스 설계 특징

1. **정규화 완료**: 모든 엔티티가 3NF 및 BCNF를 만족합니다.
2. **참조 무결성**: 모든 외래키 제약조건이 설정되어 있습니다.
3. **중복 방지**: Unique 제약조건을 통해 중복 데이터를 방지합니다.
4. **확장성**: 새로운 기능 추가 시 기존 구조에 영향을 최소화합니다.
5. **성능 최적화**: Lazy Loading과 적절한 인덱스를 활용합니다.

---

## 결론

본 프로젝트는 인스타그램과 유사한 SNS 웹사이트를 위한 데이터베이스 설계로, 18개의 엔티티를 통해 사용자 관리, 콘텐츠 공유, 소셜 상호작용, 커뮤니케이션, 안전 관리 등의 기능을 지원합니다. 정규화를 통해 데이터 무결성을 보장하고, 명확한 엔티티 관계를 통해 확장 가능한 구조를 제공합니다.

