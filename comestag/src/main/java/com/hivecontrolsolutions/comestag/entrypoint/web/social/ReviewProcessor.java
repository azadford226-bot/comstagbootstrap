package com.hivecontrolsolutions.comestag.entrypoint.web.social;

import com.hivecontrolsolutions.comestag.core.domain.model.ReviewDm;
import com.hivecontrolsolutions.comestag.core.domain.port.ReviewPort;
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
}
