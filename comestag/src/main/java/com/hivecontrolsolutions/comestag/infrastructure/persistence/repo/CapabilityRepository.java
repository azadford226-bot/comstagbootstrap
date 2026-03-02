package com.hivecontrolsolutions.comestag.infrastructure.persistence.repo;

import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.CapabilityEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface CapabilityRepository extends JpaRepository<CapabilityEntity, UUID> {

    @Modifying
    @Query("""
           DELETE FROM CapabilityEntity c
           WHERE c.id = :id
             AND c.orgId = :orgId
           """)
    void deleteByIdAndOrgId(@Param("id") UUID id,
                            @Param("orgId") UUID orgId);

    Optional<CapabilityEntity> findByIdAndOrgId(UUID id, UUID orgId);

    @Modifying
    @Query("""
           UPDATE CapabilityEntity c
           SET c.title = :title,
               c.body = :body
           WHERE c.id = :id
           """)
    int updateTitleAndBodyById(@Param("id") UUID id,
                               @Param("title") String title,
                               @Param("body") String body);

    Page<CapabilityEntity> findByOrgId(UUID orgId, Pageable pageable);
}