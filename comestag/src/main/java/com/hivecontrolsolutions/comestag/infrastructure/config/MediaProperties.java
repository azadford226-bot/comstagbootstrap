package com.hivecontrolsolutions.comestag.infrastructure.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.Set;

@Configuration
@ConfigurationProperties(prefix = "app.media")
@Data
public class MediaProperties {
    private int maxAttachmentsPerPost = 10;
    private long maxFileBytes = 104_857_600L;
    private Set<String> allowedKinds = Set.of("IMAGE","VIDEO","DOC");
}

