package com.hivecontrolsolutions.comestag.infrastructure.persistence.repo;

import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.SuccessStoryEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface SuccessStoryRepository extends JpaRepository<SuccessStoryEntity, UUID> {

    @Modifying
    @Query("""
           DELETE FROM SuccessStoryEntity s
           WHERE s.id = :id
             AND s.orgId = :orgId
           """)
    void deleteByIdAndOrgId(@Param("id") UUID id,
                            @Param("orgId") UUID orgId);
    Optional<SuccessStoryEntity> findByIdAndOrgId(UUID id, UUID orgId);

    @Modifying
    @Query("""
           UPDATE SuccessStoryEntity s
           SET s.title = :title,
               s.body  = :body
           WHERE s.id = :id
           """)
    int updateTitleAndBodyById(@Param("id") UUID id,
                               @Param("title") String title,
                               @Param("body") String body);

    Page<SuccessStoryEntity> findByOrgId(UUID orgId, Pageable pageable);
}

