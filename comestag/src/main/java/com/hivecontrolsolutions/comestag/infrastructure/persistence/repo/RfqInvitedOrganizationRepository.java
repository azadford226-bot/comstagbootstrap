package com.hivecontrolsolutions.comestag.infrastructure.persistence.repo;

import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.RfqInvitedOrganizationEntity;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.RfqInvitedOrganizationId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface RfqInvitedOrganizationRepository extends JpaRepository<RfqInvitedOrganizationEntity, RfqInvitedOrganizationId> {
    
    List<RfqInvitedOrganizationEntity> findByRfqId(UUID rfqId);
    
    void deleteByRfqId(UUID rfqId);
}


