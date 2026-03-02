package com.hivecontrolsolutions.comestag.infrastructure.persistence.repo;

import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.RfqProposalEntity;
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
public interface RfqProposalRepository extends JpaRepository<RfqProposalEntity, UUID> {
    
    List<RfqProposalEntity> findByRfqId(UUID rfqId);
    
    List<RfqProposalEntity> findByOrganizationId(UUID organizationId);
    
    Optional<RfqProposalEntity> findByRfqIdAndOrganizationId(UUID rfqId, UUID organizationId);
    
    @Query("SELECT COUNT(p) FROM RfqProposalEntity p WHERE p.rfqId = :rfqId")
    long countByRfqId(@Param("rfqId") UUID rfqId);
    
    @Query("SELECT COUNT(p) FROM RfqProposalEntity p WHERE p.rfqId = :rfqId AND p.status = :status")
    long countByRfqIdAndStatus(@Param("rfqId") UUID rfqId, @Param("status") RfqProposalEntity.ProposalStatus status);
    
    Page<RfqProposalEntity> findByRfqId(UUID rfqId, Pageable pageable);
    
    Page<RfqProposalEntity> findByOrganizationId(UUID organizationId, Pageable pageable);
}

