package com.hivecontrolsolutions.comestag.core.application.usecase.contact;

import com.hivecontrolsolutions.comestag.base.core.usecase.UsecaseWithoutOutput;
import com.hivecontrolsolutions.comestag.base.stereotype.UseCase;
import com.hivecontrolsolutions.comestag.core.domain.model.ContactMessageDm;
import com.hivecontrolsolutions.comestag.core.domain.model.EmailNotificationData;
import com.hivecontrolsolutions.comestag.core.domain.port.ContactMessagePort;
import com.hivecontrolsolutions.comestag.core.domain.port.EmailSenderPort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;

import java.util.UUID;

@UseCase
@RequiredArgsConstructor
@Slf4j
public class SubmitContactFormUseCase implements UsecaseWithoutOutput<SubmitContactFormUseCase.Input> {

    private final EmailSenderPort emailSenderPort;
    private final ContactMessagePort contactMessagePort;

    @Value("${mail.contact:info@comstag.com}")
    private String contactEmail;

    @Override
    public void execute(Input input) {
        log.info("Processing contact form submission from: {}", input.email());
        
        try {
            // Store contact message in database
            ContactMessageDm message = ContactMessageDm.builder()
                    .id(UUID.randomUUID())
                    .name(input.name())
                    .email(input.email())
                    .subject(input.subject())
                    .message(input.message())
                    .read(false)
                    .build();
            
            contactMessagePort.save(message);
            log.info("Contact message saved successfully with ID: {}", message.getId());
            
            // Send email notification to admin asynchronously
            // Email failures won't affect the response since it's async
            sendEmailNotification(input);
        } catch (Exception e) {
            log.error("Failed to process contact form submission from: {}", input.email(), e);
            throw e; // Re-throw to let GlobalExceptionHandler handle it
        }
    }
    
    @Async
    private void sendEmailNotification(Input input) {
        try {
            log.info("Attempting to send contact form notification email to: {}", contactEmail);
            
            // Build email body with contact form details
            String emailBody = buildEmailBody(input);
            
            // Send email to admin
            EmailNotificationData notification = new EmailNotificationData(
                    contactEmail,
                    "Contact Form: " + input.subject(),
                    emailBody,
                    true, // HTML email
                    null  // No attachments
            );
            
            emailSenderPort.send(notification);
            log.info("Contact form notification email sent successfully to: {}", contactEmail);
        } catch (Exception e) {
            // Log error but don't throw - email failure shouldn't prevent contact form submission
            log.error("Failed to send contact form notification email to: {}. " +
                    "Contact message was saved but email notification failed. " +
                    "Check email configuration (MAIL_USERNAME, MAIL_PASSWORD).", contactEmail, e);
        }
    }

    private String buildEmailBody(Input input) {
        return String.format("""
            <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2 style="color: #2563eb;">New Contact Form Submission</h2>
                <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p><strong>Name:</strong> %s</p>
                    <p><strong>Email:</strong> <a href="mailto:%s">%s</a></p>
                    <p><strong>Subject:</strong> %s</p>
                </div>
                <div style="margin: 20px 0;">
                    <h3 style="color: #2563eb;">Message:</h3>
                    <p style="background-color: #ffffff; padding: 15px; border-left: 4px solid #2563eb; white-space: pre-wrap;">%s</p>
                </div>
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
                <p style="color: #6b7280; font-size: 12px;">This email was sent from the ComStag contact form.</p>
            </body>
            </html>
            """,
                escapeHtml(input.name()),
                input.email(),
                input.email(),
                escapeHtml(input.subject()),
                escapeHtml(input.message())
        );
    }

    private String escapeHtml(String text) {
        if (text == null) return "";
        return text
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
    }

    public record Input(
            String name,
            String email,
            String subject,
            String message
    ) {}
}
