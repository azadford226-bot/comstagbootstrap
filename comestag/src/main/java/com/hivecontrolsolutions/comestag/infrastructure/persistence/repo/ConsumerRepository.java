package com.hivecontrolsolutions.comestag.infrastructure.persistence.repo;

import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.ConsumerEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface ConsumerRepository extends JpaRepository<ConsumerEntity, UUID> {

    @Modifying
    @Query("UPDATE ConsumerEntity entity SET entity.profileImageId=:mediaId WHERE entity.id=:userId")
    void updateProfileImage(UUID userId, UUID mediaId);

    @Modifying
    @Query("UPDATE ConsumerEntity entity SET entity.profileCoverId=:mediaId WHERE entity.id=:userId")
    void updateProfileCover(UUID userId, UUID mediaId);

    @Modifying
    @Query("""
            UPDATE ConsumerEntity c
            SET c.views = c.views + 1
            WHERE c.id = :id
            """)
    void incrementViews(@Param("id") UUID id);

}