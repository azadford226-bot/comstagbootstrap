package com.hivecontrolsolutions.comestag.infrastructure.persistence.spec;

import com.hivecontrolsolutions.comestag.core.domain.model.TestimonialFilter;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.TestimonialEntity;
import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public final class TestimonialSpecifications {

    private TestimonialSpecifications() {
    }

    public static Specification<TestimonialEntity> byOrganizationWithFilter(
            UUID orgId,
            TestimonialFilter filter
    ) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // required condition: org id
            predicates.add(cb.equal(root.get("organizationId"), orgId));

            if (filter != null) {
                if (filter.getMinRating() != null) {
                    predicates.add(cb.greaterThanOrEqualTo(
                            root.get("rating"),
                            filter.getMinRating().shortValue()
                    ));
                }

                if (filter.getMaxRating() != null) {
                    predicates.add(cb.lessThanOrEqualTo(
                            root.get("rating"),
                            filter.getMaxRating().shortValue()
                    ));
                }

                if (filter.getCreatedFrom() != null) {
                    predicates.add(cb.greaterThanOrEqualTo(
                            root.get("createdAt"),
                            filter.getCreatedFrom()
                    ));
                }

                if (filter.getCreatedTo() != null) {
                    predicates.add(cb.lessThanOrEqualTo(
                            root.get("createdAt"),
                            filter.getCreatedTo()
                    ));
                }
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
