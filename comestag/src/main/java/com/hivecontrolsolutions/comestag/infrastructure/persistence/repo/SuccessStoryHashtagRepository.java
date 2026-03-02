package com.hivecontrolsolutions.comestag.infrastructure.persistence.repo;

import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.SuccessStoryHashtagEntity;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.SuccessStoryHashtagId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Set;
import java.util.UUID;

public interface SuccessStoryHashtagRepository
        extends JpaRepository<SuccessStoryHashtagEntity, SuccessStoryHashtagId> {

    @Modifying
    @Query("""
            DELETE FROM SuccessStoryHashtagEntity s
            WHERE s.id.successStoryId = :successStoryId
              AND s.id.hashtagId IN :hashtagIds
            """)
    int deleteBySuccessStoryIdAndHashtagIdIn(@Param("successStoryId") UUID successStoryId,
                                             @Param("hashtagIds") Set<Long> hashtagIds);
}

