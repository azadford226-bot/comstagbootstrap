package com.hivecontrolsolutions.comestag.infrastructure.security.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hivecontrolsolutions.comestag.base.core.error.entity.ApiResponse;
import com.hivecontrolsolutions.comestag.infrastructure.security.ratelimit.RateLimitService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Filter to apply rate limiting to specific endpoints.
 * Uses IP address to track request rates per client.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class RateLimitFilter extends OncePerRequestFilter {

    private final RateLimitService rateLimitService;
    private final ObjectMapper objectMapper;

    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                    HttpServletResponse response, 
                                    FilterChain filterChain) throws ServletException, IOException {
        
        String requestUri = request.getRequestURI();
        String ipAddress = getClientIpAddress(request);

        boolean allowed = true;
        String limitType = "";

        // Apply rate limiting based on endpoint
        if (requestUri.contains("/v1/auth/login")) {
            allowed = rateLimitService.allowLogin(ipAddress);
            limitType = "login";
        } else if (requestUri.contains("/v1/auth/register")) {
            allowed = rateLimitService.allowRegister(ipAddress);
            limitType = "registration";
        } else if (requestUri.startsWith("/v1/")) {
            allowed = rateLimitService.allowApiRequest(ipAddress);
            limitType = "API";
        }

        if (!allowed) {
            log.warn("Rate limit exceeded for {} from IP: {}, endpoint: {}", limitType, ipAddress, requestUri);
            sendRateLimitError(response, limitType);
            return;
        }

        filterChain.doFilter(request, response);
    }

    /**
     * Extract client IP address from request, considering proxy headers
     */
    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }
        
        return request.getRemoteAddr();
    }

    /**
     * Send rate limit error response
     */
    private void sendRateLimitError(HttpServletResponse response, String limitType) throws IOException {
        response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);

        ApiResponse<?> apiResponse = ApiResponse.builder()
            .statusCode(HttpStatus.TOO_MANY_REQUESTS.value())
            .message("Rate limit exceeded for " + limitType + ". Please try again later.")
            .build();

        response.getWriter().write(objectMapper.writeValueAsString(apiResponse));
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        // Don't apply rate limiting to static resources and swagger
        return path.startsWith("/_next/") || 
               path.startsWith("/static/") ||
               path.startsWith("/swagger-ui") ||
               path.startsWith("/v3/api-docs");
    }
}
