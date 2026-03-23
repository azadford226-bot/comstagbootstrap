package com.hivecontrolsolutions.comestag.entrypoint.web.notification;

import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.NotificationPreferenceEntity;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.repo.NotificationPreferenceRepository;
import com.hivecontrolsolutions.comestag.infrastructure.security.TokenOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/v1/settings/notifications")
@RequiredArgsConstructor
public class NotificationPreferenceProcessor {

    private final NotificationPreferenceRepository repository;
    private final TokenOperation tokenOperation;

    public record NotificationPrefsRequest(
            String emailDigest,
            boolean inAppEnabled,
            boolean pushEnabled,
            boolean rfqAlerts,
            boolean messageAlerts,
            boolean opportunityAlerts,
            boolean systemAlerts
    ) {}

    public record NotificationPrefsResponse(
            String emailDigest,
            boolean inAppEnabled,
            boolean pushEnabled,
            boolean rfqAlerts,
            boolean messageAlerts,
            boolean opportunityAlerts,
            boolean systemAlerts
    ) {
        static NotificationPrefsResponse from(NotificationPreferenceEntity e) {
            return new NotificationPrefsResponse(
                    e.getEmailDigest(),
                    e.isInAppEnabled(),
                    e.isPushEnabled(),
                    e.isRfqAlerts(),
                    e.isMessageAlerts(),
                    e.isOpportunityAlerts(),
                    e.isSystemAlerts()
            );
        }
    }

    @GetMapping
    public ResponseEntity<?> getPreferences(@RequestHeader("Authorization") String authHeader) {
        UUID userId = tokenOperation.getUserId(authHeader);
        NotificationPreferenceEntity entity = repository.findByAccountId(userId)
                .orElseGet(() -> defaultPrefs(userId));
        return ResponseEntity.ok(Map.of("success", true, "data", NotificationPrefsResponse.from(entity)));
    }

    @PutMapping
    public ResponseEntity<?> updatePreferences(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody NotificationPrefsRequest request
    ) {
        UUID userId = tokenOperation.getUserId(authHeader);
        NotificationPreferenceEntity entity = repository.findByAccountId(userId)
                .orElseGet(() -> {
                    NotificationPreferenceEntity e = new NotificationPreferenceEntity();
                    e.setAccountId(userId);
                    return e;
                });
        entity.setEmailDigest(request.emailDigest());
        entity.setInAppEnabled(request.inAppEnabled());
        entity.setPushEnabled(request.pushEnabled());
        entity.setRfqAlerts(request.rfqAlerts());
        entity.setMessageAlerts(request.messageAlerts());
        entity.setOpportunityAlerts(request.opportunityAlerts());
        entity.setSystemAlerts(request.systemAlerts());
        repository.save(entity);
        return ResponseEntity.ok(Map.of("success", true, "data", NotificationPrefsResponse.from(entity)));
    }

    private NotificationPreferenceEntity defaultPrefs(UUID accountId) {
        return NotificationPreferenceEntity.builder()
                .accountId(accountId)
                .emailDigest("daily")
                .inAppEnabled(true)
                .pushEnabled(false)
                .rfqAlerts(true)
                .messageAlerts(true)
                .opportunityAlerts(true)
                .systemAlerts(true)
                .build();
    }
}
