package com.hivecontrolsolutions.comestag.infrastructure.persistence.adapter;

import com.hivecontrolsolutions.comestag.base.core.error.exception.BusinessException;
import com.hivecontrolsolutions.comestag.base.stereotype.Adapter;
import com.hivecontrolsolutions.comestag.core.domain.model.RefreshTokenDm;
import com.hivecontrolsolutions.comestag.core.domain.port.RefreshTokenPort;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.RefreshTokenEntity;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.repo.RefreshTokenRepo;
import lombok.RequiredArgsConstructor;

import java.util.UUID;

import static com.hivecontrolsolutions.comestag.base.core.error.entity.enums.InternalStatusError.TOKEN_INVALID;

@Adapter
@RequiredArgsConstructor
public class RefreshTokenAdapter implements RefreshTokenPort {
    private final RefreshTokenRepo refreshTokenRepo;

    @Override
    public void invalidateByUserId(UUID userId) {
        refreshTokenRepo.invalidateTokenByUserId(userId);
    }

    @Override
    public void invalidateByTokenId(UUID tokenId) {
        refreshTokenRepo.invalidateTokenByTokenId(tokenId);
    }

    @Override
    public RefreshTokenDm getById(UUID tokenId) {
        return refreshTokenRepo.findById(tokenId)
                .map(RefreshTokenEntity::toDm)
                .orElseThrow(() -> new BusinessException(TOKEN_INVALID, "Refresh token not found"));
    }

    @Override
    public void save(RefreshTokenDm refreshTokenDm) {
        refreshTokenRepo.save(RefreshTokenEntity.fromDm(refreshTokenDm));
    }
}
