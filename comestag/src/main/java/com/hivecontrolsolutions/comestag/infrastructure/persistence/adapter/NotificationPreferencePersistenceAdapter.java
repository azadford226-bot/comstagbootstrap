package com.hivecontrolsolutions.comestag.infrastructure.persistence.adapter;

import com.hivecontrolsolutions.comestag.core.domain.model.NotificationPreferenceDm;
import com.hivecontrolsolutions.comestag.core.domain.port.NotificationPreferencePort;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.NotificationPreferenceEntity;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.repo.NotificationPreferenceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class NotificationPreferencePersistenceAdapter implements NotificationPreferencePort {

    private final NotificationPreferenceRepository repository;

    @Override
    public Optional<NotificationPreferenceDm> findByAccountId(UUID accountId) {
        return repository.findByAccountId(accountId).map(this::toDm);
    }

    @Override
    public List<NotificationPreferenceDm> findByEmailDigest(String digestFrequency) {
        return repository.findByEmailDigest(digestFrequency).stream().map(this::toDm).toList();
    }

    private NotificationPreferenceDm toDm(NotificationPreferenceEntity entity) {
        return NotificationPreferenceDm.builder()
                .accountId(entity.getAccountId())
                .emailDigest(entity.getEmailDigest())
                .inAppEnabled(entity.isInAppEnabled())
                .pushEnabled(entity.isPushEnabled())
                .rfqAlerts(entity.isRfqAlerts())
                .messageAlerts(entity.isMessageAlerts())
                .opportunityAlerts(entity.isOpportunityAlerts())
                .systemAlerts(entity.isSystemAlerts())
                .build();
    }
}
