# SNS Frontend (React)

SNS 웹 애플리케이션의 React 프론트엔드입니다.

## 기술 스택

- React 18
- React Router 6
- Axios
- Vite
- React Icons

## 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (포트 3000)
npm run dev

# 프로덕션 빌드
npm run build
```

## 주요 기능

- 홈 피드
- 사용자 프로필
- 게시물 작성/수정/삭제
- 댓글 작성
- 좋아요/스크랩
- 팔로우/언팔로우
- 스토리
- 채팅
- 알림
- 검색
- 설정

## API 연동

모든 API 호출은 `src/services/api.js`에서 관리됩니다.
백엔드 서버는 `http://localhost:8080`에서 실행되어야 합니다.

