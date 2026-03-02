package com.hivecontrolsolutions.comestag.infrastructure.client;

import com.hivecontrolsolutions.comestag.core.domain.port.EmailSenderPort;
import com.hivecontrolsolutions.comestag.core.domain.model.EmailNotificationData;
import lombok.extern.slf4j.Slf4j;

/**
 * No-op email sender implementation used as a fallback when SendGrid is not configured.
 * This allows the application to start even without email configuration, though emails won't actually be sent.
 */
@Slf4j
public class NoOpEmailNotificationClient implements EmailSenderPort {

    @Override
    public void send(EmailNotificationData emailNotificationData) {
        log.warn("Email sending is disabled. Email would have been sent to: {} with subject: {}", 
                emailNotificationData.to(), emailNotificationData.subject());
        log.warn("To enable email sending, configure SENDGRID_API_KEY and MAIL_FROM environment variables.");
    }
}
