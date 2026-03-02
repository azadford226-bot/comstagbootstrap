package com.hivecontrolsolutions.comestag.infrastructure.config;

import jakarta.annotation.PostConstruct;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

/**
 * CORS configuration properties.
 * Loaded from application.properties with prefix 'app.cors'
 * 
 * Supports comma-separated origins from environment variable CORS_ALLOWED_ORIGINS
 */
@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "app.cors")
public class CorsConfig {
    
    // Default values - will be overridden by application.properties if provided
    // In production, these should be set via CORS_ALLOWED_ORIGINS environment variable
    private List<String> allowedOrigins = Arrays.asList("http://localhost:3000", "http://localhost:8080");
    private List<String> allowedMethods = Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS");
    private List<String> allowedHeaders = Arrays.asList("Content-Type", "Authorization", "X-Requested-With");
    private boolean allowCredentials = true;
    private long maxAge = 3600;
    
    /**
     * Post-construct to handle comma-separated origins from environment variable.
     * If allowedOrigins contains a single comma-separated string, split it.
     */
    @PostConstruct
    public void processOrigins() {
        // If we have a single string that looks like comma-separated values, split it
        if (allowedOrigins != null && allowedOrigins.size() == 1) {
            String origins = allowedOrigins.get(0);
            if (origins.contains(",")) {
                allowedOrigins = Arrays.stream(origins.split(","))
                        .map(String::trim)
                        .filter(s -> !s.isEmpty())
                        .collect(Collectors.toList());
            }
        }
    }
}
