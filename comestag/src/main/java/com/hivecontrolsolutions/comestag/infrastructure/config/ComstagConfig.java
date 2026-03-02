package com.hivecontrolsolutions.comestag.infrastructure.config;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@EnableAsync(proxyTargetClass = true)
@EnableConfigurationProperties(SupabaseProperties.class)
@Configuration
public class ComstagConfig {
}
