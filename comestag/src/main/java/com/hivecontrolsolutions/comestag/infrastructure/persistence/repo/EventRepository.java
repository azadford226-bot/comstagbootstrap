package com.hivecontrolsolutions.comestag.infrastructure.persistence.repo;

import com.hivecontrolsolutions.comestag.core.domain.model.enums.EventMode;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.EventEntity;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.IndustryEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.OffsetDateTime;
import java.util.Optional;
import java.util.UUID;

public interface EventRepository extends JpaRepository<EventEntity, UUID> {

    // --------------------------------------------------------------------
    // DELETE BY ID + ORG
    // --------------------------------------------------------------------
    @Modifying
    @Query("""
            DELETE FROM EventEntity e
            WHERE e.id = :id
              AND e.orgId = :orgId
            """)
    void deleteByIdAndOrgId(@Param("id") UUID id,
                            @Param("orgId") UUID orgId);

    Optional<EventEntity> findByIdAndOrgId(UUID id, UUID orgId);

    // --------------------------------------------------------------------
    // FULL UPDATE (title, body, industry, location, dates, mode, link)
    // --------------------------------------------------------------------
    @Modifying
    @Query("""
            UPDATE EventEntity e
            SET e.title      = :title,
                e.body       = :body,
                e.industry   = :industry,
                e.country    = :country,
                e.state      = :state,
                e.city       = :city,
                e.address    = :address,
                e.startAt    = :startAt,
                e.endAt      = :endAt,
                e.mode       = :mode,
                e.onlineLink = :onlineLink
            WHERE e.id = :id
            """)
    int updateEvent(@Param("id") UUID id,
                    @Param("title") String title,
                    @Param("body") String body,
                    @Param("industry") IndustryEntity industry,
                    @Param("country") String country,
                    @Param("state") String state,
                    @Param("city") String city,
                    @Param("address") String address,
                    @Param("startAt") OffsetDateTime startAt,
                    @Param("endAt") OffsetDateTime endAt,
                    @Param("mode") EventMode mode,
                    @Param("onlineLink") String onlineLink);

    // --------------------------------------------------------------------
    // UPDATE INDUSTRY ONLY (by industryId)
    // --------------------------------------------------------------------
    // Option 1: Native query on the FK column
    @Modifying
    @Query(value = """
            UPDATE events
            SET industry_id = :industryId
            WHERE id = :id
            """, nativeQuery = true)
    int updateIndustryById(@Param("id") UUID id,
                           @Param("industryId") Long industryId);

    // (Alternative Option 2, if you prefer JPQL and have IndustryEntity in service:
    // @Modifying
    // @Query("""
    //         UPDATE EventEntity e
    //         SET e.industry = :industry
    //         WHERE e.id = :id
    //         """)
    // int updateIndustry(@Param("id") UUID id,
    //                    @Param("industry") IndustryEntity industry);
    // )

    // --------------------------------------------------------------------
    // VIEWERS COUNTER
    // --------------------------------------------------------------------
    @Modifying
    @Query("""
            UPDATE EventEntity e
            SET e.viewers = e.viewers + 1
            WHERE e.id = :id
            """)
    void incrementViewers(@Param("id") UUID id);

    // --------------------------------------------------------------------
    // FIND EVENTS BY ORG
    // --------------------------------------------------------------------
    Page<EventEntity> findByOrgId(UUID orgId, Pageable pageable);

    // --------------------------------------------------------------------
    // SEARCH BY LOCATION + INDUSTRY
    // --------------------------------------------------------------------
    @Query("""
            SELECT e
            FROM EventEntity e
            WHERE (:country    IS NULL OR e.country      = :country)
              AND (:state      IS NULL OR e.state        = :state)
              AND (:city       IS NULL OR e.city         = :city)
              AND (:industryId IS NULL OR e.industry.id  = :industryId)
            ORDER BY e.startAt DESC, e.createdAt DESC
            """)
    Page<EventEntity> searchByLocationAndIndustry(@Param("country") String country,
                                                  @Param("state") String state,
                                                  @Param("city") String city,
                                                  @Param("industryId") Long industryId,
                                                  Pageable pageable);

    // --------------------------------------------------------------------
    // FIND EVENTS USER IS REGISTERED IN
    // --------------------------------------------------------------------
    @Query("""
            SELECT e
            FROM EventEntity e
            JOIN EventRegistrationEntity r ON r.eventId = e.id
            WHERE r.accountId = :accountId
              AND r.status = com.hivecontrolsolutions.comestag.core.domain.model.enums.EventRegistrationStatus.REGISTERED
            ORDER BY e.startAt DESC, e.createdAt DESC
            """)
    Page<EventEntity> findRegisteredEvents(@Param("accountId") UUID accountId,
                                           Pageable pageable);
}
