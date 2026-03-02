package com.hivecontrolsolutions.comestag.infrastructure.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration properties for rate limiting.
 * Loaded from application.properties with prefix 'app.rate-limit'
 */
@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "app.rate-limit")
public class RateLimitConfig {
    
    private boolean enabled = true;
    
    private LoginConfig login = new LoginConfig();
    private RegisterConfig register = new RegisterConfig();
    private ApiConfig api = new ApiConfig();
    
    @Getter
    @Setter
    public static class LoginConfig {
        private int capacity = 5;
        private int refillTokens = 5;
        private int refillDurationMinutes = 15;
    }
    
    @Getter
    @Setter
    public static class RegisterConfig {
        private int capacity = 3;
        private int refillTokens = 3;
        private int refillDurationMinutes = 60;
    }
    
    @Getter
    @Setter
    public static class ApiConfig {
        private int capacity = 100;
        private int refillTokens = 100;
        private int refillDurationMinutes = 1;
    }
}
