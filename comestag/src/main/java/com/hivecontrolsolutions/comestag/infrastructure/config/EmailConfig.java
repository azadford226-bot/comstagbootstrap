package com.hivecontrolsolutions.comestag.infrastructure.config;

import com.hivecontrolsolutions.comestag.core.domain.port.EmailSenderPort;
import com.hivecontrolsolutions.comestag.infrastructure.client.NoOpEmailNotificationClient;
import com.hivecontrolsolutions.comestag.infrastructure.client.SendGridEmailNotificationClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;

@Configuration
@Profile({"stag", "prod"})
public class EmailConfig {

    @Bean
    @Primary
    public EmailSenderPort emailSenderPort(
            @Value("${sendgrid.apiKey:}") String apiKey,
            @Value("${mail.from:}") String from,
            @Value("${mail.fromName:no-reply}") String fromName) {
        // If SendGrid API key is configured, use SendGrid client
        if (apiKey != null && !apiKey.isEmpty() && from != null && !from.isEmpty()) {
            return new SendGridEmailNotificationClient(apiKey, from, fromName);
        }
        // Otherwise, use no-op client
        return new NoOpEmailNotificationClient();
    }
}
