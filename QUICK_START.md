# 빠른 시작 가이드

## 🚀 데이터베이스 생성 (필수)

애플리케이션을 실행하기 전에 MySQL에 데이터베이스를 생성해야 합니다.

### 방법 1: MySQL 명령줄 사용

```bash
# MySQL에 접속
mysql -u root -p

# 데이터베이스 생성
CREATE DATABASE sns_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 확인
SHOW DATABASES LIKE 'sns_db';

# 종료
EXIT;
```

### 방법 2: SQL 스크립트 실행

```bash
# create_database.sql 파일 실행
mysql -u root -p < create_database.sql
```

### 방법 3: 한 줄 명령어

```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS sns_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

## ⚙️ 설정 확인

1. **데이터베이스 비밀번호 설정**
   - `src/main/resources/application.properties` 파일 열기
   - 19번째 줄의 `spring.datasource.password=root`를 자신의 MySQL 비밀번호로 변경

2. **데이터베이스 이름 확인**
   - 기본값: `sns_db`
   - 다른 이름을 사용하려면 `spring.datasource.url`에서 변경

## ▶️ 애플리케이션 실행

```bash
# 기본 실행
./gradlew bootRun

# 개발 환경으로 실행
./gradlew bootRun --args='--spring.profiles.active=dev'
```

## ✅ 실행 확인

애플리케이션이 정상적으로 시작되면 다음 메시지가 표시됩니다:
```
Started SnsApplication in X.XXX seconds
```

## 🔧 문제 해결

### "Unknown database 'sns_db'" 오류
→ 위의 데이터베이스 생성 방법을 따라 데이터베이스를 생성하세요.

### "Access denied" 오류
→ `application.properties`의 사용자명과 비밀번호를 확인하세요.

### "Connection refused" 오류
→ MySQL 서버가 실행 중인지 확인하세요:
```bash
# macOS
brew services list | grep mysql

# Linux
sudo systemctl status mysql
```

