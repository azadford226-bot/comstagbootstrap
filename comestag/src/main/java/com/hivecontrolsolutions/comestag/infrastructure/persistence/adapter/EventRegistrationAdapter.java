package com.hivecontrolsolutions.comestag.infrastructure.persistence.adapter;

import com.hivecontrolsolutions.comestag.base.stereotype.Adapter;
import com.hivecontrolsolutions.comestag.core.domain.model.enums.EventRegistrationStatus;
import com.hivecontrolsolutions.comestag.core.domain.port.EventRegistrationPort;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.EventRegistrationEntity;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.repo.EventRegistrationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Adapter
@RequiredArgsConstructor
public class EventRegistrationAdapter implements EventRegistrationPort {

    private final EventRegistrationRepository repo;

    @Override
    @Transactional
    public void register(UUID eventId, UUID accountId) {
        var existing = repo.findByEventIdAndAccountId(eventId, accountId);
        if (existing.isPresent()) {
            var reg = existing.get();
            if (reg.getStatus() != EventRegistrationStatus.REGISTERED) {
                reg.setStatus(EventRegistrationStatus.REGISTERED);
                repo.save(reg);
            }
            return;
        }

        var reg = EventRegistrationEntity.builder()
                .eventId(eventId)
                .accountId(accountId)
                .status(EventRegistrationStatus.REGISTERED)
                .build();
        repo.save(reg);
    }

    @Override
    @Transactional
    public void unregister(UUID eventId, UUID accountId) {
        var existing = repo.findByEventIdAndAccountId(eventId, accountId);
        existing.ifPresent(reg -> {
            reg.setStatus(EventRegistrationStatus.CANCELLED);
            repo.save(reg);
        });
    }

    @Override
    public boolean exists(UUID eventId, UUID accountId, EventRegistrationStatus status) {
        return repo.existsByEventIdAndAccountIdAndStatus(eventId, accountId, status);
    }
}