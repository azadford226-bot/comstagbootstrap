package com.hivecontrolsolutions.comestag.infrastructure.persistence.entity;

import com.hivecontrolsolutions.comestag.core.domain.model.ReviewDm;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Generated;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "reviews", uniqueConstraints = @UniqueConstraint(columnNames = {"reviewer_id", "reviewed_org_id"}))
public class ReviewEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "reviewer_id", nullable = false)
    private UUID reviewerId;

    @Column(name = "reviewed_org_id", nullable = false)
    private UUID reviewedOrgId;

    @Column(nullable = false)
    private int rating;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String body;

    @Column(name = "engagement_type")
    private String engagementType;

    @Setter(AccessLevel.NONE)
    @Column(name = "created_at", updatable = false, insertable = false)
    @Generated
    private Instant createdAt;

    @Setter(AccessLevel.NONE)
    @Column(name = "updated_at", insertable = false)
    @Generated
    private Instant updatedAt;

    public ReviewDm toDm() {
        return ReviewDm.builder()
                .id(this.id)
                .reviewerId(this.reviewerId)
                .reviewedOrgId(this.reviewedOrgId)
                .rating(this.rating)
                .title(this.title)
                .body(this.body)
                .engagementType(this.engagementType)
                .createdAt(this.createdAt)
                .updatedAt(this.updatedAt)
                .build();
    }

    public static ReviewEntity fromDm(ReviewDm dm) {
        return ReviewEntity.builder()
                .id(dm.getId())
                .reviewerId(dm.getReviewerId())
                .reviewedOrgId(dm.getReviewedOrgId())
                .rating(dm.getRating())
                .title(dm.getTitle())
                .body(dm.getBody())
                .engagementType(dm.getEngagementType())
                .build();
    }
}
