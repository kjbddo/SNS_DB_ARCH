package com.sns.config;

import org.springframework.context.annotation.Configuration;

/**
 * DataSource 설정
 * 
 * Spring Boot는 자동으로 HikariCP를 DataSource로 사용합니다.
 * application.properties에서 설정한 값들이 자동으로 적용됩니다.
 * 
 * 추가 커스터마이징이 필요한 경우 아래 주석을 해제하고 설정하세요.
 */
@Configuration
public class DataSourceConfig {
    
    // Spring Boot가 자동으로 HikariCP DataSource를 생성하므로
    // 기본 설정은 application.properties에서 관리합니다.
    // 
    // 커스텀 DataSource가 필요한 경우 아래 코드를 사용하세요:
    //
    // @Bean
    // @ConfigurationProperties("spring.datasource.hikari")
    // public HikariDataSource dataSource(DataSourceProperties properties) {
    //     HikariDataSource dataSource = properties.initializeDataSourceBuilder()
    //             .type(HikariDataSource.class)
    //             .build();
    //     return dataSource;
    // }
}

