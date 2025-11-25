# 데이터베이스 비밀번호 설정 가이드

## 📍 비밀번호 설정 위치

데이터베이스 비밀번호는 **`src/main/resources/application.properties`** 파일에서 설정합니다.

## 🔧 설정 방법

### 1. 기본 설정 (application.properties)

```properties
# Database Configuration (MySQL)
spring.datasource.url=jdbc:mysql://localhost:3306/sns_db?useSSL=false&serverTimezone=Asia/Seoul&characterEncoding=UTF-8&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=여기에_비밀번호_입력
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
```

**현재 19번째 줄**에 있는 `spring.datasource.password=root`를 자신의 MySQL 비밀번호로 변경하세요.

### 2. 개발 환경 설정 (application-dev.properties)

개발 환경 프로파일을 사용하는 경우:
```properties
spring.datasource.password=여기에_비밀번호_입력
```

### 3. 프로덕션 환경 설정 (application-prod.properties)

프로덕션 환경에서는 **환경 변수**를 사용하는 것을 권장합니다:

```properties
spring.datasource.password=${DB_PASSWORD:기본값}
```

환경 변수로 설정:
```bash
export DB_PASSWORD=실제_비밀번호
```

또는 실행 시 지정:
```bash
./gradlew bootRun --args='--spring.profiles.active=prod --spring.datasource.password=실제_비밀번호'
```

## 📝 설정 예시

### 예시 1: 비밀번호가 "mypassword123"인 경우

```properties
spring.datasource.password=mypassword123
```

### 예시 2: 비밀번호가 없는 경우 (빈 비밀번호)

```properties
spring.datasource.password=
```

### 예시 3: 특수문자가 포함된 비밀번호

특수문자가 포함된 경우 그대로 입력하면 됩니다:
```properties
spring.datasource.password=MyP@ssw0rd!123
```

## ⚠️ 주의사항

1. **보안**: `application.properties` 파일은 Git에 커밋되지 않도록 `.gitignore`에 추가하는 것을 권장합니다.
2. **프로덕션**: 프로덕션 환경에서는 환경 변수나 외부 설정 파일을 사용하세요.
3. **비밀번호 확인**: MySQL에 실제로 설정된 비밀번호와 일치해야 합니다.

## 🔍 MySQL 비밀번호 확인 방법

MySQL에 접속하여 비밀번호를 확인하거나 변경할 수 있습니다:

```bash
# MySQL 접속
mysql -u root -p

# 비밀번호 변경 (MySQL 8.0 이상)
ALTER USER 'root'@'localhost' IDENTIFIED BY '새_비밀번호';
FLUSH PRIVILEGES;
```

## 📂 파일 위치

- 기본 설정: `src/main/resources/application.properties` (19번째 줄)
- 개발 환경: `src/main/resources/application-dev.properties` (7번째 줄)
- 프로덕션 환경: `src/main/resources/application-prod.properties` (8번째 줄)

