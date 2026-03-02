package com.hivecontrolsolutions.comestag.infrastructure.persistence.repo;

import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.RfqMediaEntity;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.RfqMediaId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Set;
import java.util.UUID;

@Repository
public interface RfqMediaRepository extends JpaRepository<RfqMediaEntity, RfqMediaId> {
    
    @Modifying
    @Query("DELETE FROM RfqMediaEntity r WHERE r.id.rfqId = :rfqId AND r.id.mediaId IN :mediaIds")
    void deleteByRfqIdAndMediaIdIn(@Param("rfqId") UUID rfqId, @Param("mediaIds") Set<UUID> mediaIds);
}
