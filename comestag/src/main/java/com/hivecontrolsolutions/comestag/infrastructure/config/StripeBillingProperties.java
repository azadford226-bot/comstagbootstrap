package com.hivecontrolsolutions.comestag.infrastructure.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "billing.stripe")
public class StripeBillingProperties {
    private String secretKey = "";
    private String priceId = "";
    private String webhookSecret = "";
    private String appBaseUrl = "http://localhost:3000";

    public boolean isConfigured() {
        return !secretKey.isBlank() && !priceId.isBlank() && !webhookSecret.isBlank();
    }
}