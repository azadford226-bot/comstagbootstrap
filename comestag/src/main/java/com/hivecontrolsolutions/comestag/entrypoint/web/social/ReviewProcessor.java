package com.hivecontrolsolutions.comestag.entrypoint.web.social;

import com.hivecontrolsolutions.comestag.core.domain.model.ReviewDm;
import com.hivecontrolsolutions.comestag.core.domain.port.ReviewPort;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.RfqEntity;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.repo.OpportunityInterestRepository;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.repo.OpportunityRepository;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.repo.RfqProposalRepository;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.repo.RfqRepository;
import com.hivecontrolsolutions.comestag.infrastructure.security.TokenOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/v1/reviews")
@RequiredArgsConstructor
public class ReviewProcessor {

    private final ReviewPort reviewPort;
    private final TokenOperation tokenOperation;
    private final RfqRepository rfqRepository;
    private final RfqProposalRepository rfqProposalRepository;
    private final OpportunityRepository opportunityRepository;
    private final OpportunityInterestRepository opportunityInterestRepository;

    public record CreateReviewRequest(
            UUID reviewedOrgId,
            int rating,
            String title,
            String body,
            String engagementType
    ) {}

    public record ReviewResponse(
            UUID id,
            UUID reviewerId,
            UUID reviewedOrgId,
            int rating,
            String title,
            String body,
            String engagementType,
            String createdAt
    ) {
        static ReviewResponse from(ReviewDm dm) {
            return new ReviewResponse(
                    dm.getId(),
                    dm.getReviewerId(),
                    dm.getReviewedOrgId(),
                    dm.getRating(),
                    dm.getTitle(),
                    dm.getBody(),
                    dm.getEngagementType(),
                    dm.getCreatedAt() != null ? dm.getCreatedAt().toString() : null
            );
        }
    }

    @PostMapping
    public ResponseEntity<?> createReview(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody CreateReviewRequest request
    ) {
        UUID userId = tokenOperation.getUserId(authHeader);
        ReviewDm review = ReviewDm.builder()
                .reviewerId(userId)
                .reviewedOrgId(request.reviewedOrgId())
                .rating(Math.max(1, Math.min(5, request.rating())))
                .title(request.title())
                .body(request.body())
                .engagementType(request.engagementType())
                .build();
        ReviewDm saved = reviewPort.save(review);
        return ResponseEntity.ok(Map.of("success", true, "data", ReviewResponse.from(saved)));
    }

    @GetMapping("/org/{orgId}")
    public ResponseEntity<?> getReviews(@PathVariable UUID orgId) {
        List<ReviewResponse> reviews = reviewPort.findByReviewedOrgId(orgId)
                .stream().map(ReviewResponse::from).toList();
        double avg = reviewPort.getAverageRating(orgId);
        long count = reviewPort.getReviewCount(orgId);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "data", Map.of("reviews", reviews, "averageRating", avg, "totalReviews", count)
        ));
    }

    @GetMapping("/org/{orgId}/summary")
    public ResponseEntity<?> getReviewSummary(@PathVariable UUID orgId) {
        double avg = reviewPort.getAverageRating(orgId);
        long count = reviewPort.getReviewCount(orgId);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "data", Map.of("averageRating", avg, "totalReviews", count)
        ));
    }

    @DeleteMapping("/{reviewedOrgId}")
    public ResponseEntity<?> deleteReview(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable UUID reviewedOrgId
    ) {
        UUID userId = tokenOperation.getUserId(authHeader);
        reviewPort.delete(userId, reviewedOrgId);
        return ResponseEntity.ok(Map.of("success", true));
    }

    /**
     * Whether the current org may review {@code reviewedOrgId} based on a shared RFQ and/or opportunity engagement.
     */
    @GetMapping("/eligibility")
    public ResponseEntity<?> reviewEligibility(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam UUID reviewedOrgId,
            @RequestParam(required = false) UUID rfqId,
            @RequestParam(required = false) UUID opportunityId
    ) {
        UUID reviewerOrgId = tokenOperation.getUserId(authHeader);
        if (reviewedOrgId.equals(reviewerOrgId)) {
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "data", Map.of("canReview", false, "reason", "cannot_review_self")
            ));
        }
        if (rfqId == null && opportunityId == null) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Provide rfqId and/or opportunityId to verify shared engagement"
            ));
        }

        boolean ok = false;
        String reason = "no_shared_engagement";

        if (rfqId != null) {
            var r = rfqRepository.findById(rfqId);
            if (r.isPresent() && eligibleForRfq(reviewerOrgId, reviewedOrgId, r.get())) {
                ok = true;
                reason = "shared_rfq";
            }
        }
        if (!ok && opportunityId != null) {
            if (eligibleForOpportunity(reviewerOrgId, reviewedOrgId, opportunityId)) {
                ok = true;
                reason = "shared_opportunity";
            }
        }

        return ResponseEntity.ok(Map.of(
                "success", true,
                "data", Map.of("canReview", ok, "reason", reason)
        ));
    }

    private boolean eligibleForRfq(UUID reviewerOrgId, UUID reviewedOrgId, RfqEntity rfq) {
        UUID owner = rfq.getOrganizationId();
        boolean reviewerIsOwner = owner.equals(reviewerOrgId);
        boolean reviewedIsOwner = owner.equals(reviewedOrgId);
        boolean reviewerHasProposal = rfqProposalRepository.findByRfqIdAndOrganizationId(rfq.getId(), reviewerOrgId).isPresent();
        boolean reviewedHasProposal = rfqProposalRepository.findByRfqIdAndOrganizationId(rfq.getId(), reviewedOrgId).isPresent();

        if (reviewerIsOwner && reviewedHasProposal) {
            return true;
        }
        if (reviewedIsOwner && reviewerHasProposal) {
            return true;
        }
        UUID awarded = rfq.getAwardedToId();
        if (awarded != null) {
            if (awarded.equals(reviewerOrgId) && reviewedIsOwner) {
                return true;
            }
            if (awarded.equals(reviewedOrgId) && reviewerIsOwner) {
                return true;
            }
        }
        return false;
    }

    private boolean eligibleForOpportunity(UUID reviewerOrgId, UUID reviewedOrgId, UUID opportunityId) {
        var opp = opportunityRepository.findById(opportunityId).orElse(null);
        if (opp == null) {
            return false;
        }
        UUID owner = opp.getOrganizationId();
        boolean reviewerIsOwner = owner.equals(reviewerOrgId);
        boolean reviewedIsOwner = owner.equals(reviewedOrgId);
        if (reviewedIsOwner && opportunityInterestRepository.existsByOpportunityIdAndAccountId(opportunityId, reviewerOrgId)) {
            return true;
        }
        if (reviewerIsOwner && opportunityInterestRepository.existsByOpportunityIdAndAccountId(opportunityId, reviewedOrgId)) {
            return true;
        }
        return false;
    }
}
