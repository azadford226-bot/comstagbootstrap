package com.hivecontrolsolutions.comestag.infrastructure.persistence.repo;

import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.SuccessStoryMediaEntity;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.SuccessStoryMediaId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Set;
import java.util.UUID;

@Repository
public interface SuccessStoryMediaRepository extends JpaRepository<SuccessStoryMediaEntity, SuccessStoryMediaId> {

    @Modifying
    @Query("""
            DELETE FROM SuccessStoryMediaEntity s
            WHERE s.id.successStoryId = :successStoryId
              AND s.id.mediaId IN :mediaIds
            """)
    int deleteBySuccessStoryIdAndMediaIdIn(@Param("successStoryId") UUID successStoryId,
                                           @Param("mediaIds") Set<UUID> mediaIds);

}
