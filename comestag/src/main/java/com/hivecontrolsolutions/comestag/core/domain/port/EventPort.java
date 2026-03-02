package com.hivecontrolsolutions.comestag.core.domain.port;

import com.hivecontrolsolutions.comestag.core.domain.model.EventDm;
import org.springframework.data.domain.Page;

import java.time.OffsetDateTime;
import java.util.UUID;

public interface EventPort {

    EventDm getById(UUID id);

    EventDm getByOrgIdAndId(UUID orgId, UUID id);

    EventDm create(UUID orgAccountId,
                   String title,
                   String body,
                   Long industry,
                   String country,
                   String state,
                   String city,
                   String address,
                   OffsetDateTime startAt,
                   OffsetDateTime endAt,
                   String onlineLink,
                   boolean isOnline);

    int update(UUID eventId,
               String title,
               String body,
               Long industry,
               String country,
               String state,
               String city,
               String address,
               OffsetDateTime startAt,
               OffsetDateTime endAt,
               String onlineLink,
               Boolean isOnlineOrNull);

    void delete(UUID eventId, UUID orgAccountId);

    Page<EventDm> pageByOrganization(UUID orgId, int page, int size);

    Page<EventDm> pageByLocationAndIndustry(String country,
                                            String state,
                                            String city,
                                            Long industryId,
                                            int page,
                                            int size);

    Page<EventDm> pageRegisteredEvents(UUID accountId, int page, int size);

    void increaseViewCount(UUID eventId);
}