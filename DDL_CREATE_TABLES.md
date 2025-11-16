## SNS 프로젝트 MySQL DDL 정의

아래 스키마는 `PROJECT_REPORT.md` 와 `NORMALIZATION.md` 내용을 바탕으로 작성한 MySQL용 `CREATE TABLE` 정의입니다.  
각 테이블에는 컬럼명, 타입, `NOT NULL`, `AUTO_INCREMENT`, `COMMENT`, `PRIMARY KEY`, `FOREIGN KEY`, `UNIQUE`, 필요한 경우 `CHECK` 제약을 포함합니다.

> 참고: `BOOLEAN` 은 MySQL에서 `TINYINT(1)` 의 동의어로 동작합니다.

---

## 1. User

```sql
CREATE TABLE `user` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '사용자 PK',
    `username` VARCHAR(50) NOT NULL COMMENT '사용자명',
    `email` VARCHAR(100) NOT NULL COMMENT '이메일',
    `password` VARCHAR(255) NOT NULL COMMENT '비밀번호(해시)',
    `name` VARCHAR(100) NULL COMMENT '이름',
    `bio` VARCHAR(500) NULL COMMENT '자기소개',
    `profile_image_url` VARCHAR(500) NULL COMMENT '프로필 이미지 URL',
    `is_private` BOOLEAN NOT NULL DEFAULT FALSE COMMENT '비공개 계정 여부',
    `created_at` DATETIME NOT NULL COMMENT '생성일시',
    `updated_at` DATETIME NULL COMMENT '수정일시',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_user_username` (`username`),
    UNIQUE KEY `uk_user_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='사용자';
```

---

## 2. Post

> `post_images`, `post_videos` 는 ElementCollection 개념이므로 별도 테이블로 분리했습니다.

```sql
CREATE TABLE `post` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '게시물 PK',
    `user_id` BIGINT UNSIGNED NOT NULL COMMENT '작성자 ID (FK: user.id)',
    `caption` VARCHAR(2200) NULL COMMENT '게시물 설명',
    `location` VARCHAR(255) NULL COMMENT '위치 정보',
    `created_at` DATETIME NOT NULL COMMENT '생성일시',
    `updated_at` DATETIME NULL COMMENT '수정일시',
    PRIMARY KEY (`id`),
    KEY `idx_post_user_id` (`user_id`),
    CONSTRAINT `fk_post_user` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='게시물';
```

```sql
CREATE TABLE `post_image` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '게시물 이미지 PK',
    `post_id` BIGINT UNSIGNED NOT NULL COMMENT '게시물 ID (FK: post.id)',
    `image_url` VARCHAR(500) NOT NULL COMMENT '이미지 URL',
    PRIMARY KEY (`id`),
    KEY `idx_post_image_post_id` (`post_id`),
    CONSTRAINT `fk_post_image_post` FOREIGN KEY (`post_id`) REFERENCES `post`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='게시물 이미지 컬렉션';
```

```sql
CREATE TABLE `post_video` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '게시물 동영상 PK',
    `post_id` BIGINT UNSIGNED NOT NULL COMMENT '게시물 ID (FK: post.id)',
    `video_url` VARCHAR(500) NOT NULL COMMENT '동영상 URL',
    PRIMARY KEY (`id`),
    KEY `idx_post_video_post_id` (`post_id`),
    CONSTRAINT `fk_post_video_post` FOREIGN KEY (`post_id`) REFERENCES `post`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='게시물 동영상 컬렉션';
```

---

## 3. Comment

```sql
CREATE TABLE `comment` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '댓글 PK',
    `post_id` BIGINT UNSIGNED NOT NULL COMMENT '게시물 ID (FK: post.id)',
    `user_id` BIGINT UNSIGNED NOT NULL COMMENT '작성자 ID (FK: user.id)',
    `content` VARCHAR(2200) NOT NULL COMMENT '댓글 내용',
    `parent_comment_id` BIGINT UNSIGNED NULL COMMENT '부모 댓글 ID(대댓글, FK: comment.id)',
    `created_at` DATETIME NOT NULL COMMENT '생성일시',
    `updated_at` DATETIME NULL COMMENT '수정일시',
    PRIMARY KEY (`id`),
    KEY `idx_comment_post_id` (`post_id`),
    KEY `idx_comment_user_id` (`user_id`),
    KEY `idx_comment_parent_comment_id` (`parent_comment_id`),
    CONSTRAINT `fk_comment_post` FOREIGN KEY (`post_id`) REFERENCES `post`(`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_comment_user` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_comment_parent` FOREIGN KEY (`parent_comment_id`) REFERENCES `comment`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='댓글';
```

---

## 4. Like

```sql
CREATE TABLE `like` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '좋아요 PK',
    `user_id` BIGINT UNSIGNED NOT NULL COMMENT '좋아요한 사용자 ID (FK: user.id)',
    `post_id` BIGINT UNSIGNED NULL COMMENT '게시물 ID (FK: post.id)',
    `comment_id` BIGINT UNSIGNED NULL COMMENT '댓글 ID (FK: comment.id)',
    `created_at` DATETIME NOT NULL COMMENT '생성일시',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_like_user_post` (`user_id`, `post_id`),
    UNIQUE KEY `uk_like_user_comment` (`user_id`, `comment_id`),
    KEY `idx_like_user_id` (`user_id`),
    KEY `idx_like_post_id` (`post_id`),
    KEY `idx_like_comment_id` (`comment_id`),
    CONSTRAINT `fk_like_user` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_like_post` FOREIGN KEY (`post_id`) REFERENCES `post`(`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_like_comment` FOREIGN KEY (`comment_id`) REFERENCES `comment`(`id`) ON DELETE CASCADE,
    CONSTRAINT `chk_like_target_not_null` CHECK (
        (`post_id` IS NOT NULL AND `comment_id` IS NULL)
        OR (`post_id` IS NULL AND `comment_id` IS NOT NULL)
    )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='좋아요 (게시물/댓글)';
```

---

## 5. Follow

```sql
CREATE TABLE `follow` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '팔로우 PK',
    `follower_id` BIGINT UNSIGNED NOT NULL COMMENT '팔로우하는 사용자 ID (FK: user.id)',
    `following_id` BIGINT UNSIGNED NOT NULL COMMENT '팔로우받는 사용자 ID (FK: user.id)',
    `created_at` DATETIME NOT NULL COMMENT '생성일시',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_follow_pair` (`follower_id`, `following_id`),
    KEY `idx_follow_follower_id` (`follower_id`),
    KEY `idx_follow_following_id` (`following_id`),
    CONSTRAINT `fk_follow_follower` FOREIGN KEY (`follower_id`) REFERENCES `user`(`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_follow_following` FOREIGN KEY (`following_id`) REFERENCES `user`(`id`) ON DELETE CASCADE,
    CONSTRAINT `chk_follow_not_self` CHECK (`follower_id` <> `following_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='팔로우 관계';
```

---

## 6. Story

```sql
CREATE TABLE `story` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '스토리 PK',
    `user_id` BIGINT UNSIGNED NOT NULL COMMENT '작성자 ID (FK: user.id)',
    `image_url` VARCHAR(500) NULL COMMENT '이미지 URL',
    `video_url` VARCHAR(500) NULL COMMENT '동영상 URL',
    `text` VARCHAR(2200) NULL COMMENT '텍스트',
    `expires_at` DATETIME NOT NULL COMMENT '만료일시(생성 + 24시간)',
    `created_at` DATETIME NOT NULL COMMENT '생성일시',
    PRIMARY KEY (`id`),
    KEY `idx_story_user_id` (`user_id`),
    CONSTRAINT `fk_story_user` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='스토리';
```

---

## 7. StoryView

```sql
CREATE TABLE `story_view` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '스토리 조회 PK',
    `user_id` BIGINT UNSIGNED NOT NULL COMMENT '조회한 사용자 ID (FK: user.id)',
    `story_id` BIGINT UNSIGNED NOT NULL COMMENT '스토리 ID (FK: story.id)',
    `viewed_at` DATETIME NOT NULL COMMENT '조회일시',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_story_view_user_story` (`user_id`, `story_id`),
    KEY `idx_story_view_story_id` (`story_id`),
    CONSTRAINT `fk_story_view_user` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_story_view_story` FOREIGN KEY (`story_id`) REFERENCES `story`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='스토리 조회 기록';
```

---

## 8. Hashtag

```sql
CREATE TABLE `hashtag` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '해시태그 PK',
    `tag` VARCHAR(100) NOT NULL COMMENT '해시태그 텍스트',
    `created_at` DATETIME NOT NULL COMMENT '생성일시',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_hashtag_tag` (`tag`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='해시태그';
```

---

## 9. PostHashtag

```sql
CREATE TABLE `post_hashtag` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '게시물-해시태그 관계 PK',
    `post_id` BIGINT UNSIGNED NOT NULL COMMENT '게시물 ID (FK: post.id)',
    `hashtag_id` BIGINT UNSIGNED NOT NULL COMMENT '해시태그 ID (FK: hashtag.id)',
    `created_at` DATETIME NOT NULL COMMENT '생성일시',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_post_hashtag_pair` (`post_id`, `hashtag_id`),
    KEY `idx_post_hashtag_post_id` (`post_id`),
    KEY `idx_post_hashtag_hashtag_id` (`hashtag_id`),
    CONSTRAINT `fk_post_hashtag_post` FOREIGN KEY (`post_id`) REFERENCES `post`(`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_post_hashtag_hashtag` FOREIGN KEY (`hashtag_id`) REFERENCES `hashtag`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='게시물-해시태그 관계';
```

---

## 10. PostTag

```sql
CREATE TABLE `post_tag` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '게시물 태그 PK',
    `post_id` BIGINT UNSIGNED NOT NULL COMMENT '게시물 ID (FK: post.id)',
    `tagged_user_id` BIGINT UNSIGNED NOT NULL COMMENT '태그된 사용자 ID (FK: user.id)',
    `x_position` DOUBLE NULL COMMENT '태그 X 좌표',
    `y_position` DOUBLE NULL COMMENT '태그 Y 좌표',
    `created_at` DATETIME NOT NULL COMMENT '생성일시',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_post_tag_pair` (`post_id`, `tagged_user_id`),
    KEY `idx_post_tag_post_id` (`post_id`),
    KEY `idx_post_tag_tagged_user_id` (`tagged_user_id`),
    CONSTRAINT `fk_post_tag_post` FOREIGN KEY (`post_id`) REFERENCES `post`(`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_post_tag_user` FOREIGN KEY (`tagged_user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='게시물 사용자 태그';
```

---

## 11. Block

```sql
CREATE TABLE `block` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '차단 PK',
    `blocker_id` BIGINT UNSIGNED NOT NULL COMMENT '차단한 사용자 ID (FK: user.id)',
    `blocked_id` BIGINT UNSIGNED NOT NULL COMMENT '차단당한 사용자 ID (FK: user.id)',
    `created_at` DATETIME NOT NULL COMMENT '생성일시',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_block_pair` (`blocker_id`, `blocked_id`),
    KEY `idx_block_blocker_id` (`blocker_id`),
    KEY `idx_block_blocked_id` (`blocked_id`),
    CONSTRAINT `fk_block_blocker` FOREIGN KEY (`blocker_id`) REFERENCES `user`(`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_block_blocked` FOREIGN KEY (`blocked_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='사용자 차단';
```

---

## 12. Report

```sql
CREATE TABLE `report` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '신고 PK',
    `reporter_id` BIGINT UNSIGNED NOT NULL COMMENT '신고한 사용자 ID (FK: user.id)',
    `reported_user_id` BIGINT UNSIGNED NULL COMMENT '신고당한 사용자 ID (FK: user.id)',
    `reported_post_id` BIGINT UNSIGNED NULL COMMENT '신고당한 게시물 ID (FK: post.id)',
    `reported_comment_id` BIGINT UNSIGNED NULL COMMENT '신고당한 댓글 ID (FK: comment.id)',
    `report_type` ENUM('SPAM', 'INAPPROPRIATE_CONTENT', 'HARASSMENT', 'COPYRIGHT', 'OTHER') NOT NULL COMMENT '신고 유형',
    `reason` VARCHAR(500) NULL COMMENT '신고 사유',
    `description` VARCHAR(1000) NULL COMMENT '상세 설명',
    `status` ENUM('PENDING', 'REVIEWING', 'RESOLVED', 'REJECTED') NOT NULL COMMENT '처리 상태',
    `created_at` DATETIME NOT NULL COMMENT '생성일시',
    `updated_at` DATETIME NULL COMMENT '수정일시',
    PRIMARY KEY (`id`),
    KEY `idx_report_reporter_id` (`reporter_id`),
    KEY `idx_report_reported_user_id` (`reported_user_id`),
    KEY `idx_report_reported_post_id` (`reported_post_id`),
    KEY `idx_report_reported_comment_id` (`reported_comment_id`),
    CONSTRAINT `fk_report_reporter` FOREIGN KEY (`reporter_id`) REFERENCES `user`(`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_report_reported_user` FOREIGN KEY (`reported_user_id`) REFERENCES `user`(`id`) ON DELETE SET NULL,
    CONSTRAINT `fk_report_reported_post` FOREIGN KEY (`reported_post_id`) REFERENCES `post`(`id`) ON DELETE SET NULL,
    CONSTRAINT `fk_report_reported_comment` FOREIGN KEY (`reported_comment_id`) REFERENCES `comment`(`id`) ON DELETE SET NULL,
    CONSTRAINT `chk_report_target_not_null` CHECK (
        `reported_user_id` IS NOT NULL
        OR `reported_post_id` IS NOT NULL
        OR `reported_comment_id` IS NOT NULL
    )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='신고';
```

---

## 13. ChatRoom

```sql
CREATE TABLE `chat_room` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '채팅방 PK',
    `user1_id` BIGINT UNSIGNED NOT NULL COMMENT '참여자 1 ID (FK: user.id)',
    `user2_id` BIGINT UNSIGNED NOT NULL COMMENT '참여자 2 ID (FK: user.id)',
    `last_message_at` DATETIME NULL COMMENT '마지막 메시지 시간',
    `created_at` DATETIME NOT NULL COMMENT '생성일시',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_chat_room_pair` (`user1_id`, `user2_id`),
    KEY `idx_chat_room_user1_id` (`user1_id`),
    KEY `idx_chat_room_user2_id` (`user2_id`),
    CONSTRAINT `fk_chat_room_user1` FOREIGN KEY (`user1_id`) REFERENCES `user`(`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_chat_room_user2` FOREIGN KEY (`user2_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='1:1 채팅방';
```

---

## 14. DirectMessage

```sql
CREATE TABLE `direct_message` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'DM PK',
    `chat_room_id` BIGINT UNSIGNED NOT NULL COMMENT '채팅방 ID (FK: chat_room.id)',
    `sender_id` BIGINT UNSIGNED NOT NULL COMMENT '발신자 ID (FK: user.id)',
    `receiver_id` BIGINT UNSIGNED NOT NULL COMMENT '수신자 ID (FK: user.id)',
    `content` VARCHAR(2200) NULL COMMENT '메시지 내용',
    `image_url` VARCHAR(500) NULL COMMENT '이미지 URL',
    `is_read` BOOLEAN NOT NULL DEFAULT FALSE COMMENT '읽음 여부',
    `read_at` DATETIME NULL COMMENT '읽은 시간',
    `created_at` DATETIME NOT NULL COMMENT '생성일시',
    PRIMARY KEY (`id`),
    KEY `idx_dm_chat_room_id` (`chat_room_id`),
    KEY `idx_dm_sender_id` (`sender_id`),
    KEY `idx_dm_receiver_id` (`receiver_id`),
    CONSTRAINT `fk_dm_chat_room` FOREIGN KEY (`chat_room_id`) REFERENCES `chat_room`(`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_dm_sender` FOREIGN KEY (`sender_id`) REFERENCES `user`(`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_dm_receiver` FOREIGN KEY (`receiver_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='다이렉트 메시지';
```

---

## 15. Notification

```sql
CREATE TABLE `notification` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '알림 PK',
    `user_id` BIGINT UNSIGNED NOT NULL COMMENT '알림 받는 사용자 ID (FK: user.id)',
    `actor_id` BIGINT UNSIGNED NULL COMMENT '알림 발생 사용자 ID (FK: user.id)',
    `type` ENUM('LIKE', 'COMMENT', 'FOLLOW', 'MENTION', 'POST_TAG', 'STORY_VIEW', 'MESSAGE') NOT NULL COMMENT '알림 유형',
    `post_id` BIGINT UNSIGNED NULL COMMENT '관련 게시물 ID (FK: post.id)',
    `comment_id` BIGINT UNSIGNED NULL COMMENT '관련 댓글 ID (FK: comment.id)',
    `follow_id` BIGINT UNSIGNED NULL COMMENT '관련 팔로우 ID (FK: follow.id)',
    `is_read` BOOLEAN NOT NULL DEFAULT FALSE COMMENT '읽음 여부',
    `read_at` DATETIME NULL COMMENT '읽은 시간',
    `created_at` DATETIME NOT NULL COMMENT '생성일시',
    PRIMARY KEY (`id`),
    KEY `idx_notification_user_id` (`user_id`),
    KEY `idx_notification_actor_id` (`actor_id`),
    KEY `idx_notification_post_id` (`post_id`),
    KEY `idx_notification_comment_id` (`comment_id`),
    KEY `idx_notification_follow_id` (`follow_id`),
    CONSTRAINT `fk_notification_user` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_notification_actor` FOREIGN KEY (`actor_id`) REFERENCES `user`(`id`) ON DELETE SET NULL,
    CONSTRAINT `fk_notification_post` FOREIGN KEY (`post_id`) REFERENCES `post`(`id`) ON DELETE SET NULL,
    CONSTRAINT `fk_notification_comment` FOREIGN KEY (`comment_id`) REFERENCES `comment`(`id`) ON DELETE SET NULL,
    CONSTRAINT `fk_notification_follow` FOREIGN KEY (`follow_id`) REFERENCES `follow`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='알림';
```

---

## 16. ScrappedPost

```sql
CREATE TABLE `scrapped_post` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '스크랩한 게시물 PK',
    `user_id` BIGINT UNSIGNED NOT NULL COMMENT '스크랩한 사용자 ID (FK: user.id)',
    `post_id` BIGINT UNSIGNED NOT NULL COMMENT '스크랩한 게시물 ID (FK: post.id)',
    `created_at` DATETIME NOT NULL COMMENT '생성일시',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_scrapped_post_user_post` (`user_id`, `post_id`),
    KEY `idx_scrapped_post_user_id` (`user_id`),
    KEY `idx_scrapped_post_post_id` (`post_id`),
    CONSTRAINT `fk_scrapped_post_user` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_scrapped_post_post` FOREIGN KEY (`post_id`) REFERENCES `post`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='스크랩한 게시물';
```

---

## 17. SavedCollection

```sql
CREATE TABLE `saved_collection` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '저장 컬렉션 PK',
    `user_id` BIGINT UNSIGNED NOT NULL COMMENT '소유자 ID (FK: user.id)',
    `name` VARCHAR(100) NOT NULL COMMENT '컬렉션 이름',
    `description` VARCHAR(500) NULL COMMENT '컬렉션 설명',
    `cover_image_url` VARCHAR(500) NULL COMMENT '커버 이미지 URL',
    `is_default` BOOLEAN NOT NULL DEFAULT FALSE COMMENT '기본 컬렉션 여부',
    `created_at` DATETIME NOT NULL COMMENT '생성일시',
    `updated_at` DATETIME NULL COMMENT '수정일시',
    PRIMARY KEY (`id`),
    KEY `idx_saved_collection_user_id` (`user_id`),
    CONSTRAINT `fk_saved_collection_user` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='저장 컬렉션';
```

---

## 18. SavedPost

```sql
CREATE TABLE `saved_post` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '저장된 게시물 PK',
    `user_id` BIGINT UNSIGNED NOT NULL COMMENT '저장한 사용자 ID (FK: user.id)',
    `post_id` BIGINT UNSIGNED NOT NULL COMMENT '저장한 게시물 ID (FK: post.id)',
    `collection_id` BIGINT UNSIGNED NULL COMMENT '컬렉션 ID (FK: saved_collection.id, 기본 컬렉션이면 NULL)',
    `created_at` DATETIME NOT NULL COMMENT '생성일시',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_saved_post_user_post_collection` (`user_id`, `post_id`, `collection_id`),
    KEY `idx_saved_post_user_id` (`user_id`),
    KEY `idx_saved_post_post_id` (`post_id`),
    KEY `idx_saved_post_collection_id` (`collection_id`),
    CONSTRAINT `fk_saved_post_user` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_saved_post_post` FOREIGN KEY (`post_id`) REFERENCES `post`(`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_saved_post_collection` FOREIGN KEY (`collection_id`) REFERENCES `saved_collection`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='저장된 게시물';
```

---

## 사용 및 ERD 작성 팁

- **ERD 도구**에서 테이블을 가져올 때 PK/FK, UNIQUE, CHECK 제약이 자동으로 인식되므로 관계선을 쉽게 그릴 수 있습니다.
- 파생 속성(집계 값)은 모두 제거되어 있으므로, 팔로워 수, 좋아요 수 등은 `COUNT(*)` 쿼리나 VIEW로 계산해서 사용하면 됩니다.
- 필요하면 각 테이블의 인덱스명을 ERD 설명란에 함께 적어 두면 성능 설계 문서와도 쉽게 연결할 수 있습니다.


