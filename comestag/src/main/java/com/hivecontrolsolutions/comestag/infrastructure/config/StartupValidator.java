package com.hivecontrolsolutions.comestag.infrastructure.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.core.env.Environment;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Validates critical configuration on application startup.
 * Fails fast if production-critical settings are misconfigured.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class StartupValidator implements ApplicationListener<ApplicationReadyEvent> {

    private final Environment environment;
    private final CorsConfig corsConfig;

    @Override
    public void onApplicationEvent(@NonNull ApplicationReadyEvent event) {
        String activeProfile = environment.getActiveProfiles().length > 0
                ? environment.getActiveProfiles()[0]
                : environment.getProperty("spring.profiles.active", "default");

        log.info("Validating configuration for profile: {}", activeProfile);

        // Only validate in production profile
        if ("prod".equals(activeProfile)) {
            validateProductionConfiguration();
        } else {
            log.info("Skipping production validation for profile: {}", activeProfile);
        }
    }

    private void validateProductionConfiguration() {
        log.info("Starting production configuration validation...");
        boolean hasErrors = false;

        try {
            // Validate CORS configuration
            if (!validateCorsConfiguration()) {
                hasErrors = true;
            }

            // Validate JWT secret
            if (!validateJwtSecret()) {
                hasErrors = true;
            }

            // Validate database configuration
            if (!validateDatabaseConfiguration()) {
                hasErrors = true;
            }

            // Validate email configuration
            if (!validateEmailConfiguration()) {
                hasErrors = true;
            }
        } catch (Exception e) {
            log.error("Exception during validation: {}", e.getMessage(), e);
            throw new IllegalStateException("Production configuration validation failed with exception: " + e.getMessage(), e);
        }

        if (hasErrors) {
            log.error("================================================");
            log.error("PRODUCTION CONFIGURATION VALIDATION FAILED!");
            log.error("Please fix the issues above before deploying.");
            log.error("================================================");
            IllegalStateException ex = new IllegalStateException(
                    "Production configuration validation failed. " +
                    "Please check the logs above for details."
            );
            log.error("Throwing exception: {}", ex.getMessage(), ex);
            throw ex;
        }

        log.info("✅ Production configuration validation passed");
    }

    private boolean validateCorsConfiguration() {
        List<String> allowedOrigins = corsConfig.getAllowedOrigins();
        
        if (allowedOrigins == null || allowedOrigins.isEmpty()) {
            log.error("❌ CORS Configuration Error:");
            log.error("   CORS_ALLOWED_ORIGINS environment variable is not set!");
            log.error("   This is REQUIRED for production deployment.");
            log.error("   Set it to your production domain(s), e.g.:");
            log.error("   CORS_ALLOWED_ORIGINS=https://app.comestag.com,https://www.comestag.com");
            return false;
        }

        // Check if origins contain localhost (should not in production)
        boolean hasLocalhost = allowedOrigins.stream()
                .anyMatch(origin -> origin.contains("localhost") || origin.contains("127.0.0.1"));
        
        if (hasLocalhost) {
            log.warn("⚠️  CORS Configuration Warning:");
            log.warn("   CORS_ALLOWED_ORIGINS contains localhost origins:");
            allowedOrigins.stream()
                    .filter(origin -> origin.contains("localhost") || origin.contains("127.0.0.1"))
                    .forEach(origin -> log.warn("     - {}", origin));
            log.warn("   This is not recommended for production.");
            // Don't fail, just warn
        }

        // Check if origins use HTTPS (recommended for production)
        boolean allHttps = allowedOrigins.stream()
                .allMatch(origin -> origin.startsWith("https://"));
        
        if (!allHttps) {
            log.warn("⚠️  CORS Configuration Warning:");
            log.warn("   Some CORS origins are not using HTTPS:");
            allowedOrigins.stream()
                    .filter(origin -> !origin.startsWith("https://"))
                    .forEach(origin -> log.warn("     - {}", origin));
            log.warn("   HTTPS is strongly recommended for production.");
            // Don't fail, just warn
        }

        log.info("✅ CORS Configuration: {} origin(s) configured", allowedOrigins.size());
        allowedOrigins.forEach(origin -> log.info("   - {}", origin));
        return true;
    }

    private boolean validateJwtSecret() {
        String jwtSecret = environment.getProperty("app.security.jwt-secret");
        
        if (jwtSecret == null || jwtSecret.isEmpty()) {
            log.error("❌ JWT Secret Error:");
            log.error("   APP_SECURITY_JWT_SECRET environment variable is not set!");
            log.error("   This is REQUIRED for production deployment.");
            return false;
        }

        // Check if using default secret
        if ("change-me-long-random-secret".equals(jwtSecret)) {
            log.error("❌ JWT Secret Error:");
            log.error("   APP_SECURITY_JWT_SECRET is using the default value!");
            log.error("   This is INSECURE and must be changed for production.");
            log.error("   Generate a secure random secret (minimum 32 characters).");
            return false;
        }

        // Check minimum length
        if (jwtSecret.length() < 32) {
            log.error("❌ JWT Secret Error:");
            log.error("   APP_SECURITY_JWT_SECRET is too short ({} characters).", jwtSecret.length());
            log.error("   Minimum length is 32 characters for security.");
            return false;
        }

        log.info("✅ JWT Secret: Configured (length: {} characters)", jwtSecret.length());
        return true;
    }

    private boolean validateDatabaseConfiguration() {
        String dbUrl = environment.getProperty("spring.datasource.url");
        String dbUsername = environment.getProperty("spring.datasource.username");
        String dbPassword = environment.getProperty("spring.datasource.password");

        if (dbUrl == null || dbUrl.isEmpty()) {
            log.error("❌ Database Configuration Error:");
            log.error("   SPRING_DATASOURCE_URL environment variable is not set!");
            return false;
        }

        if (dbUsername == null || dbUsername.isEmpty()) {
            log.error("❌ Database Configuration Error:");
            log.error("   SPRING_DATASOURCE_USERNAME environment variable is not set!");
            return false;
        }

        if (dbPassword == null || dbPassword.isEmpty()) {
            log.error("❌ Database Configuration Error:");
            log.error("   SPRING_DATASOURCE_PASSWORD environment variable is not set!");
            return false;
        }

        // Check if using default password
        if ("comestag".equals(dbPassword)) {
            log.warn("⚠️  Database Configuration Warning:");
            log.warn("   Database password appears to be using default value.");
            log.warn("   Consider using a stronger password in production.");
            // Don't fail, just warn
        }

        log.info("✅ Database Configuration: URL and credentials configured");
        return true;
    }

    private boolean validateEmailConfiguration() {
        try {
            // Check for any email service configuration (Zoho, Resend, or SendGrid)
            String zohoEmail = System.getenv("ZOHO_MAIL_EMAIL");
            String zohoPassword = System.getenv("ZOHO_MAIL_PASSWORD");
            String resendApiKey = System.getenv("RESEND_API_KEY");
            String sendgridApiKey = System.getenv("SENDGRID_API_KEY");
            String mailFrom = environment.getProperty("mail.from");

            boolean hasEmailConfig = (zohoEmail != null && !zohoEmail.isEmpty() && 
                                     zohoPassword != null && !zohoPassword.isEmpty()) ||
                                    (resendApiKey != null && !resendApiKey.isEmpty() && 
                                     mailFrom != null && !mailFrom.isEmpty()) ||
                                    (sendgridApiKey != null && !sendgridApiKey.isEmpty() && 
                                     mailFrom != null && !mailFrom.isEmpty());

            if (!hasEmailConfig) {
                log.warn("⚠️  Email Configuration Warning:");
                log.warn("   No email service configured (ZOHO_MAIL_EMAIL/ZOHO_MAIL_PASSWORD, RESEND_API_KEY, or SENDGRID_API_KEY with MAIL_FROM).");
                log.warn("   Email functionality will not work.");
            } else {
                log.info("✅ Email Configuration: Email service configured (Zoho, Resend, or SendGrid)");
            }

            // Email is not critical for startup, so we just warn
            return true;
        } catch (Exception e) {
            log.error("Exception during email validation: {}", e.getMessage(), e);
            // Don't fail on email validation errors - email is not critical
            return true;
        }
    }
}
