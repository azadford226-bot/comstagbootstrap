package com.hivecontrolsolutions.comestag.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name="notification_recipients")
@IdClass(NotificationRecipientId.class)
@Getter
@Setter
public class NotificationRecipientEntity {

    @Id
    @Column(name="notification_id")
    private UUID notificationId;

    @Id
    @Column(name="recipient_account_id")
    private UUID recipientAccountId;

    private String dedupeKey;
    private Instant readAt;
    private Instant createdAt;
}
