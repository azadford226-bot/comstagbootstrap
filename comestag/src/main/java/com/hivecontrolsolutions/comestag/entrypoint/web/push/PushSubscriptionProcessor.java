package com.hivecontrolsolutions.comestag.entrypoint.web.push;

import com.hivecontrolsolutions.comestag.base.stereotype.CurrentUserId;
import com.hivecontrolsolutions.comestag.base.stereotype.Processor;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.PushSubscriptionEntity;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.repo.PushSubscriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@Processor
@RequiredArgsConstructor
@RequestMapping("/v1/push")
public class PushSubscriptionProcessor {

    private final PushSubscriptionRepository repository;

    @PreAuthorize("hasAnyRole('CONSUMER','ORG') and hasAuthority('Profile_ACTIVE')")
    @PostMapping("/subscribe")
    public ResponseEntity<Map<String, String>> subscribe(
            @CurrentUserId UUID currentUserId,
            @RequestBody Map<String, String> body) {
        String endpoint = body.get("endpoint");
        if (endpoint == null || endpoint.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "endpoint required"));
        }

        PushSubscriptionEntity entity = PushSubscriptionEntity.builder()
                .accountId(currentUserId)
                .endpoint(endpoint)
                .p256dh(body.get("p256dh"))
                .auth(body.get("auth"))
                .build();
        repository.save(entity);
        return ResponseEntity.ok(Map.of("status", "subscribed"));
    }

    @PreAuthorize("hasAnyRole('CONSUMER','ORG') and hasAuthority('Profile_ACTIVE')")
    @Transactional
    @DeleteMapping("/unsubscribe")
    public ResponseEntity<Map<String, String>> unsubscribe(
            @CurrentUserId UUID currentUserId,
            @RequestBody Map<String, String> body) {
        String endpoint = body.get("endpoint");
        if (endpoint != null) {
            repository.deleteByAccountIdAndEndpoint(currentUserId, endpoint);
        }
        return ResponseEntity.ok(Map.of("status", "unsubscribed"));
    }
}
