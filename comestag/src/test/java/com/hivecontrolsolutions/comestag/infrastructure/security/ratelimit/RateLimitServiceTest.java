package com.hivecontrolsolutions.comestag.infrastructure.security.ratelimit;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import com.hivecontrolsolutions.comestag.infrastructure.config.RateLimitConfig;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * Unit tests for RateLimitService
 */
@ExtendWith(MockitoExtension.class)
class RateLimitServiceTest {

    @Mock
    private RateLimitConfig config;

    @InjectMocks
    private RateLimitService rateLimitService;

    private RateLimitConfig.LoginConfig loginConfig;
    private RateLimitConfig.RegisterConfig registerConfig;
    private RateLimitConfig.ApiConfig apiConfig;

    @BeforeEach
    void setUp() {
        loginConfig = new RateLimitConfig.LoginConfig();
        loginConfig.setCapacity(3);
        loginConfig.setRefillTokens(3);
        loginConfig.setRefillDurationMinutes(15);

        registerConfig = new RateLimitConfig.RegisterConfig();
        registerConfig.setCapacity(2);
        registerConfig.setRefillTokens(2);
        registerConfig.setRefillDurationMinutes(60);

        apiConfig = new RateLimitConfig.ApiConfig();
        apiConfig.setCapacity(10);
        apiConfig.setRefillTokens(10);
        apiConfig.setRefillDurationMinutes(1);

        when(config.isEnabled()).thenReturn(true);
        when(config.getLogin()).thenReturn(loginConfig);
        when(config.getRegister()).thenReturn(registerConfig);
        when(config.getApi()).thenReturn(apiConfig);
    }

    @Test
    void allowLogin_WithinLimit_ReturnsTrue() {
        // Arrange
        String ipAddress = "192.168.1.1";

        // Act & Assert
        assertTrue(rateLimitService.allowLogin(ipAddress));
        assertTrue(rateLimitService.allowLogin(ipAddress));
        assertTrue(rateLimitService.allowLogin(ipAddress));
    }

    @Test
    void allowLogin_ExceedsLimit_ReturnsFalse() {
        // Arrange
        String ipAddress = "192.168.1.2";

        // Act
        // Consume all tokens (capacity = 3)
        rateLimitService.allowLogin(ipAddress);
        rateLimitService.allowLogin(ipAddress);
        rateLimitService.allowLogin(ipAddress);

        // Assert - fourth request should be blocked
        assertFalse(rateLimitService.allowLogin(ipAddress));
    }

    @Test
    void allowRegister_WithinLimit_ReturnsTrue() {
        // Arrange
        String ipAddress = "192.168.1.3";

        // Act & Assert
        assertTrue(rateLimitService.allowRegister(ipAddress));
        assertTrue(rateLimitService.allowRegister(ipAddress));
    }

    @Test
    void allowRegister_ExceedsLimit_ReturnsFalse() {
        // Arrange
        String ipAddress = "192.168.1.4";

        // Act
        rateLimitService.allowRegister(ipAddress);
        rateLimitService.allowRegister(ipAddress);

        // Assert - third request should be blocked
        assertFalse(rateLimitService.allowRegister(ipAddress));
    }

    @Test
    void allowApiRequest_WithinLimit_ReturnsTrue() {
        // Arrange
        String ipAddress = "192.168.1.5";

        // Act & Assert
        for (int i = 0; i < 10; i++) {
            assertTrue(rateLimitService.allowApiRequest(ipAddress));
        }
    }

    @Test
    void allowApiRequest_ExceedsLimit_ReturnsFalse() {
        // Arrange
        String ipAddress = "192.168.1.6";

        // Act
        for (int i = 0; i < 10; i++) {
            rateLimitService.allowApiRequest(ipAddress);
        }

        // Assert
        assertFalse(rateLimitService.allowApiRequest(ipAddress));
    }

    @Test
    void differentIpAddresses_HaveSeparateLimits() {
        // Arrange
        String ip1 = "192.168.1.7";
        String ip2 = "192.168.1.8";

        // Act & Assert
        // First IP consumes all tokens
        assertTrue(rateLimitService.allowLogin(ip1));
        assertTrue(rateLimitService.allowLogin(ip1));
        assertTrue(rateLimitService.allowLogin(ip1));
        assertFalse(rateLimitService.allowLogin(ip1));

        // Second IP should still have tokens available
        assertTrue(rateLimitService.allowLogin(ip2));
        assertTrue(rateLimitService.allowLogin(ip2));
        assertTrue(rateLimitService.allowLogin(ip2));
    }

    @Test
    void clearAll_ResetsAllBuckets() {
        // Arrange
        String ipAddress = "192.168.1.9";
        
        // Consume all tokens
        rateLimitService.allowLogin(ipAddress);
        rateLimitService.allowLogin(ipAddress);
        rateLimitService.allowLogin(ipAddress);
        assertFalse(rateLimitService.allowLogin(ipAddress));

        // Act
        rateLimitService.clearAll();

        // Assert - should be able to make requests again
        assertTrue(rateLimitService.allowLogin(ipAddress));
    }

    @Test
    void rateLimitDisabled_AlwaysReturnsTrue() {
        // Arrange
        when(config.isEnabled()).thenReturn(false);
        String ipAddress = "192.168.1.10";

        // Act & Assert
        for (int i = 0; i < 100; i++) {
            assertTrue(rateLimitService.allowLogin(ipAddress));
        }
    }
}
