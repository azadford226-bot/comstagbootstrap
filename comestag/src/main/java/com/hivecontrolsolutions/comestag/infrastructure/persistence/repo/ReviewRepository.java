package com.hivecontrolsolutions.comestag.infrastructure.persistence.repo;

import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.ReviewEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ReviewRepository extends JpaRepository<ReviewEntity, UUID> {
    List<ReviewEntity> findByReviewedOrgIdOrderByCreatedAtDesc(UUID reviewedOrgId);
    boolean existsByReviewerIdAndReviewedOrgId(UUID reviewerId, UUID reviewedOrgId);
    void deleteByReviewerIdAndReviewedOrgId(UUID reviewerId, UUID reviewedOrgId);
    long countByReviewedOrgId(UUID reviewedOrgId);

    @Query("SELECT COALESCE(AVG(r.rating), 0) FROM ReviewEntity r WHERE r.reviewedOrgId = :orgId")
    double averageRatingByReviewedOrgId(UUID orgId);
}
