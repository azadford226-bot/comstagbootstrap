package com.hivecontrolsolutions.comestag.infrastructure.config;

import com.hivecontrolsolutions.comestag.infrastructure.security.filter.CorsFilter;
import com.hivecontrolsolutions.comestag.infrastructure.security.filter.JwtAuthFilter;
import com.hivecontrolsolutions.comestag.infrastructure.security.filter.RateLimitFilter;
import com.hivecontrolsolutions.comestag.infrastructure.security.filter.RefreshTokenFilter;
import com.hivecontrolsolutions.comestag.infrastructure.config.SecurityHeadersConfig;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.http.HttpMethod;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final RefreshTokenFilter refreshTokenFilter;
    private final RateLimitFilter rateLimitFilter;
    private final CorsConfig corsConfig;
    private final SecurityHeadersConfig securityHeadersConfig;

    @Profile({"local", "stag"})
    @Bean
    public WebSecurityCustomizer webSecurityCustomizer() {
            return web -> web.ignoring()
                    .requestMatchers(
                "/v3/api-docs/**",
                "/swagger-ui.html",
                "/swagger-ui/**",
                            "/swagger-config/**",
                            "/v1/auth/login",
                            "/v1/auth/register/**",
                            "/v1/auth/reset-pass",
                            "/v1/auth/request-code/**",
                            "/v1/auth/token/**",
                            "/v1/auth/email-verify/**",
                            "/v1/auth/restore-email",
                            "/home/dynamic",
                            // Static frontend resources
                            "/_next/**",
                            "/static/**",
                            "/*.js",
                            "/*.css",
                            "/*.ico",
                            "/*.svg",
                            "/*.png",
                            "/*.jpg",
                            "/*.jpeg",
                            "/*.gif",
                            "/*.webp",
                            "/*.woff",
                            "/*.woff2",
                            "/*.ttf",
                            "/*.eot"
                    )
                    // Ignore all OPTIONS requests for CORS preflight
                    .requestMatchers(HttpMethod.OPTIONS);
    }

    @Bean
    SecurityFilterChain chain(HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(reg -> reg
                        // Allow OPTIONS requests for CORS preflight - must be first
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        // Allow static frontend resources
                        .requestMatchers(
                                "/_next/**",
                                "/static/**",
                                "/*.js",
                                "/*.css",
                                "/*.ico",
                                "/*.svg",
                                "/*.png",
                                "/*.jpg",
                                "/*.jpeg",
                                "/*.gif",
                                "/*.webp",
                                "/*.woff",
                                "/*.woff2",
                                "/*.ttf",
                                "/*.eot",
                                "/favicon.ico",
                                "/robots.txt",
                                "/sitemap.xml"
                        ).permitAll()
                        // Allow API endpoints that don't require auth
                        .requestMatchers("/v1/auth/**", "/home/dynamic", "/v1/contact").permitAll()
                        // Allow frontend routes (SPA) - frontend handles its own auth
                        .requestMatchers("/", "/login", "/signup/**", "/forgot-password", "/reset-password", "/verify-email", "/privacy", "/terms", "/under-construction").permitAll()
                        // All API requests (except auth) require authentication
                        .requestMatchers("/v1/**").authenticated()
                        // All other requests (frontend routes) are permitted - frontend handles routing
                        .anyRequest().permitAll()
                )
                .addFilterBefore(new CorsFilter(corsConfigurationSource()), UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(securityHeadersConfig, UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(rateLimitFilter, UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .addFilterAfter(refreshTokenFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    /**
     * CORS configuration for production use.
     * Allows specified origins, methods, and headers from application properties.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Set allowed origins from configuration
        List<String> allowedOrigins = corsConfig.getAllowedOrigins();
        if (allowedOrigins == null || allowedOrigins.isEmpty()) {
            // In production, fail if CORS origins are not configured
            String activeProfile = System.getProperty("spring.profiles.active", 
                System.getenv("SPRING_PROFILES_ACTIVE"));
            if ("prod".equals(activeProfile)) {
                throw new IllegalStateException(
                    "CORS_ALLOWED_ORIGINS must be set in production. " +
                    "Set the CORS_ALLOWED_ORIGINS environment variable with your production domain(s)."
                );
            }
            // Default to localhost only for development
            allowedOrigins = Arrays.asList("http://localhost:3000", "http://localhost:8080");
        }
        configuration.setAllowedOrigins(allowedOrigins);
        
        List<String> allowedMethods = corsConfig.getAllowedMethods();
        if (allowedMethods == null || allowedMethods.isEmpty()) {
            allowedMethods = Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS");
        }
        configuration.setAllowedMethods(allowedMethods);
        
        List<String> allowedHeaders = corsConfig.getAllowedHeaders();
        if (allowedHeaders == null || allowedHeaders.isEmpty()) {
            allowedHeaders = Arrays.asList("*");
        }
        configuration.setAllowedHeaders(allowedHeaders);
        configuration.setAllowCredentials(corsConfig.isAllowCredentials());
        configuration.setMaxAge(corsConfig.getMaxAge());

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}