package com.hivecontrolsolutions.comestag.infrastructure.persistence.repo;

import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.OrganizationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface OrganizationRepository extends JpaRepository<OrganizationEntity, UUID> {

    @Modifying
    @Query("UPDATE OrganizationEntity entity SET entity.profileImageId=:mediaId WHERE entity.id=:userId")
    void updateProfileImage(UUID userId, UUID mediaId);

    @Modifying
    @Query("UPDATE OrganizationEntity entity SET entity.profileCoverId=:mediaId WHERE entity.id=:userId")
    void updateProfileCover(UUID userId, UUID mediaId);

    @Modifying
    @Query("""
            UPDATE OrganizationEntity v
            SET v.views = v.views + 1
            WHERE v.id = :id
            """)
    void incrementViews(@Param("id") UUID id);
    
    @Modifying
    @Query("UPDATE OrganizationEntity o SET o.approved = true WHERE o.id = :id")
    void approve(@Param("id") UUID id);
    
    long countByApproved(boolean approved);
    
    @Query("SELECT o FROM OrganizationEntity o WHERE o.approved = false ORDER BY o.createdAt DESC")
    org.springframework.data.domain.Page<OrganizationEntity> findPending(org.springframework.data.domain.Pageable pageable);

}