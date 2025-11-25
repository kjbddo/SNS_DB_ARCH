# MySQL 연결 문제 해결 가이드

## 🔴 오류: Can't connect to local MySQL server through socket '/tmp/mysql.sock'

이 오류는 MySQL 서버가 실행 중이지만 소켓 파일 경로가 다를 때 발생합니다.

## ✅ 해결 방법

### 방법 1: TCP/IP 연결 사용 (권장)

소켓 파일 대신 TCP/IP 연결을 사용하도록 설정을 변경하세요.

**application.properties 수정:**
```properties
# 기존 (소켓 사용)
spring.datasource.url=jdbc:mysql://localhost:3306/sns_db?useSSL=false&serverTimezone=Asia/Seoul&characterEncoding=UTF-8&allowPublicKeyRetrieval=true

# 변경 (TCP/IP 명시적 지정)
spring.datasource.url=jdbc:mysql://127.0.0.1:3306/sns_db?useSSL=false&serverTimezone=Asia/Seoul&characterEncoding=UTF-8&allowPublicKeyRetrieval=true
```

또는 소켓 파일 경로를 명시:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/sns_db?useSSL=false&serverTimezone=Asia/Seoul&characterEncoding=UTF-8&allowPublicKeyRetrieval=true&socket=/usr/local/mysql/data/mysql.sock
```

### 방법 2: 소켓 파일 심볼릭 링크 생성

실제 소켓 파일 위치를 확인하고 심볼릭 링크를 생성:

```bash
# 소켓 파일 찾기
find /usr/local/mysql -name "*.sock" 2>/dev/null

# 심볼릭 링크 생성 (실제 경로로 변경 필요)
sudo ln -s /usr/local/mysql/data/mysql.sock /tmp/mysql.sock
```

### 방법 3: MySQL 서버 재시작

```bash
# MySQL 서버 중지
sudo /usr/local/mysql/support-files/mysql.server stop

# MySQL 서버 시작
sudo /usr/local/mysql/support-files/mysql.server start
```

### 방법 4: Homebrew MySQL 사용 (선택사항)

시스템 MySQL 대신 Homebrew MySQL을 사용:

```bash
# Homebrew MySQL 설치
brew install mysql

# Homebrew MySQL 시작
brew services start mysql

# 연결 테스트
mysql -u root -p
```

## 🔍 현재 상태 확인

MySQL 서버가 실행 중인지 확인:
```bash
ps aux | grep mysql
```

소켓 파일 위치 확인:
```bash
find /usr/local/mysql -name "*.sock" 2>/dev/null
```

## 📝 데이터베이스 생성 (TCP/IP 연결 사용)

```bash
# TCP/IP로 연결하여 데이터베이스 생성
mysql -u root -p -h 127.0.0.1 -e "CREATE DATABASE IF NOT EXISTS sns_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

## ⚙️ application.properties 권장 설정

```properties
# TCP/IP 연결 사용 (가장 안정적)
spring.datasource.url=jdbc:mysql://127.0.0.1:3306/sns_db?useSSL=false&serverTimezone=Asia/Seoul&characterEncoding=UTF-8&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=여기에_비밀번호_입력
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
```

