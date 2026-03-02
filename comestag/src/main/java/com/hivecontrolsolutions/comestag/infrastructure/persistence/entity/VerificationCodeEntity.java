package com.hivecontrolsolutions.comestag.infrastructure.persistence.entity;

import com.hivecontrolsolutions.comestag.core.domain.model.VerificationCodeDm;
import com.hivecontrolsolutions.comestag.core.domain.model.enums.NotificationChannel;
import com.hivecontrolsolutions.comestag.core.domain.model.enums.Status;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.UUID;

import static com.hivecontrolsolutions.comestag.core.domain.model.enums.NotificationChannel.EMAIL;
import static com.hivecontrolsolutions.comestag.core.domain.model.enums.Status.PENDING;

@Setter
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "verification_code")
public class VerificationCodeEntity {
    @Id
    @GeneratedValue
    @Setter(AccessLevel.NONE)   // No setter.Will be handled from db side.
    @Column(name = "id", nullable = false, updatable = false)
    private UUID id;

    @Column(name = "user_id")
    private UUID userId; // keep simple; you can map to a UserEntity if you want

    @Enumerated(EnumType.STRING)
    @Column(name = "channel")
    private NotificationChannel notificationChannel;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private Status status;

    @Column(name = "code_hash", nullable = false)
    private String codeHash;

    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    @Column(name = "attempt_count")
    private int attemptCount;

    @Column(name = "resend_count")
    private int resendCount;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @PrePersist
    public void prePersist() {
        Instant now = Instant.now();
        if (createdAt == null) createdAt = now;
        if (updatedAt == null) updatedAt = now;
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = Instant.now();
    }

    public VerificationCodeDm toDm() {
        return VerificationCodeDm.builder()
                .id(id)
                .userId(userId)
                .notificationChannel(notificationChannel)
                .status(status)
                .codeHash(codeHash)
                .expiresAt(expiresAt)
                .attemptCount(attemptCount)
                .resendCount(resendCount)
                .createdAt(createdAt)
                .updatedAt(updatedAt)
                .build();
    }

    public static VerificationCodeEntity fromDm(VerificationCodeDm dm) {
        return VerificationCodeEntity.builder()
                .id(dm.getId())
                .userId(dm.getUserId())
                .notificationChannel(dm.getNotificationChannel() == null ? EMAIL : dm.getNotificationChannel())
                .status(dm.getStatus() == null ? PENDING : dm.getStatus())
                .codeHash(dm.getCodeHash())
                .expiresAt(dm.getExpiresAt())
                .attemptCount(dm.getAttemptCount())
                .resendCount(dm.getResendCount())
                .createdAt(dm.getCreatedAt())
                .updatedAt(dm.getUpdatedAt())
                .build();
    }
}