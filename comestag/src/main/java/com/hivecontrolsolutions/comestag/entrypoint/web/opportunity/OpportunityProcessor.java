package com.hivecontrolsolutions.comestag.entrypoint.web.opportunity;

import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.OpportunityEntity;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.OpportunityInterestEntity;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.repo.OpportunityInterestRepository;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.repo.OpportunityRepository;
import com.hivecontrolsolutions.comestag.infrastructure.security.TokenOperation;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/v1/opportunities")
@RequiredArgsConstructor
public class OpportunityProcessor {

    private final OpportunityRepository opportunityRepo;
    private final OpportunityInterestRepository interestRepo;
    private final TokenOperation tokenOperation;

    public record CreateOpportunityRequest(
            String title,
            String description,
            String type,
            String company,
            String location,
            String equity,
            String funding,
            String stage,
            String deadline,
            List<String> tags
    ) {}

    public record OpportunityResponse(
            UUID id,
            UUID organizationId,
            String title,
            String description,
            String type,
            String status,
            String company,
            String location,
            String equity,
            String funding,
            String stage,
            Instant deadline,
            List<String> tags,
            long interestCount,
            boolean hasExpressedInterest,
            Instant createdAt
    ) {
        static OpportunityResponse from(OpportunityEntity e, long interestCount, boolean interested) {
            return new OpportunityResponse(
                    e.getId(), e.getOrganizationId(), e.getTitle(), e.getDescription(),
                    e.getType(), e.getStatus(), e.getCompany(), e.getLocation(),
                    e.getEquity(), e.getFunding(), e.getStage(), e.getDeadline(),
                    e.getTags(), interestCount, interested, e.getCreatedAt()
            );
        }
    }

    @GetMapping
    public ResponseEntity<?> list(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(defaultValue = "all") String type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        UUID userId = tokenOperation.getUserId(authHeader);
        Page<OpportunityEntity> result;
        if ("all".equalsIgnoreCase(type)) {
            result = opportunityRepo.findAllByOrderByCreatedAtDesc(PageRequest.of(page, size));
        } else {
            result = opportunityRepo.findByTypeOrderByCreatedAtDesc(type, PageRequest.of(page, size));
        }
        List<OpportunityResponse> content = result.getContent().stream()
                .map(e -> OpportunityResponse.from(
                        e,
                        interestRepo.countByOpportunityId(e.getId()),
                        interestRepo.existsByOpportunityIdAndAccountId(e.getId(), userId)
                ))
                .toList();
        return ResponseEntity.ok(Map.of(
                "success", true,
                "data", Map.of(
                        "content", content,
                        "totalElements", result.getTotalElements(),
                        "totalPages", result.getTotalPages()
                )
        ));
    }

    @PostMapping
    public ResponseEntity<?> create(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody CreateOpportunityRequest request
    ) {
        UUID userId = tokenOperation.getUserId(authHeader);
        OpportunityEntity entity = OpportunityEntity.builder()
                .organizationId(userId)
                .title(request.title())
                .description(request.description())
                .type(request.type())
                .status("open")
                .company(request.company())
                .location(request.location())
                .equity(request.equity())
                .funding(request.funding())
                .stage(request.stage())
                .deadline(request.deadline() != null ? Instant.parse(request.deadline()) : null)
                .tags(request.tags())
                .build();
        OpportunityEntity saved = opportunityRepo.save(entity);
        return ResponseEntity.ok(Map.of("success", true, "data", OpportunityResponse.from(saved, 0, false)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable UUID id
    ) {
        UUID userId = tokenOperation.getUserId(authHeader);
        return opportunityRepo.findById(id)
                .map(e -> ResponseEntity.ok(Map.of("success", true, "data", OpportunityResponse.from(
                        e,
                        interestRepo.countByOpportunityId(e.getId()),
                        interestRepo.existsByOpportunityIdAndAccountId(e.getId(), userId)
                ))))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/interest")
    public ResponseEntity<?> expressInterest(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable UUID id
    ) {
        UUID userId = tokenOperation.getUserId(authHeader);
        if (!interestRepo.existsByOpportunityIdAndAccountId(id, userId)) {
            interestRepo.save(OpportunityInterestEntity.builder()
                    .opportunityId(id)
                    .accountId(userId)
                    .build());
        }
        return ResponseEntity.ok(Map.of("success", true));
    }

    @Transactional
    @DeleteMapping("/{id}/interest")
    public ResponseEntity<?> withdrawInterest(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable UUID id
    ) {
        UUID userId = tokenOperation.getUserId(authHeader);
        interestRepo.deleteByOpportunityIdAndAccountId(id, userId);
        return ResponseEntity.ok(Map.of("success", true));
    }
}
