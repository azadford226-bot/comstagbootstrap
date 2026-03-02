package com.hivecontrolsolutions.comestag.infrastructure.config;

import com.hivecontrolsolutions.comestag.core.domain.port.EmailSenderPort;
import com.hivecontrolsolutions.comestag.infrastructure.client.NoOpEmailNotificationClient;
import com.hivecontrolsolutions.comestag.infrastructure.client.SendGridEmailNotificationClient;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;

@Configuration
@Profile({"stag", "prod"})
@Slf4j
public class EmailConfig {

    @Bean
    @Primary
    public EmailSenderPort emailSenderPort(
            @Value("${sendgrid.apiKey:}") String apiKey,
            @Value("${mail.from:}") String from,
            @Value("${mail.fromName:no-reply}") String fromName) {
        // If SendGrid API key is configured, try to use SendGrid client
        if (apiKey != null && !apiKey.trim().isEmpty() && from != null && !from.trim().isEmpty()) {
            try {
                log.info("Configuring SendGrid email client with API key (length: {})", apiKey.length());
                return new SendGridEmailNotificationClient(apiKey, from, fromName);
            } catch (Exception e) {
                log.warn("Failed to create SendGrid email client: {}. Falling back to no-op client.", e.getMessage());
                log.warn("Email sending will be disabled. To enable, configure SENDGRID_API_KEY and MAIL_FROM correctly.");
                return new NoOpEmailNotificationClient();
            }
        }
        // Otherwise, use no-op client
        log.warn("SendGrid not configured (apiKey or mail.from missing). Using no-op email client.");
        log.warn("Email sending will be disabled. To enable, set SENDGRID_API_KEY and MAIL_FROM environment variables.");
        return new NoOpEmailNotificationClient();
    }
}
