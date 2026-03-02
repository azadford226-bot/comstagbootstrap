package com.hivecontrolsolutions.comestag.core.domain.port;

import com.hivecontrolsolutions.comestag.core.domain.model.NotificationSettingsDm;

import java.util.UUID;

public interface NotificationSettingsPort {
    NotificationSettingsDm getOrCreateDefault(UUID accountId);

    NotificationSettingsDm update(NotificationSettingsDm settings);
}