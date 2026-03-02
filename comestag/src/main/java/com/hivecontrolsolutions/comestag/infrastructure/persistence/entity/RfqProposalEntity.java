package com.hivecontrolsolutions.comestag.infrastructure.persistence.entity;

import com.hivecontrolsolutions.comestag.core.domain.model.RfqProposalDm;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "rfq_proposals",
    uniqueConstraints = @UniqueConstraint(columnNames = {"rfq_id", "organization_id"}))
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RfqProposalEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(name = "rfq_id", nullable = false)
    private UUID rfqId;
    
    @Column(name = "organization_id", nullable = false)
    private UUID organizationId;
    
    @Column(name = "proposal_text", columnDefinition = "TEXT", nullable = false)
    private String proposalText;
    
    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal price;
    
    @Column(nullable = false, length = 3)
    @Builder.Default
    private String currency = "USD";
    
    @Column(name = "delivery_time")
    private String deliveryTime;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    @Builder.Default
    private ProposalStatus status = ProposalStatus.SUBMITTED;
    
    @Column(name = "submitted_at", nullable = false, updatable = false)
    @Builder.Default
    private Instant submittedAt = Instant.now();
    
    @Column(name = "updated_at", nullable = false)
    @Builder.Default
    private Instant updatedAt = Instant.now();
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = Instant.now();
    }
    
    public RfqProposalDm toDm() {
        return RfqProposalDm.builder()
                .id(this.id)
                .rfqId(this.rfqId)
                .organizationId(this.organizationId)
                .proposalText(this.proposalText)
                .price(this.price)
                .currency(this.currency)
                .deliveryTime(this.deliveryTime)
                .status(RfqProposalDm.ProposalStatus.valueOf(this.status.name()))
                .submittedAt(this.submittedAt)
                .updatedAt(this.updatedAt)
                .build();
    }
    
    public enum ProposalStatus {
        SUBMITTED, SHORTLISTED, ACCEPTED, REJECTED
    }
}

