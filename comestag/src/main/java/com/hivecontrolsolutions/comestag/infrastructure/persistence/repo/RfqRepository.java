package com.hivecontrolsolutions.comestag.infrastructure.persistence.repo;

import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.RfqEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RfqRepository extends JpaRepository<RfqEntity, UUID> {
    
    Page<RfqEntity> findByOrganizationId(UUID organizationId, Pageable pageable);
    
    Page<RfqEntity> findByStatus(RfqEntity.RfqStatus status, Pageable pageable);
    
    // For PUBLIC RFQs or RFQs owned by the organization
    @Query("SELECT r FROM RfqEntity r WHERE r.status = 'OPEN' " +
           "AND (r.visibility = 'PUBLIC' OR r.organizationId = :organizationId)")
    Page<RfqEntity> findAvailableRfqs(@Param("organizationId") UUID organizationId, Pageable pageable);
    
    // Find RFQs where organization is invited (requires join with rfq_invited_organizations)
    @Query(value = "SELECT r.* FROM rfqs r " +
           "INNER JOIN rfq_invited_organizations rio ON r.id = rio.rfq_id " +
           "WHERE r.status = 'OPEN' AND rio.organization_id = :organizationId",
           nativeQuery = true)
    Page<RfqEntity> findInvitedRfqs(@Param("organizationId") UUID organizationId, Pageable pageable);
    
    @Query("SELECT r FROM RfqEntity r WHERE r.industryId = :industryId")
    Page<RfqEntity> findByIndustryId(@Param("industryId") Long industryId, Pageable pageable);
    
    List<RfqEntity> findByAwardedToId(UUID awardedToId);
    
    @Query("SELECT COUNT(r) FROM RfqEntity r WHERE r.organizationId = :organizationId")
    long countByOrganizationId(@Param("organizationId") UUID organizationId);
}

