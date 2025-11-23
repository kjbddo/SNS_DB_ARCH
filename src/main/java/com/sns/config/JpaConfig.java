package com.sns.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

/**
 * JPA 설정
 * 
 * JPA Auditing과 Repository를 활성화합니다.
 */
@Configuration
@EnableJpaRepositories(basePackages = "com.sns.repository")
@EnableJpaAuditing
public class JpaConfig {
    // JPA 설정은 application.properties에서 관리됩니다.
}

