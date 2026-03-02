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

}
