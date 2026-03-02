package com.hivecontrolsolutions.comestag.infrastructure.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.List;


@Getter
@Setter
@ConfigurationProperties(prefix = "email-check")
@Configuration
public class EmailCheckProps {
    private List<String> blockedDomains;
    private List<String> blockedSuffixes;
}

