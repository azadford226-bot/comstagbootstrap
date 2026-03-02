package com.hivecontrolsolutions.comestag.infrastructure.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

import java.io.IOException;

/**
 * Configuration for serving static frontend files (Next.js build output).
 * This allows Spring Boot to serve the frontend application and handle SPA routing.
 */
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve static files from /static/ directory in classpath
        // Next.js build output will be copied to src/main/resources/static/ during build
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/")
                .resourceChain(true)
                .addResolver(new PathResourceResolver() {
                    @Override
                    protected Resource getResource(String resourcePath, Resource location) throws IOException {
                        Resource requestedResource = location.createRelative(resourcePath);
                        
                        // If the requested resource exists, serve it
                        if (requestedResource.exists() && requestedResource.isReadable()) {
                            return requestedResource;
                        }
                        
                        // For SPA routing, first try to serve the specific route HTML file
                        // (e.g., /login -> login.html, /admin/login -> admin/login.html)
                        // If not found, fall back to index.html
                        // API endpoints start with /v1/ or /api/
                        if (!resourcePath.startsWith("v1/") 
                                && !resourcePath.startsWith("api/")
                                && !resourcePath.startsWith("swagger")
                                && !resourcePath.startsWith("v3/")
                                && !resourcePath.startsWith("actuator")
                                && !resourcePath.contains(".")) {
                            // Try to find route-specific HTML file first
                            String htmlPath = resourcePath;
                            if (!htmlPath.endsWith(".html")) {
                                htmlPath = htmlPath + ".html";
                            }
                            // Remove leading slash if present
                            if (htmlPath.startsWith("/")) {
                                htmlPath = htmlPath.substring(1);
                            }
                            
                            Resource routeResource = new ClassPathResource("/static/" + htmlPath);
                            if (routeResource.exists() && routeResource.isReadable()) {
                                return routeResource;
                            }
                            
                            // Fall back to index.html for client-side routing
                            Resource indexResource = new ClassPathResource("/static/index.html");
                            if (indexResource.exists()) {
                                return indexResource;
                            }
                        }
                        
                        return null;
                    }
                });
    }
}


