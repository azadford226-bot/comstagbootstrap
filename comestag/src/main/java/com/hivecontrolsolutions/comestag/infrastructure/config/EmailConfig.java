package com.hivecontrolsolutions.comestag.infrastructure.config;

import com.hivecontrolsolutions.comestag.core.domain.port.EmailSenderPort;
import com.hivecontrolsolutions.comestag.infrastructure.client.NoOpEmailNotificationClient;
import com.hivecontrolsolutions.comestag.infrastructure.client.SendGridEmailNotificationClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;

@Configuration
@Profile({"stag", "prod"})
public class EmailConfig {

    @Bean
    @Primary
    @ConditionalOnProperty(name = "sendgrid.apiKey", matchIfMissing = false)
    public EmailSenderPort sendGridEmailNotificationClient(
            @Value("${sendgrid.apiKey:}") String apiKey,
            @Value("${mail.from:}") String from,
            @Value("${mail.fromName:no-reply}") String fromName) {
        if (apiKey == null || apiKey.isEmpty()) {
            throw new IllegalStateException("sendgrid.apiKey must be set when SendGridEmailNotificationClient is enabled");
        }
        if (from == null || from.isEmpty()) {
            throw new IllegalStateException("mail.from must be set when SendGridEmailNotificationClient is enabled");
        }
        return new SendGridEmailNotificationClient(apiKey, from, fromName);
    }

    @Bean
    @Primary
    @ConditionalOnMissingBean(name = "sendGridEmailNotificationClient")
    public EmailSenderPort noOpEmailNotificationClient() {
        return new NoOpEmailNotificationClient();
    }
}
