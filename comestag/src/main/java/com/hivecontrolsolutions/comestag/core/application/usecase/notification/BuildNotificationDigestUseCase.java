package com.hivecontrolsolutions.comestag.core.application.usecase.notification;

import com.hivecontrolsolutions.comestag.base.stereotype.UseCase;
import com.hivecontrolsolutions.comestag.core.domain.model.AccountDm;
import com.hivecontrolsolutions.comestag.core.domain.model.NotificationPreferenceDm;
import com.hivecontrolsolutions.comestag.core.domain.model.NotificationTemplate;
import com.hivecontrolsolutions.comestag.core.domain.model.NotificationViewDm;
import com.hivecontrolsolutions.comestag.core.domain.port.AccountPort;
import com.hivecontrolsolutions.comestag.core.domain.port.NotificationPreferencePort;
import com.hivecontrolsolutions.comestag.core.domain.port.NotificationQueryPort;
import com.hivecontrolsolutions.comestag.core.domain.service.EmailNotification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.time.Duration;
import java.time.Instant;
import java.util.List;

@UseCase
@RequiredArgsConstructor
@Slf4j
public class BuildNotificationDigestUseCase {

    private final NotificationPreferencePort preferencePort;
    private final NotificationQueryPort notificationQueryPort;
    private final AccountPort accountPort;
    private final EmailNotification emailNotification;

    public void execute(String frequency) {
        List<NotificationPreferenceDm> accounts = preferencePort.findByEmailDigest(frequency);
        log.info("Building {} digest for {} accounts", frequency, accounts.size());

        int sent = 0;
        for (NotificationPreferenceDm prefs : accounts) {
            try {
                if (processDigestForAccount(prefs, frequency)) {
                    sent++;
                }
            } catch (Exception ex) {
                log.warn("Digest failed for account {}: {}", prefs.getAccountId(), ex.getMessage());
            }
        }
        log.info("Sent {} {} digest emails", sent, frequency);
    }

    private boolean processDigestForAccount(NotificationPreferenceDm prefs, String frequency) {
        Instant since = "daily".equals(frequency)
                ? Instant.now().minus(Duration.ofDays(1))
                : Instant.now().minus(Duration.ofDays(7));

        List<NotificationViewDm> unread = notificationQueryPort.listUnreadSince(prefs.getAccountId(), since);
        if (unread.isEmpty()) return false;

        AccountDm account = accountPort.getById(prefs.getAccountId()).orElse(null);
        if (account == null || account.getEmail() == null) return false;

        String html = NotificationTemplate.buildDigestEmailBody(account.getDisplayName(), unread, frequency);
        emailNotification.sendDigestEmail(account.getEmail(), account.getDisplayName(), html, frequency);
        return true;
    }
}
