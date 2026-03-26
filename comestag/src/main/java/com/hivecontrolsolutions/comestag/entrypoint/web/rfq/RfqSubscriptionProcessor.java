package com.hivecontrolsolutions.comestag.entrypoint.web.rfq;

import com.hivecontrolsolutions.comestag.base.stereotype.CurrentUserId;
import com.hivecontrolsolutions.comestag.base.stereotype.Processor;
import com.hivecontrolsolutions.comestag.entrypoint.entity.rfq.CreateRfqSubscriptionRequest;
import com.hivecontrolsolutions.comestag.entrypoint.entity.rfq.RfqSubscriptionResponse;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.RfqSubscriptionEntity;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.repo.RfqSubscriptionRepository;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import static org.springframework.http.HttpStatus.CREATED;

@Processor
@RequiredArgsConstructor
@RequestMapping("/v1/rfq/subscriptions")
public class RfqSubscriptionProcessor {

    private final RfqSubscriptionRepository repository;

    @PreAuthorize("hasAnyRole('CONSUMER','ORG') and hasAuthority('Profile_ACTIVE')")
    @GetMapping
    @Operation(summary = "List RFQ subscriptions", description = "List all RFQ alert subscriptions for the current user")
    public ResponseEntity<List<RfqSubscriptionResponse>> list(@CurrentUserId UUID currentUserId) {
        List<RfqSubscriptionResponse> subscriptions = repository.findByAccountId(currentUserId)
                .stream()
                .map(RfqSubscriptionResponse::from)
                .collect(Collectors.toList());
        return ResponseEntity.ok(subscriptions);
    }

    @PreAuthorize("hasAnyRole('CONSUMER','ORG') and hasAuthority('Profile_ACTIVE')")
    @PostMapping
    @Operation(summary = "Create RFQ subscription", description = "Create a new RFQ alert subscription")
    public ResponseEntity<RfqSubscriptionResponse> create(
            @CurrentUserId UUID currentUserId,
            @RequestBody CreateRfqSubscriptionRequest request) {
        var entity = RfqSubscriptionEntity.builder()
                .accountId(currentUserId)
                .keyword(request.keyword())
                .category(request.category())
                .build();
        var saved = repository.save(entity);
        return ResponseEntity.status(CREATED).body(RfqSubscriptionResponse.from(saved));
    }

    @PreAuthorize("hasAnyRole('CONSUMER','ORG') and hasAuthority('Profile_ACTIVE')")
    @DeleteMapping("/{id}")
    @Transactional
    @Operation(summary = "Delete RFQ subscription", description = "Delete an RFQ alert subscription")
    public ResponseEntity<Void> delete(
            @CurrentUserId UUID currentUserId,
            @PathVariable UUID id) {
        repository.deleteByIdAndAccountId(id, currentUserId);
        return ResponseEntity.noContent().build();
    }
}
