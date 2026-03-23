package com.hivecontrolsolutions.comestag.core.domain.port;

import com.hivecontrolsolutions.comestag.core.domain.model.ReviewDm;

import java.util.List;
import java.util.UUID;

public interface ReviewPort {
    ReviewDm save(ReviewDm review);
    List<ReviewDm> findByReviewedOrgId(UUID orgId);
    double getAverageRating(UUID orgId);
    long getReviewCount(UUID orgId);
    void delete(UUID reviewerId, UUID reviewedOrgId);
    boolean exists(UUID reviewerId, UUID reviewedOrgId);
}
