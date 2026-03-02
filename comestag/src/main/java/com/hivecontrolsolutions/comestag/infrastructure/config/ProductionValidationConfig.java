package com.hivecontrolsolutions.comestag.infrastructure.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.context.event.EventListener;
import org.springframework.core.annotation.Order;

/**
 * Validates critical production configurations on application startup.
 * Fails fast if required production settings are missing or invalid.
 */
@Slf4j
@Configuration
@Profile("prod")
@Order(1)
public class ProductionValidationConfig {

    @Value("${app.security.jwt-secret:}")
    private String jwtSecret;

    @Value("${app.cors.allowed-origins:}")
    private String corsAllowedOrigins;

    @Value("${spring.datasource.url:}")
    private String datasourceUrl;

    @Value("${spring.datasource.username:}")
    private String datasourceUsername;

    @Value("${spring.datasource.password:}")
    private String datasourcePassword;

    @Value("${MAIL_USERNAME:}")
    private String mailUsername;

    @Value("${MAIL_PASSWORD:}")
    private String mailPassword;

    @EventListener(ApplicationReadyEvent.class)
    public void validateProductionConfig() {
        log.info("Validating production configuration...");
        
        boolean hasErrors = false;
        
        // Validate JWT Secret
        if (jwtSecret == null || jwtSecret.isEmpty() || jwtSecret.equals("change-me-long-random-secret")) {
            log.error("CRITICAL: APP_SECURITY_JWT_SECRET is not set or using default value!");
            hasErrors = true;
        } else if (jwtSecret.length() < 32) {
            log.error("CRITICAL: APP_SECURITY_JWT_SECRET must be at least 32 characters long!");
            hasErrors = true;
        }
        
        // Validate CORS Origins
        if (corsAllowedOrigins == null || corsAllowedOrigins.isEmpty()) {
            log.error("CRITICAL: CORS_ALLOWED_ORIGINS is not set! This will cause CORS errors in production.");
            hasErrors = true;
        }
        
        // Validate Database Configuration
        if (datasourceUrl == null || datasourceUrl.isEmpty() || 
            datasourceUrl.contains("localhost") || datasourceUrl.contains("127.0.0.1")) {
            log.error("CRITICAL: SPRING_DATASOURCE_URL is not set or points to localhost!");
            hasErrors = true;
        }
        
        if (datasourceUsername == null || datasourceUsername.isEmpty() || 
            datasourceUsername.equals("comestag")) {
            log.error("CRITICAL: SPRING_DATASOURCE_USERNAME is not set or using default value!");
            hasErrors = true;
        }
        
        if (datasourcePassword == null || datasourcePassword.isEmpty() || 
            datasourcePassword.equals("comestag")) {
            log.error("CRITICAL: SPRING_DATASOURCE_PASSWORD is not set or using default value!");
            hasErrors = true;
        }
        
        // Validate Email Configuration (warn but don't fail)
        if (mailUsername == null || mailUsername.isEmpty() || mailUsername.equals("test@test.com")) {
            log.warn("WARNING: MAIL_USERNAME is not configured. Email functionality will not work.");
        }
        
        if (mailPassword == null || mailPassword.isEmpty() || mailPassword.equals("test")) {
            log.warn("WARNING: MAIL_PASSWORD is not configured. Email functionality will not work.");
        }
        
        if (hasErrors) {
            log.error("==========================================");
            log.error("PRODUCTION CONFIGURATION VALIDATION FAILED");
            log.error("==========================================");
            log.error("Please set all required environment variables before deploying to production.");
            log.error("See PRODUCTION_ENV_VARIABLES.md for the complete list.");
            throw new IllegalStateException("Production configuration validation failed. Check logs for details.");
        }
        
        log.info("Production configuration validation passed.");
    }
}
