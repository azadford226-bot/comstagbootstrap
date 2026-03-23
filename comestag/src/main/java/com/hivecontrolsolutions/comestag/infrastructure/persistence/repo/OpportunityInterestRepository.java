package com.hivecontrolsolutions.comestag.infrastructure.persistence.repo;

import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.OpportunityInterestEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface OpportunityInterestRepository extends JpaRepository<OpportunityInterestEntity, UUID> {
    boolean existsByOpportunityIdAndAccountId(UUID opportunityId, UUID accountId);
    void deleteByOpportunityIdAndAccountId(UUID opportunityId, UUID accountId);
    long countByOpportunityId(UUID opportunityId);
}
