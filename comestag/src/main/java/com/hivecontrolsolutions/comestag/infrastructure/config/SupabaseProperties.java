package com.hivecontrolsolutions.comestag.infrastructure.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "supabase")
public record SupabaseProperties(
        String url,
        String serviceKey,
        Storage storage
) {
    public record Storage(
            String bucket,
            String publicBaseUrl
    ) {}
}
