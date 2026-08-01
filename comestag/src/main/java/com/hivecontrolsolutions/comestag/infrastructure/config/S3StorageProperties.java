package com.hivecontrolsolutions.comestag.infrastructure.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Configuration for S3-compatible object storage.
 * Works with DigitalOcean Spaces, AWS S3 and Cloudflare R2.
 * Active only when {@code storage.provider=s3}.
 */
@ConfigurationProperties(prefix = "storage.s3")
public record S3StorageProperties(
        // Custom endpoint for Spaces/R2 (e.g. https://nyc3.digitaloceanspaces.com). Leave blank for real AWS S3.
        String endpoint,
        String region,
        String accessKey,
        String secretKey,
        String bucket,
        // Public base URL used to build/strip public object URLs (optional).
        String publicBaseUrl,
        // R2 typically needs path-style access; Spaces/AWS use virtual-hosted style.
        boolean pathStyleAccess
) {
}
