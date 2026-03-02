package com.hivecontrolsolutions.comestag.infrastructure.persistence.repo;

import com.hivecontrolsolutions.comestag.core.domain.model.TestimonialDm;
import com.hivecontrolsolutions.comestag.core.domain.model.TestimonialFilter;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.TestimonialEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface TestimonialRepository extends JpaRepository<TestimonialEntity, UUID> , JpaSpecificationExecutor<TestimonialEntity> {

    @Modifying
    @Query("UPDATE TestimonialEntity t SET t.rating = :rating, t.comment = :comment WHERE t.id = :id")
    void update(
            @Param("id") UUID id,
            @Param("rating") int rating,
            @Param("comment") String comment
    );

}
