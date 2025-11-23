package com.sns.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;
import java.util.List;

/**
 * CORS 설정
 * 
 * 프론트엔드와 백엔드 간의 CORS 문제를 해결하기 위한 설정입니다.
 */
@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        
        // 특정 origin 허용
        config.setAllowedOrigins(Arrays.asList(
            "http://localhost:3000",
            "http://localhost:3001",
            "http://localhost:5173"
        ));
        
        // 모든 origin 패턴 허용 (개발 환경) - allowCredentials가 false일 때만 사용 가능
        config.setAllowedOriginPatterns(List.of("*"));
        
        // 허용할 HTTP 메서드
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "HEAD"));
        
        // 허용할 헤더
        config.setAllowedHeaders(List.of("*"));
        
        // 노출할 헤더
        config.setExposedHeaders(List.of("*"));
        
        // 인증 정보 허용 (allowCredentials와 "*" origin은 함께 사용 불가)
        config.setAllowCredentials(false);
        
        // preflight 요청 캐시 시간 (초)
        config.setMaxAge(3600L);
        
        source.registerCorsConfiguration("/api/**", config);
        return new CorsFilter(source);
    }
}

