package com.hivecontrolsolutions.comestag.infrastructure.persistence.adapter;

import com.hivecontrolsolutions.comestag.core.domain.model.ReviewDm;
import com.hivecontrolsolutions.comestag.core.domain.port.ReviewPort;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.ReviewEntity;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.repo.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class ReviewAdapter implements ReviewPort {

    private final ReviewRepository repository;

    @Override
    public ReviewDm save(ReviewDm review) {
        ReviewEntity entity = ReviewEntity.fromDm(review);
        return repository.save(entity).toDm();
    }

    @Override
    public List<ReviewDm> findByReviewedOrgId(UUID orgId) {
        return repository.findByReviewedOrgIdOrderByCreatedAtDesc(orgId)
                .stream().map(ReviewEntity::toDm).toList();
    }

    @Override
    public double getAverageRating(UUID orgId) {
        return repository.averageRatingByReviewedOrgId(orgId);
    }

    @Override
    public long getReviewCount(UUID orgId) {
        return repository.countByReviewedOrgId(orgId);
    }

    @Override
    @Transactional
    public void delete(UUID reviewerId, UUID reviewedOrgId) {
        repository.deleteByReviewerIdAndReviewedOrgId(reviewerId, reviewedOrgId);
    }

    @Override
    public boolean exists(UUID reviewerId, UUID reviewedOrgId) {
        return repository.existsByReviewerIdAndReviewedOrgId(reviewerId, reviewedOrgId);
    }
}
