package com.hivecontrolsolutions.comestag.core.application.usecase.notification;

import com.hivecontrolsolutions.comestag.base.core.usecase.Usecase;
import com.hivecontrolsolutions.comestag.base.stereotype.UseCase;
import com.hivecontrolsolutions.comestag.core.domain.model.NotificationSettingsDm;
import com.hivecontrolsolutions.comestag.core.domain.port.NotificationSettingsPort;
import lombok.RequiredArgsConstructor;

import java.util.UUID;

@UseCase
@RequiredArgsConstructor
public class GetMyNotificationSettingsUseCase implements Usecase<UUID, NotificationSettingsDm> {

    private final NotificationSettingsPort settingsPort;

    @Override
    public NotificationSettingsDm execute(UUID accountId) {
        return settingsPort.getOrCreateDefault(accountId);
    }
}