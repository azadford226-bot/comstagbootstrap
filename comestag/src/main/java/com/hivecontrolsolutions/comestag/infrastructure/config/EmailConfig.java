package com.hivecontrolsolutions.comestag.infrastructure.config;

import com.hivecontrolsolutions.comestag.core.domain.port.EmailSenderPort;
import com.hivecontrolsolutions.comestag.infrastructure.client.NoOpEmailNotificationClient;
import com.hivecontrolsolutions.comestag.infrastructure.client.ResendEmailNotificationClient;
import com.hivecontrolsolutions.comestag.infrastructure.client.SendGridEmailNotificationClient;
import com.hivecontrolsolutions.comestag.infrastructure.client.ZohoEmailNotificationClient;
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
            @Value("${zoho.mail.email:}") String zohoEmail,
            @Value("${zoho.mail.password:}") String zohoPassword,
            @Value("${resend.apiKey:}") String resendApiKey,
            @Value("${sendgrid.apiKey:}") String sendgridApiKey,
            @Value("${mail.from:}") String from,
            @Value("${mail.fromName:no-reply}") String fromName) {
        
        // Priority: Zoho > Resend > SendGrid > NoOp
        // Try Zoho first if configured
        if (zohoEmail != null && !zohoEmail.trim().isEmpty() && 
            zohoPassword != null && !zohoPassword.trim().isEmpty() && 
            from != null && !from.trim().isEmpty()) {
            try {
                log.info("Configuring Zoho Mail email client with email: {}", zohoEmail);
                return new ZohoEmailNotificationClient(zohoEmail, zohoPassword, from, fromName);
            } catch (Exception e) {
                log.warn("Failed to create Zoho Mail email client: {}. Trying Resend...", e.getMessage());
            }
        }
        
        // Try Resend if Zoho is not configured
        if (resendApiKey != null && !resendApiKey.trim().isEmpty() && from != null && !from.trim().isEmpty()) {
            try {
                log.info("Configuring Resend email client with API key (length: {})", resendApiKey.length());
                return new ResendEmailNotificationClient(resendApiKey, from, fromName);
            } catch (Exception e) {
                log.warn("Failed to create Resend email client: {}. Trying SendGrid...", e.getMessage());
            }
        }
        
        // Try SendGrid if Resend is not configured
        if (sendgridApiKey != null && !sendgridApiKey.trim().isEmpty() && from != null && !from.trim().isEmpty()) {
            try {
                log.info("Configuring SendGrid email client with API key (length: {})", sendgridApiKey.length());
                return new SendGridEmailNotificationClient(sendgridApiKey, from, fromName);
            } catch (Exception e) {
                log.warn("Failed to create SendGrid email client: {}. Falling back to no-op client.", e.getMessage());
                log.warn("Email sending will be disabled. To enable, configure ZOHO_MAIL_EMAIL/ZOHO_MAIL_PASSWORD, RESEND_API_KEY, or SENDGRID_API_KEY and MAIL_FROM correctly.");
                return new NoOpEmailNotificationClient();
            }
        }
        
        // Otherwise, use no-op client
        log.warn("No email service configured. Using no-op email client.");
        log.warn("Email sending will be disabled. To enable, set one of:");
        log.warn("  - ZOHO_MAIL_EMAIL and ZOHO_MAIL_PASSWORD (preferred)");
        log.warn("  - RESEND_API_KEY and MAIL_FROM");
        log.warn("  - SENDGRID_API_KEY and MAIL_FROM");
        return new NoOpEmailNotificationClient();
    }
}
