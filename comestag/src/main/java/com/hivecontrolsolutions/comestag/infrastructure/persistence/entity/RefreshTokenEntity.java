package com.hivecontrolsolutions.comestag.infrastructure.persistence.entity;

import com.hivecontrolsolutions.comestag.core.domain.model.RefreshTokenDm;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "refresh_token")
public class RefreshTokenEntity {

    @Id
    private UUID tokenId;
    @Column
    private UUID userId;
    @Column(nullable = false, unique = true)
    private String refreshToken;
    @Column(nullable = false)
    private Instant expiryDate;

    @Setter(AccessLevel.NONE)
    @Column(name = "createdDate", updatable = false, insertable = false)
    private Instant createdAt;
    @Column
    private boolean valid;

    public static RefreshTokenEntity fromDm(RefreshTokenDm refreshTokenDm) {
        return RefreshTokenEntity.builder()
                .tokenId(refreshTokenDm.getTokenId())
                .userId(refreshTokenDm.getUserId())
                .refreshToken(refreshTokenDm.getRefreshToken())
                .expiryDate(refreshTokenDm.getExpiryDate())
                .valid(refreshTokenDm.isValid())
                .build();
    }

    public RefreshTokenDm toDm() {
        return RefreshTokenDm.builder()
                .tokenId(tokenId)
                .userId(userId)
                .refreshToken(refreshToken)
                .expiryDate(expiryDate).createdAt(createdAt)
                .valid(valid)
                .build();
    }
}
