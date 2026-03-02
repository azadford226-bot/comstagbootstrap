package com.hivecontrolsolutions.comestag.core.domain.model;

import com.hivecontrolsolutions.comestag.core.domain.model.enums.NotificationChannel;
import com.hivecontrolsolutions.comestag.core.domain.model.enums.Status;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@Builder
public class VerificationCodeDm {
    private UUID id;
    private UUID userId;
    private NotificationChannel notificationChannel;
    private Status status;
    private String codeHash;
    private Instant expiresAt;
    private int attemptCount;
    private int resendCount;
    private Instant createdAt;
    private Instant updatedAt;

    public boolean verify(String candidateHash, Instant now) {
        if (id == null || isLocked(now) || isExpired(now) || isVerified()) {
            return false;
        }

        attemptCount++;

        if (!codeHash.equals(candidateHash)) {
            if (attemptCount >= 5) {
                markLocked();
            }
            return false;
        }

        markVerified();
        return true;
    }

    public boolean codeRenew(String newHash, Instant now) {
        if (resendCount >= 5) {
            markLocked();
            return false;
        }
        if (expiresAt != null && now.isBefore(expiresAt)) {
            resendCount++;
        }
        this.codeHash = newHash;
        this.expiresAt = now.plusSeconds(600);
        markPending();
        return true;
    }

    public boolean codeResend(String newHash, Instant now) {
        if (resendCount >= 5) {
            markLocked();
            return false;
        }
        this.codeHash = newHash;
        this.expiresAt = now.plusSeconds(300);
        this.resendCount++;
        return true;
    }

    public boolean isLocked(Instant now) {
        if (expiresAt != null && now.isAfter(expiresAt.plusSeconds(3600))) {
            resetAfterLockWindow(); // or remove if you don't want auto-unlock
        }
        return this.status == Status.LOCKED;
    }

    public boolean isExpired(Instant now) {
        if (expiresAt == null) {
            return false;
        }
        boolean result = now.isAfter(expiresAt);
        if (result) {
            markExpired();
        }
        return result;
    }

    private boolean isVerified() {
        return this.status == Status.VERIFIED;
    }

    private void markVerified() {
        this.status = Status.VERIFIED;
        this.attemptCount = 0;
        this.resendCount = 0;
    }

    private void markExpired() {
        this.status = Status.EXPIRED;
    }

    private void markLocked() {
        this.status = Status.LOCKED;
    }

    private void markPending() {
        this.status = Status.PENDING;
    }

    private void resetAfterLockWindow() {
        this.status = Status.EXPIRED; // or PENDING
        this.attemptCount = 0;
        this.resendCount = 0;
    }
}
