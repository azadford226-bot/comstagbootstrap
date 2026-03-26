package com.hivecontrolsolutions.comestag.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "domain_verifications")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DomainVerificationEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "org_id", nullable = false)
    private UUID orgId;

    @Column(name = "domain", nullable = false)
    private String domain;

    @Column(name = "verification_token", nullable = false)
    private String verificationToken;

    @Column(name = "verification_method", length = 50)
    @Builder.Default
    private String verificationMethod = "DNS_TXT";

    @Column(name = "verified")
    @Builder.Default
    private boolean verified = false;

    @Column(name = "verified_at")
    private Instant verifiedAt;

    @Column(name = "created_at", insertable = false, updatable = false)
    private Instant createdAt;
}
