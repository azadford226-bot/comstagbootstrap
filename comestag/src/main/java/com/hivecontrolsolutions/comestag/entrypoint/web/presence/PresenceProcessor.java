package com.hivecontrolsolutions.comestag.entrypoint.web.presence;

import com.hivecontrolsolutions.comestag.base.stereotype.CurrentUserId;
import com.hivecontrolsolutions.comestag.base.stereotype.Processor;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.UserPresenceEntity;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.repo.UserPresenceRepository;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Processor
@RequiredArgsConstructor
@RequestMapping("/v1/presence")
public class PresenceProcessor {

    private final UserPresenceRepository presenceRepository;

    @PreAuthorize("hasAnyRole('CONSUMER','ORG') and hasAuthority('Profile_ACTIVE')")
    @PostMapping("/heartbeat")
    @Transactional
    @Operation(summary = "Heartbeat", description = "Upsert online presence for the current user")
    public ResponseEntity<Void> heartbeat(@CurrentUserId UUID currentUserId) {
        presenceRepository.findById(currentUserId).ifPresentOrElse(
                p -> presenceRepository.heartbeat(currentUserId, Instant.now()),
                () -> {
                    UserPresenceEntity entity = UserPresenceEntity.builder()
                            .accountId(currentUserId)
                            .lastSeen(Instant.now())
                            .online(true)
                            .build();
                    presenceRepository.save(entity);
                }
        );
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("hasAnyRole('CONSUMER','ORG') and hasAuthority('Profile_ACTIVE')")
    @PostMapping("/typing")
    @Operation(summary = "Typing indicator", description = "Notify typing status (placeholder for SSE broadcast)")
    public ResponseEntity<Void> typing(
            @CurrentUserId UUID currentUserId,
            @RequestBody Map<String, String> body) {
        // Future: broadcast typing event via SSE to conversation participants
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("hasAnyRole('CONSUMER','ORG') and hasAuthority('Profile_ACTIVE')")
    @GetMapping("/status")
    @Operation(summary = "Bulk presence check", description = "Check online status for a list of user IDs")
    public ResponseEntity<Map<UUID, Map<String, Object>>> getStatus(@RequestParam List<UUID> ids) {
        var presences = presenceRepository.findByAccountIdIn(ids);
        var result = presences.stream().collect(Collectors.toMap(
                UserPresenceEntity::getAccountId,
                p -> Map.<String, Object>of(
                        "online", p.isOnline(),
                        "lastSeen", p.getLastSeen().toString()
                )
        ));
        return ResponseEntity.ok(result);
    }
}
