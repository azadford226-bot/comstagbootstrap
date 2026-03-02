package com.hivecontrolsolutions.comestag.entrypoint.entity.auth;

import java.util.UUID;

/**
 * Login response that can contain either:
 * - userId (for regular users who need verification code)
 * - tokens (for ADMIN users who skip verification)
 */
public record AuthLoginResponse(
        UUID userId,
        String accessToken,
        String refreshToken
) {
    /**
     * Create response for regular users (with userId, no tokens)
     */
    public static AuthLoginResponse forRegularUser(UUID userId) {
        return new AuthLoginResponse(userId, null, null);
    }

    /**
     * Create response for ADMIN users (with tokens, no userId needed)
     */
    public static AuthLoginResponse forAdmin(String accessToken, String refreshToken) {
        return new AuthLoginResponse(null, accessToken, refreshToken);
    }

    /**
     * Check if this response contains tokens (ADMIN login)
     */
    public boolean hasTokens() {
        return accessToken != null && refreshToken != null;
    }

    /**
     * Check if this response contains userId (regular user login)
     */
    public boolean hasUserId() {
        return userId != null;
    }
}
