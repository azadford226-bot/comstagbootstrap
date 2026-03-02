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
        
        // Handle CORS preflight (OPTIONS) requests
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            CorsConfiguration config = corsConfigurationSource.getCorsConfiguration(request);
            
            if (config != null) {
                // Check if origin is allowed
                if (origin != null && config.getAllowedOrigins().contains(origin)) {
                    response.setHeader("Access-Control-Allow-Origin", origin);
                    response.setHeader("Access-Control-Allow-Methods", String.join(", ", config.getAllowedMethods()));
                    response.setHeader("Access-Control-Allow-Headers", String.join(", ", config.getAllowedHeaders()));
                    response.setHeader("Access-Control-Allow-Credentials", String.valueOf(config.getAllowCredentials()));
                    response.setHeader("Access-Control-Max-Age", String.valueOf(config.getMaxAge()));
                    response.setStatus(HttpServletResponse.SC_OK);
                    return; // Don't continue the filter chain for OPTIONS
                }
            }
        }
        
        // For non-OPTIONS requests, add CORS headers if origin is allowed
        if (origin != null) {
            CorsConfiguration config = corsConfigurationSource.getCorsConfiguration(request);
            if (config != null && config.getAllowedOrigins().contains(origin)) {
                response.setHeader("Access-Control-Allow-Origin", origin);
                response.setHeader("Access-Control-Allow-Credentials", String.valueOf(config.getAllowCredentials()));
            }
        }
        
        filterChain.doFilter(request, response);
    }
}
