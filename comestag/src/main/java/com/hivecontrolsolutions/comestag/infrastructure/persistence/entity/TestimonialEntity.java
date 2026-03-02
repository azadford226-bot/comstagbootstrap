package com.hivecontrolsolutions.comestag.infrastructure.persistence.entity;

import com.hivecontrolsolutions.comestag.core.domain.model.TestimonialDm;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Getter
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "testimonials")
public class TestimonialEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "organization_id", nullable = false)
    private UUID organizationId;

    @Column(name = "consumer_account_id", nullable = false)
    private UUID consumerId;

    @Column(name = "rating", nullable = false)
    @Min(1)
    @Max(5)
    @Setter
    private short rating;

    @Column(name = "consumer_name", length = 120)
    @Size(max = 120)
    private String consumerName;

    @Column(name = "comment", nullable = false)
    @Setter
    private String comment;

    @Column(name = "created_at", updatable = false, insertable = false)
    private Instant createdAt;

    @Column(name = "updated_at", insertable = false)
    private Instant updatedAt;


    public TestimonialDm toDm() {
        return TestimonialDm.builder()
                .id(this.id)
                .organizationId(this.organizationId)
                .consumerId(this.consumerId)
                .rating(this.rating)
                .consumerName(this.consumerName)
                .comment(this.comment)
                .createdAt(this.createdAt)
                .updatedAt(this.updatedAt)
                .build();
    }

    public static TestimonialEntity fromDm(TestimonialDm d) {
        return TestimonialEntity.builder()
                .id(d.getId())
                .organizationId(d.getOrganizationId())
                .consumerId(d.getConsumerId())
                .rating(d.getRating())
                .consumerName(d.getConsumerName())
                .comment(d.getComment())
                .createdAt(d.getCreatedAt())
                .updatedAt(d.getUpdatedAt())
                .build();
    }
}
