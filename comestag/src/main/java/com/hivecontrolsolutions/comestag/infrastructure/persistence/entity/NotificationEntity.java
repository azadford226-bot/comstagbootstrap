package com.hivecontrolsolutions.comestag.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Entity
@Table(name = "notifications")
@Getter
@Setter
public class NotificationEntity {
    @Id
    @GeneratedValue
    private UUID id;

    private String type;

    @Column(name = "actor_account_id")
    private UUID actorAccountId;

    @Column(name = "target_kind")
    private String targetKind;

    @Column(name = "target_id")
    private UUID targetId;

    @JdbcTypeCode(org.hibernate.type.SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> payload = new HashMap<>();

    private Instant createdAt;
    private Instant updatedAt;
}
