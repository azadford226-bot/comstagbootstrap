package com.hivecontrolsolutions.comestag.infrastructure.client;

import com.hivecontrolsolutions.comestag.core.domain.port.EmailSenderPort;
import com.hivecontrolsolutions.comestag.core.domain.model.EmailNotificationData;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;

import java.util.Properties;

@Slf4j
public class ZohoEmailNotificationClient implements EmailSenderPort {
    private final JavaMailSender javaMailSender;
    private final String from;
    private final String fromName;

    public ZohoEmailNotificationClient(String email, String password, String from, String fromName) {
        this.from = from;
        this.fromName = fromName;
        this.javaMailSender = createZohoMailSender(email, password);
    }

    private JavaMailSender createZohoMailSender(String email, String password) {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost("smtp.zoho.com");
        mailSender.setPort(587);
        mailSender.setUsername(email);
        mailSender.setPassword(password);

        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.starttls.required", "true");
        props.put("mail.smtp.ssl.trust", "smtp.zoho.com");
        props.put("mail.debug", "false");

        return mailSender;
    }

    @Override
    public void send(EmailNotificationData emailNotificationData) {
        try {
            log.info("Attempting to send email via Zoho Mail to: {}", emailNotificationData.to());
            
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            
            // Set from address with name if provided
            if (fromName != null && !fromName.trim().isEmpty()) {
                helper.setFrom(from, fromName);
            } else {
                helper.setFrom(from);
            }
            
            helper.setTo(emailNotificationData.to());
            helper.setSubject(emailNotificationData.subject());
            helper.setText(emailNotificationData.body(), emailNotificationData.isHtml());
            
            if (emailNotificationData.file() != null) {
                helper.addAttachment(
                    emailNotificationData.file().getFileName().toString(), 
                    emailNotificationData.file().toFile()
                );
            }
            
            javaMailSender.send(mimeMessage);
            log.info("Email sent successfully via Zoho Mail to: {}", emailNotificationData.to());
        } catch (MessagingException e) {
            log.error("Failed to create email message via Zoho Mail for: {}", emailNotificationData.to(), e);
            throw new RuntimeException("Failed to create email message: " + e.getMessage(), e);
        } catch (MailException e) {
            log.error("Failed to send email via Zoho Mail to: {}. Error: {}", emailNotificationData.to(), e.getMessage(), e);
            log.error("Check ZOHO_MAIL_EMAIL and ZOHO_MAIL_PASSWORD environment variables and Zoho account configuration.");
            throw new RuntimeException("Zoho Mail send error: " + e.getMessage() + 
                ". Please check ZOHO_MAIL_EMAIL and ZOHO_MAIL_PASSWORD configuration.", e);
        } catch (Exception e) {
            log.error("Unexpected error sending email via Zoho Mail to: {}", emailNotificationData.to(), e);
            throw new RuntimeException("Unexpected error sending email via Zoho Mail: " + e.getMessage(), e);
        }
    }
}
