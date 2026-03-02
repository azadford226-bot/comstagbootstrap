package com.hivecontrolsolutions.comestag.infrastructure.persistence.repo;

import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.RefreshTokenEntity;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.UUID;

public interface RefreshTokenRepo extends CrudRepository<RefreshTokenEntity, UUID> {

    @Modifying
    @Query("UPDATE RefreshTokenEntity rte SET rte.valid=false WHERE rte.userId=:userId AND rte.valid IS TRUE")
    void invalidateTokenByUserId(UUID userId);
    @Modifying
    @Query("UPDATE RefreshTokenEntity rte SET rte.valid=false WHERE rte.tokenId=:tokenId AND rte.valid IS TRUE")
    void invalidateTokenByTokenId(UUID tokenId);
}
