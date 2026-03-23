package com.hivecontrolsolutions.comestag.infrastructure.persistence.entity;

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
@Table(name = "opportunity_interests", uniqueConstraints = @UniqueConstraint(columnNames = {"opportunity_id", "account_id"}))
public class OpportunityInterestEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "opportunity_id", nullable = false)
    private UUID opportunityId;

    @Column(name = "account_id", nullable = false)
    private UUID accountId;

    @Setter(AccessLevel.NONE)
    @Column(name = "created_at", updatable = false, insertable = false)
    @Generated
    private Instant createdAt;
}
