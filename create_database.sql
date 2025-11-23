-- SNS 데이터베이스 생성 스크립트
-- MySQL에 접속하여 이 스크립트를 실행하세요
-- 
-- 사용 방법:
--   mysql -u root -p -h 127.0.0.1 < create_database.sql
--   또는
--   mysql -u root -p -h 127.0.0.1
--   그 다음 이 파일의 내용을 복사하여 실행

CREATE DATABASE IF NOT EXISTS sns_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- 데이터베이스 생성 확인
SHOW DATABASES LIKE 'sns_db';

-- 사용 권한 확인 (필요한 경우)
-- GRANT ALL PRIVILEGES ON sns_db.* TO 'root'@'localhost';
-- FLUSH PRIVILEGES;

