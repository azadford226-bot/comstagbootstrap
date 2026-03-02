package com.hivecontrolsolutions.comestag.infrastructure.persistence.adapter;

import com.hivecontrolsolutions.comestag.base.core.error.exception.BusinessException;
import com.hivecontrolsolutions.comestag.base.stereotype.Adapter;
import com.hivecontrolsolutions.comestag.core.domain.model.EventDm;
import com.hivecontrolsolutions.comestag.core.domain.model.enums.EventMode;
import com.hivecontrolsolutions.comestag.core.domain.port.EventPort;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.EventEntity;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.IndustryEntity;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.repo.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.UUID;

import static com.hivecontrolsolutions.comestag.base.core.error.entity.enums.InternalStatusError.EVENT_NOT_EXIST;

@Adapter
@RequiredArgsConstructor
public class EventAdapter implements EventPort {

    private final EventRepository repo;

    @Override
    public EventDm getById(UUID id) {
        return repo.findById(id)
                .orElseThrow(() -> new BusinessException(EVENT_NOT_EXIST))
                .toDm();
    }

    @Override
    public EventDm getByOrgIdAndId(UUID orgId, UUID id) {
        return repo.findByIdAndOrgId(id, orgId)
                .orElseThrow(() -> new BusinessException(EVENT_NOT_EXIST))
                .toDm();
    }

    @Override
    public EventDm create(UUID orgAccountId,
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
                          boolean isOnline) {

        EventEntity e = EventEntity.builder()
                .orgId(orgAccountId)
                .title(title)
                .body(body)
                .industry(IndustryEntity.builder().id(industry).build())
                .country(country)
                .state(state)
                .city(city)
                .address(address)
                .startAt(startAt)
                .endAt(endAt)
                .mode(isOnline ? EventMode.ONLINE : EventMode.OFFLINE)
                .onlineLink(onlineLink)
                .build();

        return repo.save(e).toDm();
    }

    @Override
    public int update(UUID eventId,
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
                      Boolean isOnlineOrNull) {

        EventDm current = getById(eventId);

        EventMode mode = isOnlineOrNull == null
                ? current.getMode()
                : (isOnlineOrNull ? EventMode.ONLINE : EventMode.OFFLINE);

        return repo.updateEvent(
                eventId,
                title,
                body,
                IndustryEntity.builder().id(industry).build(),
                country,
                state,
                city,
                address,
                startAt,
                endAt,
                mode,
                onlineLink
        );
    }

    @Override
    @Transactional
    public void delete(UUID eventId, UUID orgAccountId) {
        repo.deleteByIdAndOrgId(eventId, orgAccountId);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<EventDm> pageByOrganization(UUID orgId, int page, int size) {
        return repo.findByOrgId(orgId, PageRequest.of(page, size))
                .map(EventEntity::toDm);
    }

    @Override
    public Page<EventDm> pageByLocationAndIndustry(String country,
                                                   String state,
                                                   String city,
                                                   Long industryId,
                                                   int page,
                                                   int size) {
        return repo.searchByLocationAndIndustry(
                        country,
                        state,
                        city,
                        industryId,
                        PageRequest.of(page, size))
                .map(EventEntity::toDm);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<EventDm> pageRegisteredEvents(UUID accountId, int page, int size) {
        return repo.findRegisteredEvents(accountId, PageRequest.of(page, size))
                .map(EventEntity::toDm);
    }

    @Override
    @Transactional
    public void increaseViewCount(UUID eventId) {
        repo.incrementViewers(eventId);
    }
}