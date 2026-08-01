package com.hivecontrolsolutions.comestag.core.domain.service;

import com.hivecontrolsolutions.comestag.core.domain.model.EmailNotificationData;
import com.hivecontrolsolutions.comestag.core.domain.port.EmailSenderPort;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.verify;

/**
 * Unit tests for the business-event email methods on {@link EmailNotification}.
 * Verifies each method renders a non-empty branded HTML body and sends it to the
 * correct recipient with a meaningful subject (exercises the real templates).
 */
@ExtendWith(MockitoExtension.class)
class EmailNotificationTest {

    @Mock private EmailSenderPort emailSenderPort;
    @Captor private ArgumentCaptor<EmailNotificationData> captor;

    private EmailNotification emailNotification;

    @BeforeEach
    void setUp() {
        emailNotification = new EmailNotification(emailSenderPort);
        ReflectionTestUtils.setField(emailNotification, "frontendUrl", "https://app.comestag.com");
    }

    private EmailNotificationData capture() {
        verify(emailSenderPort).send(captor.capture());
        EmailNotificationData data = captor.getValue();
        assertTrue(data.isHtml(), "email should be HTML");
        assertNotNull(data.body());
        assertFalse(data.body().isBlank(), "email body must not be blank");
        assertTrue(data.body().contains("Comestag"), "body should be branded");
        return data;
    }

    @Test
    void sendRfqNewEmail_sendsBrandedEmailToRecipient() {
        emailNotification.sendRfqNewEmail("Acme Ltd", "acme@company.com", "Beta Corp", "Mobile App Build");
        EmailNotificationData data = capture();
        assertEquals("acme@company.com", data.to());
        assertTrue(data.subject().contains("Mobile App Build"));
        assertTrue(data.body().contains("Acme Ltd"));
        assertTrue(data.body().contains("Beta Corp"));
        assertTrue(data.body().contains("Mobile App Build"));
    }

    @Test
    void sendRfqBidEmail_sendsBrandedEmail() {
        emailNotification.sendRfqBidEmail("Acme Ltd", "acme@company.com", "Beta Corp", "Mobile App Build");
        EmailNotificationData data = capture();
        assertEquals("acme@company.com", data.to());
        assertTrue(data.subject().contains("Mobile App Build"));
        assertTrue(data.body().contains("Beta Corp"));
    }

    @Test
    void sendRfqAwardedEmail_sendsBrandedEmail() {
        emailNotification.sendRfqAwardedEmail("Acme Ltd", "acme@company.com", "Beta Corp", "Mobile App Build");
        EmailNotificationData data = capture();
        assertEquals("acme@company.com", data.to());
        assertTrue(data.subject().contains("Mobile App Build"));
    }

    @Test
    void sendMessageNewEmail_sendsBrandedEmailWithSender() {
        emailNotification.sendMessageNewEmail("Acme Ltd", "acme@company.com", "Beta Corp");
        EmailNotificationData data = capture();
        assertEquals("acme@company.com", data.to());
        assertTrue(data.subject().contains("Beta Corp"));
        assertTrue(data.body().contains("Beta Corp"));
    }

    @Test
    void sendFollowEmail_sendsBrandedEmailWithFollower() {
        emailNotification.sendFollowEmail("Acme Ltd", "acme@company.com", "Beta Corp");
        EmailNotificationData data = capture();
        assertEquals("acme@company.com", data.to());
        assertTrue(data.subject().contains("Beta Corp"));
    }

    @Test
    void sendOpportunityInterestEmail_sendsBrandedEmailWithTitle() {
        emailNotification.sendOpportunityInterestEmail("Acme Ltd", "acme@company.com", "Beta Corp", "Cloud Migration");
        EmailNotificationData data = capture();
        assertEquals("acme@company.com", data.to());
        assertTrue(data.subject().contains("Cloud Migration"));
        assertTrue(data.body().contains("Cloud Migration"));
    }
}
