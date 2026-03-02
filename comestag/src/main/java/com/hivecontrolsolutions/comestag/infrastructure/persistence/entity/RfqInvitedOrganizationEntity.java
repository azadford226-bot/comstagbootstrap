package com.hivecontrolsolutions.comestag.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "rfq_invited_organizations")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@IdClass(RfqInvitedOrganizationId.class)
public class RfqInvitedOrganizationEntity {
    
    @Id
    @Column(name = "rfq_id", nullable = false)
    private UUID rfqId;
    
    @Id
    @Column(name = "organization_id", nullable = false)
    private UUID organizationId;
    
    @Column(name = "invited_at", nullable = false, updatable = false)
    @Builder.Default
    private Instant invitedAt = Instant.now();
}


