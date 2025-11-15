# SNS 웹사이트 프로젝트

Spring Boot 기반의 SNS 웹사이트 프로젝트입니다.

## 기술 스택

- **Java**: 23
- **Spring Boot**: 3.2.0
- **템플릿 엔진**: Thymeleaf
- **빌드 도구**: Gradle

## 프로젝트 구조

```
src/
├── main/
│   ├── java/
│   │   └── com/sns/
│   │       ├── SnsApplication.java          # 메인 애플리케이션 클래스
│   │       ├── controller/                  # Controller 레이어
│   │       ├── service/                     # Service 레이어
│   │       ├── repository/                  # Repository 레이어
│   │       ├── dto/                         # DTO 클래스
│   │       └── config/                      # 설정 클래스
│   └── resources/
│       ├── application.properties           # 애플리케이션 설정
│       ├── templates/                       # Thymeleaf 템플릿
│       └── static/                          # 정적 리소스 (CSS, JS, 이미지)
└── test/
    └── java/
        └── com/sns/
            └── SnsApplicationTests.java     # 테스트 클래스
```

## 실행 방법

1. 프로젝트 클론 또는 다운로드
2. Gradle Wrapper를 사용하여 의존성 설치:
   ```bash
   ./gradlew build
   ```
   (Windows의 경우: `gradlew.bat build`)
3. 애플리케이션 실행:
   ```bash
   ./gradlew bootRun
   ```
   (Windows의 경우: `gradlew.bat bootRun`)
4. 브라우저에서 `http://localhost:8080` 접속

## MVC 패턴

이 프로젝트는 MVC(Model-View-Controller) 패턴을 따릅니다:

- **Model**: 데이터 모델 (추후 정의 예정)
- **View**: Thymeleaf 템플릿 (`src/main/resources/templates/`)
- **Controller**: 요청 처리 (`src/main/java/com/sns/controller/`)

## 다음 단계

- Model 엔티티 정의
- 데이터베이스 연동 (JPA/Hibernate)
- 인증 및 권한 관리
- SNS 기능 구현
