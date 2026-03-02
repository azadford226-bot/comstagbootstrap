package com.hivecontrolsolutions.comestag.infrastructure.client;


import com.hivecontrolsolutions.comestag.base.stereotype.Client;
import com.hivecontrolsolutions.comestag.core.domain.port.EmailSenderPort;
import com.hivecontrolsolutions.comestag.core.domain.model.EmailNotificationData;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;

import static com.sendgrid.Method.POST;

@Profile("stag")
@Client
@Slf4j
public class SendGridEmailNotificationClient implements EmailSenderPort {
    private final SendGrid sg;
    private final String from;
    private final String fromName;

    public SendGridEmailNotificationClient(
            @Value("${sendgrid.apiKey}") String apiKey,
            @Value("${mail.from}") String from,
            @Value("${mail.fromName:no-reply}") String fromName) {
        this.sg = new SendGrid(apiKey);
        this.from = from;
        this.fromName = fromName;
    }

    @Override
    public void send(EmailNotificationData emailNotificationData) {
        try {
            log.info("Attempting to send email via SendGrid to: {}", emailNotificationData.to());
            Email from = new Email(this.from, fromName);
            Email toEmail = new Email(emailNotificationData.to());
            Content content = new Content("text/html", emailNotificationData.body());
            Mail mail = new Mail(from, emailNotificationData.subject(), toEmail, content);

            Request req = new Request();
            req.setMethod(POST);
            req.setEndpoint("mail/send");
            req.setBody(mail.build());

            Response res = sg.api(req);
            if (res.getStatusCode() >= 400) {
                log.error("SendGrid API error: Status {} - {}", res.getStatusCode(), res.getBody());
                throw new RuntimeException("SendGrid failed: " + res.getStatusCode() + " - " + res.getBody());
            }
            log.info("Email sent successfully via SendGrid to: {}", emailNotificationData.to());
        } catch (Exception e) {
            log.error("Failed to send email via SendGrid to: {}. Error: {}", emailNotificationData.to(), e.getMessage(), e);
            log.error("Check SENDGRID_API_KEY environment variable and SendGrid account configuration.");
            throw new RuntimeException("SendGrid send error: " + e.getMessage() + 
                ". Please check SENDGRID_API_KEY configuration.", e);
        }
    }
}
