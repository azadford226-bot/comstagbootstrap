package com.hivecontrolsolutions.comestag.infrastructure.persistence.repo;

import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.OpportunityEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface OpportunityRepository extends JpaRepository<OpportunityEntity, UUID> {
    Page<OpportunityEntity> findByStatusOrderByCreatedAtDesc(String status, Pageable pageable);
    Page<OpportunityEntity> findByTypeAndStatusOrderByCreatedAtDesc(String type, String status, Pageable pageable);
    Page<OpportunityEntity> findAllByOrderByCreatedAtDesc(Pageable pageable);
    Page<OpportunityEntity> findByTypeOrderByCreatedAtDesc(String type, Pageable pageable);
}
