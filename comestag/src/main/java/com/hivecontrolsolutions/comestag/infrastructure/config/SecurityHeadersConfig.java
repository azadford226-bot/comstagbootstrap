package com.hivecontrolsolutions.comestag.infrastructure.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Security headers configuration for production.
 * Adds security headers to all responses to protect against common attacks.
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
@RequiredArgsConstructor
public class SecurityHeadersConfig extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        
        // XSS Protection
        response.setHeader("X-Content-Type-Options", "nosniff");
        response.setHeader("X-Frame-Options", "DENY");
        response.setHeader("X-XSS-Protection", "1; mode=block");
        
        // Content Security Policy - adjust based on your needs
        // Allow same origin, inline scripts/styles for Next.js, and API calls
        String csp = "default-src 'self'; " +
                "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " + // Next.js requires unsafe-eval
                "style-src 'self' 'unsafe-inline'; " +
                "img-src 'self' data: https:; " +
                "font-src 'self' data:; " +
                "connect-src 'self' https:; " +
                "frame-ancestors 'none';";
        response.setHeader("Content-Security-Policy", csp);
        
        // Referrer Policy
        response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
        
        // Permissions Policy (formerly Feature-Policy)
        response.setHeader("Permissions-Policy", 
            "geolocation=(), microphone=(), camera=()");
        
        // HSTS - only for HTTPS in production
        if (request.isSecure() || "https".equalsIgnoreCase(request.getHeader("X-Forwarded-Proto"))) {
            response.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
        }
        
        filterChain.doFilter(request, response);
    }
}
