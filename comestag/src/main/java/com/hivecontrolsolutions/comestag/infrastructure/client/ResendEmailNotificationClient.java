package com.hivecontrolsolutions.comestag.infrastructure.client;

import com.hivecontrolsolutions.comestag.core.domain.port.EmailSenderPort;
import com.hivecontrolsolutions.comestag.core.domain.model.EmailNotificationData;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Slf4j
public class ResendEmailNotificationClient implements EmailSenderPort {
    private final String apiKey;
    private final String from;
    private final String fromName;
    private final RestTemplate restTemplate;
    private static final String RESEND_API_URL = "https://api.resend.com/emails";

    public ResendEmailNotificationClient(String apiKey, String from, String fromName) {
        this.apiKey = apiKey;
        this.from = from;
        this.fromName = fromName;
        this.restTemplate = new RestTemplate();
    }

    @Override
    public void send(EmailNotificationData emailNotificationData) {
        try {
            log.info("Attempting to send email via Resend to: {}", emailNotificationData.to());
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            if (apiKey != null) {
                headers.setBearerAuth(apiKey);
            } else {
                throw new IllegalStateException("Resend API key is null");
            }

            Map<String, Object> emailPayload = new HashMap<>();
            emailPayload.put("from", fromName != null && !fromName.isEmpty() 
                ? String.format("%s <%s>", fromName, from) 
                : from);
            emailPayload.put("to", emailNotificationData.to());
            emailPayload.put("subject", emailNotificationData.subject());
            
            if (emailNotificationData.isHtml()) {
                emailPayload.put("html", emailNotificationData.body());
            } else {
                emailPayload.put("text", emailNotificationData.body());
            }

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(emailPayload, headers);
            
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                RESEND_API_URL,
                HttpMethod.POST,
                request,
                new ParameterizedTypeReference<Map<String, Object>>() {}
            );

            if (response.getStatusCode().is2xxSuccessful()) {
                log.info("Email sent successfully via Resend to: {}", emailNotificationData.to());
                if (response.getBody() != null) {
                    log.debug("Resend response: {}", response.getBody());
                }
            } else {
                log.error("Resend API error: Status {} - {}", response.getStatusCode(), response.getBody());
                throw new RuntimeException("Resend failed: " + response.getStatusCode() + " - " + response.getBody());
            }
        } catch (Exception e) {
            log.error("Failed to send email via Resend to: {}. Error: {}", emailNotificationData.to(), e.getMessage(), e);
            log.error("Check RESEND_API_KEY environment variable and Resend account configuration.");
            throw new RuntimeException("Resend send error: " + e.getMessage() + 
                ". Please check RESEND_API_KEY configuration.", e);
        }
    }
}
