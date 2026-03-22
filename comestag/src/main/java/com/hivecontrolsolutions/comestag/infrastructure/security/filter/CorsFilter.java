package com.hivecontrolsolutions.comestag.infrastructure.security.filter;

import com.hivecontrolsolutions.comestag.base.stereotype.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Custom CORS filter that handles OPTIONS requests before Spring Security authorization.
 * This ensures CORS preflight requests are handled correctly.
 */
@Filter
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
@RequiredArgsConstructor
public class CorsFilter extends OncePerRequestFilter {

    private final CorsConfigurationSource corsConfigurationSource;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String origin = request.getHeader("Origin");
        CorsConfiguration config = corsConfigurationSource.getCorsConfiguration(request);

        if (config == null) {
            filterChain.doFilter(request, response);
            return;
        }

        boolean originAllowed = isOriginAllowed(origin, config);

        // Handle CORS preflight (OPTIONS) requests
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            if (originAllowed && origin != null) {
                response.setHeader("Access-Control-Allow-Origin", origin);
                response.setHeader("Access-Control-Allow-Methods", String.join(", ", config.getAllowedMethods()));
                response.setHeader("Access-Control-Allow-Headers", String.join(", ", config.getAllowedHeaders()));
                response.setHeader("Access-Control-Allow-Credentials", String.valueOf(config.getAllowCredentials()));
                response.setHeader("Access-Control-Max-Age", String.valueOf(config.getMaxAge()));
                response.setStatus(HttpServletResponse.SC_OK);
                return;
            }
        }

        // For non-OPTIONS requests, add CORS headers if origin is allowed
        if (originAllowed && origin != null) {
            response.setHeader("Access-Control-Allow-Origin", origin);
            response.setHeader("Access-Control-Allow-Credentials", String.valueOf(config.getAllowCredentials()));
        }

        filterChain.doFilter(request, response);
    }

    private boolean isOriginAllowed(String origin, CorsConfiguration config) {
        if (origin == null) return false;
        var allowed = config.getAllowedOrigins();
        if (allowed == null) return false;
        if (allowed.contains("*")) return true;
        return allowed.contains(origin);
    }
}
