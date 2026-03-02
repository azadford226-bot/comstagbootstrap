package com.hivecontrolsolutions.comestag.infrastructure.security.ratelimit;

import com.hivecontrolsolutions.comestag.infrastructure.config.RateLimitConfig;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Service for managing rate limiting using Bucket4j.
 * Implements token bucket algorithm for different endpoint types.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class RateLimitService {

    private final RateLimitConfig config;
    
    // Separate buckets for different IP addresses
    private final Map<String, Bucket> loginBuckets = new ConcurrentHashMap<>();
    private final Map<String, Bucket> registerBuckets = new ConcurrentHashMap<>();
    private final Map<String, Bucket> apiBuckets = new ConcurrentHashMap<>();

    /**
     * Check if login request is allowed for given IP
     */
    public boolean allowLogin(String ipAddress) {
        if (!config.isEnabled()) {
            return true;
        }
        return resolveBucket(ipAddress, loginBuckets, 
            config.getLogin().getCapacity(),
            config.getLogin().getRefillTokens(),
            config.getLogin().getRefillDurationMinutes())
            .tryConsume(1);
    }

    /**
     * Check if registration request is allowed for given IP
     */
    public boolean allowRegister(String ipAddress) {
        if (!config.isEnabled()) {
            return true;
        }
        return resolveBucket(ipAddress, registerBuckets,
            config.getRegister().getCapacity(),
            config.getRegister().getRefillTokens(),
            config.getRegister().getRefillDurationMinutes())
            .tryConsume(1);
    }

    /**
     * Check if general API request is allowed for given IP
     */
    public boolean allowApiRequest(String ipAddress) {
        if (!config.isEnabled()) {
            return true;
        }
        return resolveBucket(ipAddress, apiBuckets,
            config.getApi().getCapacity(),
            config.getApi().getRefillTokens(),
            config.getApi().getRefillDurationMinutes())
            .tryConsume(1);
    }

    /**
     * Get or create bucket for given key
     */
    private Bucket resolveBucket(String key, Map<String, Bucket> bucketMap, 
                                  int capacity, int refillTokens, int refillMinutes) {
        return bucketMap.computeIfAbsent(key, k -> createBucket(capacity, refillTokens, refillMinutes));
    }

    /**
     * Create a new bucket with specified parameters
     */
    private Bucket createBucket(int capacity, int refillTokens, int refillMinutes) {
        Refill refill = Refill.intervally(refillTokens, Duration.ofMinutes(refillMinutes));
        Bandwidth limit = Bandwidth.classic(capacity, refill);
        return Bucket.builder()
            .addLimit(limit)
            .build();
    }

    /**
     * Clear all buckets (useful for testing)
     */
    public void clearAll() {
        loginBuckets.clear();
        registerBuckets.clear();
        apiBuckets.clear();
    }
}
