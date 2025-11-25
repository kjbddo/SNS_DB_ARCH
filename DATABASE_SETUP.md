# 데이터베이스 설정 가이드

## 1. MySQL 데이터베이스 생성

MySQL에 접속하여 다음 명령어를 실행하세요:

```sql
CREATE DATABASE sns_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## 2. application.properties 설정

### 기본 설정 (application.properties)
- MySQL 데이터베이스 연결 정보를 설정합니다.
- 기본값: `localhost:3306/sns_db`, 사용자명: `root`, 비밀번호: `root`

### 프로파일별 설정

#### 개발 환경 (application-dev.properties)
```bash
# 개발 환경으로 실행
./gradlew bootRun --args='--spring.profiles.active=dev'
```

#### 프로덕션 환경 (application-prod.properties)
```bash
# 환경 변수로 데이터베이스 정보 설정
export DB_URL=jdbc:mysql://your-db-host:3306/sns_db
export DB_USERNAME=your_username
export DB_PASSWORD=your_password

# 프로덕션 환경으로 실행
./gradlew bootRun --args='--spring.profiles.active=prod'
```

#### H2 인메모리 데이터베이스 (application-h2.properties)
```bash
# H2 데이터베이스로 실행 (테스트용)
./gradlew bootRun --args='--spring.profiles.active=h2'
```

## 3. 데이터베이스 초기화

### 방법 1: DDL 스크립트 실행
`DDL_CREATE_TABLES.md` 파일에 있는 SQL 스크립트를 MySQL에서 실행하세요.

### 방법 2: JPA 자동 생성 (개발 환경)
`spring.jpa.hibernate.ddl-auto=update` 설정으로 자동으로 테이블이 생성됩니다.

⚠️ **주의**: 프로덕션 환경에서는 `spring.jpa.hibernate.ddl-auto=validate`를 사용하세요.

## 4. 연결 확인

애플리케이션을 실행한 후 로그에서 다음 메시지를 확인하세요:
```
HikariPool-1 - Starting...
HikariPool-1 - Start completed.
```

## 5. 트러블슈팅

### 연결 오류
- MySQL 서버가 실행 중인지 확인
- 데이터베이스 이름, 사용자명, 비밀번호 확인
- 방화벽 설정 확인

### 인코딩 문제
- 데이터베이스와 테이블의 문자셋이 `utf8mb4`인지 확인
- `characterEncoding=UTF-8` 설정 확인

### Connection Pool 오류
- `application.properties`에서 `spring.datasource.hikari.maximum-pool-size` 조정
- 데이터베이스 서버의 최대 연결 수 확인

