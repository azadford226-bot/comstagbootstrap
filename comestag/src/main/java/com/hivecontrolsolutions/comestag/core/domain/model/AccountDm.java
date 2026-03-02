package com.hivecontrolsolutions.comestag.core.domain.model;

import com.hivecontrolsolutions.comestag.core.domain.model.enums.AccountStatus;
import com.hivecontrolsolutions.comestag.core.domain.model.enums.AccountType;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@Builder
public class AccountDm {
    private UUID id;
    private String displayName;
    private AccountType type;
    private String email;
    @Setter(AccessLevel.NONE)
    private String passwordHash;
    private AccountStatus status;
    private Boolean emailVerified;
    private Instant createdAt;
    private Instant updatedAt;

    // Business rules can live here:
    public boolean isActive() {
        return status == AccountStatus.ACTIVE;
    }

    public boolean isPending() {
        return status == AccountStatus.PENDING;
    }

    public boolean isLocked() {
        return status == AccountStatus.LOCKED;
    }

    public void lock() {
        this.status = AccountStatus.LOCKED;
    }

    public void activate() {
        this.status = AccountStatus.ACTIVE;
    }

    public void verifyEmail() {
        this.emailVerified = true;
    }

    public void updatePasswordHash(String passwordHash) {

        this.passwordHash = passwordHash != null ? passwordHash : this.passwordHash;
    }

}