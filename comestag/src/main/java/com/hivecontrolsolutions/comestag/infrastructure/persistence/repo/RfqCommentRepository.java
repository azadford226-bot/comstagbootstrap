package com.hivecontrolsolutions.comestag.infrastructure.persistence.repo;

import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.RfqCommentEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface RfqCommentRepository extends JpaRepository<RfqCommentEntity, UUID> {
    Page<RfqCommentEntity> findByRfqIdOrderByCreatedAtAsc(UUID rfqId, Pageable pageable);
}