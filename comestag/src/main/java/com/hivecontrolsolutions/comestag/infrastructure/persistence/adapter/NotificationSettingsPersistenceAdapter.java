package com.hivecontrolsolutions.comestag.infrastructure.persistence.adapter;

import com.hivecontrolsolutions.comestag.core.domain.model.NotificationSettingsDm;
import com.hivecontrolsolutions.comestag.core.domain.port.NotificationSettingsPort;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.NotificationSettingsEntity;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.repo.NotificationSettingsJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.HashMap;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class NotificationSettingsPersistenceAdapter implements NotificationSettingsPort {

    private final NotificationSettingsJpaRepository repo;

    @Override
    @Transactional
    public NotificationSettingsDm getOrCreateDefault(UUID accountId) {
        return repo.findById(accountId)
                .map(this::toDm)
                .orElseGet(() -> {
                    NotificationSettingsEntity e = new NotificationSettingsEntity();
                    e.setAccountId(accountId);
                    e.setInAppEnabled(true);
                    e.setEmailEnabled(false);
                    e.setSmsEnabled(false);
                    e.setPreferences(new HashMap<>());
                    e.setCreatedAt(Instant.now());
                    e.setUpdatedAt(Instant.now());
                    return toDm(repo.save(e));
                });
    }

    @Override
    @Transactional
    public NotificationSettingsDm update(NotificationSettingsDm settings) {
        NotificationSettingsEntity e = repo.findById(settings.getAccountId())
                .orElseGet(() -> {
                    NotificationSettingsEntity n = new NotificationSettingsEntity();
                    n.setAccountId(settings.getAccountId());
                    n.setCreatedAt(Instant.now());
                    return n;
                });

        e.setInAppEnabled(settings.isInAppEnabled());
        e.setEmailEnabled(settings.isEmailEnabled());
        e.setSmsEnabled(settings.isSmsEnabled());
        e.setPreferences(settings.getPreferences() == null ? new HashMap<>() : settings.getPreferences());
        e.setUpdatedAt(Instant.now());

        return toDm(repo.save(e));
    }

    private NotificationSettingsDm toDm(NotificationSettingsEntity e) {
        return NotificationSettingsDm.builder()
                .accountId(e.getAccountId())
                .inAppEnabled(e.isInAppEnabled())
                .emailEnabled(e.isEmailEnabled())
                .smsEnabled(e.isSmsEnabled())
                .preferences(e.getPreferences())
                .build();
    }
}