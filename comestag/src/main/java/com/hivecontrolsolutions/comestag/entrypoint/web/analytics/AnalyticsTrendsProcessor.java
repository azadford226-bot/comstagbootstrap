package com.hivecontrolsolutions.comestag.entrypoint.web.analytics;

import com.hivecontrolsolutions.comestag.base.stereotype.CurrentUserId;
import com.hivecontrolsolutions.comestag.base.stereotype.Processor;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.AnalyticsEventEntity;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.repo.AnalyticsEventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;

@Processor
@RequiredArgsConstructor
@RequestMapping("/v1/analytics")
public class AnalyticsTrendsProcessor {

    private final AnalyticsEventRepository repo;

    @PreAuthorize("hasAnyRole('CONSUMER','ORG') and hasAuthority('Profile_ACTIVE')")
    @GetMapping("/trends")
    public ResponseEntity<?> getTrends(@CurrentUserId UUID currentUserId,
                                       @RequestParam(defaultValue = "30") int days,
                                       @RequestParam(defaultValue = "profile_view") String eventType) {
        Instant since = Instant.now().minus(Duration.ofDays(days));
        var data = repo.countByDateRange(currentUserId, eventType, since);
        var result = data.stream().map(row -> Map.of(
                "date", row[0].toString(),
                "count", ((Number) row[1]).longValue()
        )).toList();
        return ResponseEntity.ok(Map.of("eventType", eventType, "days", days, "data", result));
    }

    @PreAuthorize("hasAnyRole('CONSUMER','ORG') and hasAuthority('Profile_ACTIVE')")
    @PostMapping("/track")
    public ResponseEntity<Void> trackEvent(@CurrentUserId UUID currentUserId,
                                           @RequestBody Map<String, String> body) {
        var entity = new AnalyticsEventEntity();
        String eventType = body.getOrDefault("eventType", "generic");
        UUID accountIdForAggregate = currentUserId;
        if ("profile_view".equals(eventType)) {
            String target = body.get("targetAccountId");
            if (target != null && !target.isBlank()) {
                try {
                    accountIdForAggregate = UUID.fromString(target.trim());
                } catch (IllegalArgumentException ignored) {
                    return ResponseEntity.badRequest().build();
                }
            }
        }
        entity.setAccountId(accountIdForAggregate);
        entity.setEventType(eventType);
        entity.setEventData(body.getOrDefault("data", "{}"));
        repo.save(entity);
        return ResponseEntity.ok().build();
    }
}
