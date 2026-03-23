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
@Table(name = "notification_preferences")
public class NotificationPreferenceEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "account_id", nullable = false, unique = true)
    private UUID accountId;

    @Column(name = "email_digest", nullable = false)
    private String emailDigest;

    @Column(name = "in_app_enabled", nullable = false)
    private boolean inAppEnabled;

    @Column(name = "push_enabled", nullable = false)
    private boolean pushEnabled;

    @Column(name = "rfq_alerts", nullable = false)
    private boolean rfqAlerts;

    @Column(name = "message_alerts", nullable = false)
    private boolean messageAlerts;

    @Column(name = "opportunity_alerts", nullable = false)
    private boolean opportunityAlerts;

    @Column(name = "system_alerts", nullable = false)
    private boolean systemAlerts;

    @Setter(AccessLevel.NONE)
    @Column(name = "created_at", updatable = false, insertable = false)
    @Generated
    private Instant createdAt;

    @Setter(AccessLevel.NONE)
    @Column(name = "updated_at", insertable = false)
    @Generated
    private Instant updatedAt;
}
