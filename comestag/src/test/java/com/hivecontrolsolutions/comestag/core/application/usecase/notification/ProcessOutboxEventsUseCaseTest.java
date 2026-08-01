package com.hivecontrolsolutions.comestag.core.application.usecase.notification;

import com.hivecontrolsolutions.comestag.core.domain.model.AccountDm;
import com.hivecontrolsolutions.comestag.core.domain.model.NotificationPreferenceDm;
import com.hivecontrolsolutions.comestag.core.domain.model.NotificationSettingsDm;
import com.hivecontrolsolutions.comestag.core.domain.port.*;
import com.hivecontrolsolutions.comestag.core.domain.service.EmailNotification;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

/**
 * Unit tests for the outbox -> email dispatch decisioning in {@link ProcessOutboxEventsUseCase}.
 * Verifies that immediate-digest users receive emails for enabled categories, and that
 * digest/off users and disabled categories do not trigger immediate emails.
 */
@ExtendWith(MockitoExtension.class)
class ProcessOutboxEventsUseCaseTest {

    @Mock private OutboxProcessingPort outboxPort;
    @Mock private NotificationSettingsPort settingsPort;
    @Mock private NotificationCommandPort commandPort;
    @Mock private NotificationStreamPort streamPort;
    @Mock private NotificationPreferencePort preferencePort;
    @Mock private AccountPort accountPort;
    @Mock private EmailNotification emailNotification;

    @InjectMocks
    private ProcessOutboxEventsUseCase useCase;

    private final UUID recipientId = UUID.randomUUID();
    private final UUID actorId = UUID.randomUUID();
    private final UUID targetId = UUID.randomUUID();

    private OutboxProcessingPort.OutboxEventRow row(String eventType, Map<String, Object> inner, String targetKind) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("recipientAccountId", recipientId.toString());
        payload.put("actorAccountId", actorId.toString());
        payload.put("targetKind", targetKind);
        payload.put("targetId", targetId.toString());
        payload.put("payload", inner);
        payload.put("dedupeKey", eventType + ":" + targetId + ":" + recipientId);
        return new OutboxProcessingPort.OutboxEventRow(UUID.randomUUID(), eventType, payload, 0);
    }

    private void stubCommonProcessing(OutboxProcessingPort.OutboxEventRow r) {
        when(outboxPort.lockNextPending(anyInt())).thenReturn(List.of(r));
        when(settingsPort.getOrCreateDefault(recipientId))
                .thenReturn(NotificationSettingsDm.builder().accountId(recipientId).inAppEnabled(true).build());
        when(commandPort.createInAppIfAllowedAndNotDuplicated(any())).thenReturn(Optional.empty());
    }

    private void stubAccounts() {
        when(accountPort.getById(recipientId)).thenReturn(Optional.of(
                AccountDm.builder().id(recipientId).email("recipient@company.com").displayName("Recipient Org").build()));
        when(accountPort.getById(actorId)).thenReturn(Optional.of(
                AccountDm.builder().id(actorId).email("actor@company.com").displayName("Actor Org").build()));
    }

    @Test
    void immediateDigest_rfqNew_dispatchesRfqEmailAndMarksProcessed() {
        var r = row("RFQ_NEW", Map.of("rfqTitle", "Website Build"), "RFQ");
        stubCommonProcessing(r);
        stubAccounts();
        when(preferencePort.findByAccountId(recipientId)).thenReturn(Optional.of(
                NotificationPreferenceDm.builder().accountId(recipientId).emailDigest("immediate").rfqAlerts(true).build()));

        int processed = useCase.execute(10);

        assertProcessed(processed, r.id());
        verify(emailNotification).sendRfqNewEmail("Recipient Org", "recipient@company.com", "Actor Org", "Website Build");
    }

    @Test
    void immediateDigest_messageNew_dispatchesMessageEmail() {
        var r = row("MESSAGE_NEW", Map.of(), "CONVERSATION");
        stubCommonProcessing(r);
        stubAccounts();
        when(preferencePort.findByAccountId(recipientId)).thenReturn(Optional.of(
                NotificationPreferenceDm.builder().accountId(recipientId).emailDigest("immediate").messageAlerts(true).build()));

        int processed = useCase.execute(10);

        assertProcessed(processed, r.id());
        verify(emailNotification).sendMessageNewEmail("Recipient Org", "recipient@company.com", "Actor Org");
    }

    @Test
    void dailyDigest_rfqNew_doesNotDispatchImmediateEmailButStillProcesses() {
        var r = row("RFQ_NEW", Map.of("rfqTitle", "Website Build"), "RFQ");
        stubCommonProcessing(r);
        when(preferencePort.findByAccountId(recipientId)).thenReturn(Optional.of(
                NotificationPreferenceDm.builder().accountId(recipientId).emailDigest("daily").rfqAlerts(true).build()));

        int processed = useCase.execute(10);

        assertProcessed(processed, r.id());
        verify(emailNotification, never()).sendRfqNewEmail(any(), any(), any(), any());
        verify(accountPort, never()).getById(any());
    }

    @Test
    void immediateDigest_categoryDisabled_doesNotDispatchEmail() {
        var r = row("RFQ_NEW", Map.of("rfqTitle", "Website Build"), "RFQ");
        stubCommonProcessing(r);
        when(preferencePort.findByAccountId(recipientId)).thenReturn(Optional.of(
                NotificationPreferenceDm.builder().accountId(recipientId).emailDigest("immediate").rfqAlerts(false).build()));

        int processed = useCase.execute(10);

        assertProcessed(processed, r.id());
        verify(emailNotification, never()).sendRfqNewEmail(any(), any(), any(), any());
    }

    private void assertProcessed(int processed, UUID rowId) {
        org.junit.jupiter.api.Assertions.assertEquals(1, processed);
        verify(outboxPort).markProcessed(rowId);
        verify(outboxPort, never()).markFailed(any(), anyInt(), any(), any());
    }
}
