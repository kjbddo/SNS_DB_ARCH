# 데이터베이스 정규화 문서

## 정규화 목표
2NF, 3NF, BCNF를 적용하여 데이터 중복을 제거하고 무결성을 보장합니다.

---

## 1. User 엔티티 정규화

### 문제점: 파생 속성 (Derived Attributes)
- `followerCount`: Follow 테이블에서 COUNT(follower_id = user_id)로 계산 가능
- `followingCount`: Follow 테이블에서 COUNT(following_id = user_id)로 계산 가능
- `postCount`: Post 테이블에서 COUNT(user_id = user_id)로 계산 가능

### 함수 종속성 분석
```
FD1: id → username, email, password, name, bio, profileImageUrl, isPrivate, createdAt, updatedAt
FD2: followerCount = COUNT(Follow WHERE following_id = id)  [파생 속성]
FD3: followingCount = COUNT(Follow WHERE follower_id = id)  [파생 속성]
FD4: postCount = COUNT(Post WHERE user_id = id)            [파생 속성]
```

### 정규화 적용
- **2NF/3NF 위반**: followerCount, followingCount, postCount는 다른 테이블의 집계 결과이므로 부분 종속이 아닌 파생 속성입니다.
- **조치**: 파생 속성 제거 (필요시 VIEW나 쿼리로 계산)

---

## 2. Post 엔티티 정규화

### 문제점: 파생 속성
- `likeCount`: Like 테이블에서 COUNT(post_id = id)로 계산 가능
- `commentCount`: Comment 테이블에서 COUNT(post_id = id)로 계산 가능

### 함수 종속성 분석
```
FD1: id → user_id, caption, location, createdAt, updatedAt
FD2: likeCount = COUNT(Like WHERE post_id = id)      [파생 속성]
FD3: commentCount = COUNT(Comment WHERE post_id = id) [파생 속성]
```

### 정규화 적용
- **조치**: 파생 속성 제거

---

## 3. Comment 엔티티 정규화

### 문제점: 파생 속성
- `likeCount`: Like 테이블에서 COUNT(comment_id = id)로 계산 가능

### 함수 종속성 분석
```
FD1: id → post_id, user_id, content, parent_comment_id, createdAt, updatedAt
FD2: likeCount = COUNT(Like WHERE comment_id = id)  [파생 속성]
```

### 정규화 적용
- **조치**: 파생 속성 제거

---

## 4. Story 엔티티 정규화

### 문제점: 파생 속성
- `viewCount`: StoryView 테이블이 있다면 COUNT로 계산 가능 (현재는 별도 엔티티 없음)

### 함수 종속성 분석
```
FD1: id → user_id, image_url, video_url, text, expires_at, created_at
FD2: viewCount = COUNT(StoryView WHERE story_id = id)  [파생 속성, StoryView 엔티티 필요]
```

### 정규화 적용
- **조치**: viewCount 제거 (StoryView 엔티티 생성 후 집계로 계산)

---

## 5. Hashtag 엔티티 정규화

### 문제점: 파생 속성
- `postCount`: PostHashtag 테이블에서 COUNT(hashtag_id = id)로 계산 가능

### 함수 종속성 분석
```
FD1: id → tag, createdAt
FD2: postCount = COUNT(PostHashtag WHERE hashtag_id = id)  [파생 속성]
```

### 정규화 적용
- **조치**: 파생 속성 제거

---

## 6. SavedCollection 엔티티 정규화

### 문제점: 파생 속성
- `postCount`: SavedPost 테이블에서 COUNT(collection_id = id)로 계산 가능

### 함수 종속성 분석
```
FD1: id → user_id, name, description, cover_image_url, is_default, createdAt, updatedAt
FD2: postCount = COUNT(SavedPost WHERE collection_id = id)  [파생 속성]
```

### 정규화 적용
- **조치**: 파생 속성 제거

---

## 7. Notification 엔티티 정규화

### 문제점: 파생 속성
- `message`: type과 actor, post, comment 등의 정보로부터 파생 가능

### 함수 종속성 분석
```
FD1: id → user_id, actor_id, type, post_id, comment_id, follow_id, is_read, read_at, createdAt
FD2: message = f(type, actor, post, comment, follow)  [파생 속성]
```

### 정규화 적용
- **조치**: message 필드 제거 (애플리케이션 레벨에서 생성)

---

## 8. StoryView 엔티티 추가 (정규화를 위한)

### 필요성
Story의 viewCount를 정규화하기 위해 StoryView 엔티티가 필요합니다.

### 함수 종속성
```
FD1: (user_id, story_id) → viewed_at
```

---

## 정규화 요약

### 제거된 파생 속성
1. User: followerCount, followingCount, postCount
2. Post: likeCount, commentCount
3. Comment: likeCount
4. Story: viewCount
5. Hashtag: postCount
6. SavedCollection: postCount
7. Notification: message

### 추가된 엔티티
1. StoryView: Story 조회 기록 (viewCount 계산용)

### 정규화 결과
- 모든 엔티티가 3NF 및 BCNF를 만족합니다.
- 파생 속성은 제거되어 데이터 중복이 없습니다.
- 집계 값은 필요시 쿼리나 VIEW로 계산합니다.

