package com.hivecontrolsolutions.comestag.core.domain.port;

import com.hivecontrolsolutions.comestag.core.domain.model.RefreshTokenDm;

import java.util.UUID;

public interface RefreshTokenPort {
    void invalidateByUserId(UUID userId);

    void invalidateByTokenId(UUID tokenId);

    RefreshTokenDm getById(UUID tokenId);

    void save(RefreshTokenDm refreshTokenDm);
}
