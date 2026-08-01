package com.hivecontrolsolutions.comestag.core.domain.service;

import com.hivecontrolsolutions.comestag.core.domain.model.EmailNotificationData;
import com.hivecontrolsolutions.comestag.core.domain.model.NotificationTemplate;
import com.hivecontrolsolutions.comestag.core.domain.port.EmailSenderPort;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import static com.hivecontrolsolutions.comestag.core.constant.ProcessorConstant.IDENTIFIER;
import static com.hivecontrolsolutions.comestag.core.constant.ProcessorConstant.ORG_ID;

@Service
@RequiredArgsConstructor
public class EmailNotification {
    @Value("${url.verification-code.verify}")
    private String verifyCodeUrl;
    @Value("${url.email.restore}")
    private String restoreEmailUrl;
    @Value("${url.org.my-profile}")
    private String myOrgProfileIdUrl;
    @Value("${app.frontend-url:http://localhost:3000}")
    private String frontendUrl;
    private final EmailSenderPort emailSenderPort;

    @Async
    public void sendVerificationMail(String userName, String to, String identifier) {
        String magicLink = verifyCodeUrl + "?" + IDENTIFIER + "=" + identifier;
        String templateBody = NotificationTemplate.buildMagicLinkEmailBody(userName, magicLink);
        emailSenderPort.send(new EmailNotificationData(to,
                "Email Verification",
                templateBody,
                true,
                null)
        );
    }

    @Async
    public void sendVerificationCode(String userName, String to, String code) {
        String templateBody = NotificationTemplate.buildSixDigitCodeEmailBody(userName, code);
        emailSenderPort.send(new EmailNotificationData(to,
                "Code Verification",
                templateBody,
                true,
                null)
        );
    }

    @Async
    public void sendChangeEmailAlert(String userName, String oldEmail, String newEmail, String identifier) {
        String restoreLink = restoreEmailUrl + "?" + IDENTIFIER + "=" + identifier;
        String templateBody = NotificationTemplate.buildEmailChangedAlertBody(userName, newEmail, restoreLink);
        emailSenderPort.send(new EmailNotificationData(oldEmail,
                "Email Changed",
                templateBody,
                true,
                null)
        );
    }

    @Async
    public void sendTestimonialCreated(String orgName, String to, String consumerName, int rating, String comment) {
        String templateBody = NotificationTemplate.buildNewTestimonialNotificationBody(orgName,consumerName,rating,comment,myOrgProfileIdUrl);
        emailSenderPort.send(new EmailNotificationData(to,
                "New Testimonial",
                templateBody,
                true,
                null)
        );
    }

    // ========== Business event email notifications ==========

    @Async
    public void sendRfqNewEmail(String recipientName, String to, String actorName, String rfqTitle) {
        String link = frontendUrl + "/rfq";
        String body = NotificationTemplate.buildRfqNewEmailBody(recipientName, actorName, rfqTitle, link);
        emailSenderPort.send(new EmailNotificationData(to, "New RFQ Invitation: " + rfqTitle, body, true, null));
    }

    @Async
    public void sendRfqBidEmail(String recipientName, String to, String bidderName, String rfqTitle) {
        String link = frontendUrl + "/rfq";
        String body = NotificationTemplate.buildRfqBidEmailBody(recipientName, bidderName, rfqTitle, link);
        emailSenderPort.send(new EmailNotificationData(to, "New Proposal for: " + rfqTitle, body, true, null));
    }

    @Async
    public void sendRfqAwardedEmail(String recipientName, String to, String awardorName, String rfqTitle) {
        String link = frontendUrl + "/rfq";
        String body = NotificationTemplate.buildRfqAwardedEmailBody(recipientName, awardorName, rfqTitle, link);
        emailSenderPort.send(new EmailNotificationData(to, "Proposal Accepted: " + rfqTitle, body, true, null));
    }

    @Async
    public void sendMessageNewEmail(String recipientName, String to, String senderName) {
        String link = frontendUrl + "/messages";
        String body = NotificationTemplate.buildMessageNewEmailBody(recipientName, senderName, link);
        emailSenderPort.send(new EmailNotificationData(to, "New message from " + senderName, body, true, null));
    }

    @Async
    public void sendFollowEmail(String recipientName, String to, String followerName) {
        String link = frontendUrl + "/profile";
        String body = NotificationTemplate.buildFollowEmailBody(recipientName, followerName, link);
        emailSenderPort.send(new EmailNotificationData(to, followerName + " started following you", body, true, null));
    }

    @Async
    public void sendOpportunityInterestEmail(String recipientName, String to, String interestedName, String opportunityTitle) {
        String link = frontendUrl + "/opportunities";
        String body = NotificationTemplate.buildOpportunityInterestEmailBody(recipientName, interestedName, opportunityTitle, link);
        emailSenderPort.send(new EmailNotificationData(to, "Interest in: " + opportunityTitle, body, true, null));
    }

    @Async
    public void sendDigestEmail(String to, String recipientName, String htmlBody, String frequency) {
        String subject = "daily".equals(frequency)
                ? "Your daily Comestag digest"
                : "Your weekly Comestag digest";
        emailSenderPort.send(new EmailNotificationData(to, subject, htmlBody, true, null));
    }

}
