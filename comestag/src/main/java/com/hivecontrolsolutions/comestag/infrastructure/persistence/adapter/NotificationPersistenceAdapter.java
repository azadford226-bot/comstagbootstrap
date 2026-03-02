package com.hivecontrolsolutions.comestag.infrastructure.persistence.adapter;

import com.hivecontrolsolutions.comestag.core.application.entity.PageResult;
import com.hivecontrolsolutions.comestag.core.domain.model.NotificationEnvelopeDm;
import com.hivecontrolsolutions.comestag.core.domain.model.NotificationViewDm;
import com.hivecontrolsolutions.comestag.core.domain.port.NotificationCommandPort;
import com.hivecontrolsolutions.comestag.core.domain.port.NotificationQueryPort;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.dao.NotificationJdbcRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class NotificationPersistenceAdapter implements NotificationQueryPort, NotificationCommandPort {

    private final NotificationJdbcRepository jdbcRepo;

    // ---------------- QueryPort ----------------

    @Override
    public PageResult<NotificationViewDm> listMy(UUID accountId, int page, int size) {
        return PageResult.of(jdbcRepo.listMyPage(accountId, page, size));
    }

    @Override
    public long countUnread(UUID accountId) {
        return jdbcRepo.countUnread(accountId);
    }

    // ---------------- CommandPort ----------------

    @Override
    @Transactional
    public Optional<NotificationViewDm> createInAppIfAllowedAndNotDuplicated(NotificationEnvelopeDm envelope) {
        return jdbcRepo.insertInApp(envelope);
    }

    @Override
    @Transactional
    public void markRead(UUID accountId, UUID notificationId, Instant readAt) {
        jdbcRepo.markRead(accountId, notificationId, readAt);
    }

    @Override
    @Transactional
    public int markAllRead(UUID accountId, Instant readAt) {
        return jdbcRepo.markAllRead(accountId, readAt);
    }
}