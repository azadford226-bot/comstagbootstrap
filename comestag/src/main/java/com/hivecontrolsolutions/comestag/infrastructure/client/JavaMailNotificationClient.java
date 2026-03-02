package com.hivecontrolsolutions.comestag.infrastructure.client;

import com.hivecontrolsolutions.comestag.base.stereotype.Client;
import com.hivecontrolsolutions.comestag.core.domain.port.EmailSenderPort;
import com.hivecontrolsolutions.comestag.core.domain.model.EmailNotificationData;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;

@Profile("local")
@Client
@Slf4j
public class JavaMailNotificationClient implements EmailSenderPort {

    private final JavaMailSender javaMailSender;

    @SuppressWarnings("SpringJavaInjectionPointsAutowiringInspection")
    public JavaMailNotificationClient(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
    }

    @Async
    @Override
    public void send(EmailNotificationData notification) {
        try {
            log.info("Attempting to send email to: {}", notification.to());
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            helper.setTo(notification.to());
            helper.setSubject(notification.subject());
            helper.setText(notification.body(), notification.isHtml());
            if (notification.file() != null)
                helper.addAttachment(notification.file().getFileName().toString(), notification.file().toFile());
            
            javaMailSender.send(mimeMessage);
            log.info("Email sent successfully to: {}", notification.to());
        } catch (MessagingException e) {
            log.error("Failed to create email message for: {}", notification.to(), e);
            throw new RuntimeException("Failed to create email message: " + e.getMessage(), e);
        } catch (MailException e) {
            log.error("Failed to send email to: {}. Error: {}", notification.to(), e.getMessage(), e);
            log.error("Email service may not be configured. Check MAIL_USERNAME and MAIL_PASSWORD environment variables.");
            throw new RuntimeException("Failed to send email: " + e.getMessage() + 
                ". Please check email configuration (MAIL_USERNAME, MAIL_PASSWORD).", e);
        } catch (Exception e) {
            log.error("Unexpected error sending email to: {}", notification.to(), e);
            throw new RuntimeException("Unexpected error sending email: " + e.getMessage(), e);
        }
    }
}