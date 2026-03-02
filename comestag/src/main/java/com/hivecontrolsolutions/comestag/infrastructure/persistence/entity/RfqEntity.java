package com.hivecontrolsolutions.comestag.infrastructure.persistence.entity;

import com.hivecontrolsolutions.comestag.core.domain.model.RfqDm;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Entity
@Table(name = "rfqs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RfqEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(name = "organization_id", nullable = false)
    private UUID organizationId;
    
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;
    
    private String category;
    
    @Column(name = "industry_id")
    private Long industryId;
    
    @Column(precision = 15, scale = 2)
    private BigDecimal budget;
    
    @Column(name = "budget_currency", length = 3)
    @Builder.Default
    private String budgetCurrency = "USD";
    
    @Column(name = "deadline")
    private Instant deadline;
    
    @Column(columnDefinition = "TEXT")
    private String requirements;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    @Builder.Default
    private RfqStatus status = RfqStatus.OPEN;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    @Builder.Default
    private RfqVisibility visibility = RfqVisibility.PUBLIC;
    
    @Column(name = "awarded_to_id")
    private UUID awardedToId;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private Instant createdAt = Instant.now();
    
    @Column(name = "updated_at", nullable = false)
    @Builder.Default
    private Instant updatedAt = Instant.now();
    
    @OneToMany(mappedBy = "rfqId", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<RfqProposalEntity> proposals;
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = Instant.now();
    }
    
    public RfqDm toDm() {
        return RfqDm.builder()
                .id(this.id)
                .organizationId(this.organizationId)
                .title(this.title)
                .description(this.description)
                .category(this.category)
                .industryId(this.industryId)
                .budget(this.budget)
                .budgetCurrency(this.budgetCurrency)
                .deadline(this.deadline)
                .requirements(this.requirements)
                .status(RfqDm.RfqStatus.valueOf(this.status.name()))
                .visibility(RfqDm.RfqVisibility.valueOf(this.visibility.name()))
                .awardedToId(this.awardedToId)
                .createdAt(this.createdAt)
                .updatedAt(this.updatedAt)
                .invitedOrganizationIds(Collections.emptyList()) // Will be loaded separately if needed
                .mediaIds(Collections.emptyList()) // Will be loaded separately if needed
                .build();
    }
    
    public enum RfqStatus {
        OPEN, CLOSED, AWARDED, CANCELLED
    }
    
    public enum RfqVisibility {
        PUBLIC, INVITE_ONLY, PRIVATE
    }
}

