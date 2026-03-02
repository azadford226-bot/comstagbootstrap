package com.hivecontrolsolutions.comestag.core.domain.model;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@Builder
public class RefreshTokenDm {
    private UUID tokenId;
    private UUID userId;
    private String refreshToken;
    private Instant expiryDate;
    private Instant createdAt;
    private Boolean valid;

    public boolean isValid() {
        return valid && expiryDate.isAfter(Instant.now());
    }
}