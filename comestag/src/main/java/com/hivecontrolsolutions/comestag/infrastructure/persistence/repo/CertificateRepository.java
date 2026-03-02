package com.hivecontrolsolutions.comestag.infrastructure.persistence.repo;

import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.CertificateEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

public interface CertificateRepository extends JpaRepository<CertificateEntity, UUID> {

    @Modifying
    @Query("""
            DELETE FROM CertificateEntity c
            WHERE c.id = :id
              AND c.orgId = :orgId
            """)
    void deleteByIdAndOrgId(@Param("id") UUID id,
                            @Param("orgId") UUID orgId);

    Optional<CertificateEntity> findByIdAndOrgId(UUID id, UUID orgId);

    @Modifying
    @Query("""
            UPDATE CertificateEntity c
            SET c.title = :title,
                c.body  = :body,
                c.link  = :link,
                c.certificateDate = :certificateDate,
                c.imageId = COALESCE(:imageId, c.imageId)
            WHERE c.id = :id
            """)
    int updateCertificate(@Param("id") UUID id,
                          @Param("title") String title,
                          @Param("body") String body,
                          @Param("link") String link,
                          @Param("certificateDate") LocalDate certificateDate,
                          @Param("imageId") UUID imageId);

    Page<CertificateEntity> findByOrgId(UUID orgId, Pageable pageable);
}