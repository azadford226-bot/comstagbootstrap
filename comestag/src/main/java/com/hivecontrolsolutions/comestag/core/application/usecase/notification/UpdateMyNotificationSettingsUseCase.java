package com.hivecontrolsolutions.comestag.core.application.usecase.notification;

import com.hivecontrolsolutions.comestag.base.core.usecase.Usecase;
import com.hivecontrolsolutions.comestag.base.stereotype.UseCase;
import com.hivecontrolsolutions.comestag.core.domain.model.NotificationSettingsDm;
import com.hivecontrolsolutions.comestag.core.domain.port.NotificationSettingsPort;
import lombok.RequiredArgsConstructor;

@UseCase
@RequiredArgsConstructor
public class UpdateMyNotificationSettingsUseCase implements Usecase<NotificationSettingsDm, NotificationSettingsDm> {

    private final NotificationSettingsPort settingsPort;

    @Override
    public NotificationSettingsDm execute(NotificationSettingsDm input) {
        return settingsPort.update(input);
    }
}