package com.hivecontrolsolutions.comestag.entrypoint.entity.notification;

import java.util.Map;

public record UpdateNotificationSettingsRequest(
        boolean inAppEnabled,
        boolean emailEnabled,
        boolean smsEnabled,
        Map<String, Object> preferences
) {
}