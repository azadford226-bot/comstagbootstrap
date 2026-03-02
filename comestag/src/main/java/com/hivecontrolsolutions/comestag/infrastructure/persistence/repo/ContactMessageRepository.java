package com.hivecontrolsolutions.comestag.infrastructure.persistence.repo;

import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.ContactMessageEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface ContactMessageRepository extends JpaRepository<ContactMessageEntity, UUID> {
    
    Page<ContactMessageEntity> findAllByOrderByCreatedAtDesc(Pageable pageable);
    
    Page<ContactMessageEntity> findByReadOrderByCreatedAtDesc(boolean read, Pageable pageable);
    
    @Modifying
    @Query("UPDATE ContactMessageEntity c SET c.read = true WHERE c.id = :id")
    void markAsRead(@Param("id") UUID id);
    
    long countByRead(boolean read);
}
