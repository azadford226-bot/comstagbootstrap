package com.hivecontrolsolutions.comestag.infrastructure.persistence.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "rfq_comments")
@Getter
@Setter
@NoArgsConstructor
public class RfqCommentEntity {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(name = "rfq_id", nullable = false)
    private UUID rfqId;

    @Column(name = "account_id", nullable = false)
    private UUID accountId;

    @Column(nullable = false)
    private String body;

    @Column(name = "created_at", nullable = false, insertable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false, insertable = false)
    private Instant updatedAt;
}