package com.hivecontrolsolutions.comestag.infrastructure.persistence.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "notification_settings")
public class NotificationSettingsEntity {

    @Id
    @Column(name = "account_id")
    private UUID accountId;

    @Column(name = "in_app_enabled")
    private boolean inAppEnabled = true;

    @Column(name = "email_enabled")
    private boolean emailEnabled = false;

    @Column(name = "sms_enabled")
    private boolean smsEnabled = false;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> preferences = new HashMap<>();

    private Instant createdAt;
    private Instant updatedAt;
}