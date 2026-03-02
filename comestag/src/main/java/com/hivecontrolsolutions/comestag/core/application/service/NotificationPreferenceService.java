package com.hivecontrolsolutions.comestag.core.application.service;

import com.hivecontrolsolutions.comestag.core.domain.model.NotificationSettingsDm;
import com.hivecontrolsolutions.comestag.core.domain.model.enums.NotificationType;

import java.util.Map;

public class NotificationPreferenceService {

    /**
     * Rules:
     * 1) global inAppEnabled must be true
     * 2) if preferences contains a per-type config, it can override
     */
    public boolean isInAppEnabled(NotificationSettingsDm settings, NotificationType type) {
        if (settings == null) return true; // default allow if settings missing
        if (!settings.isInAppEnabled()) return false;

        Map<String, Object> prefs = settings.getPreferences();
        if (prefs == null) return true;

        Object typeObj = prefs.get(type.name());
        if (!(typeObj instanceof Map<?, ?> typeMap)) return true;

        Object inApp = typeMap.get("in_app");
        if (inApp instanceof Boolean b) return b;

        return true;
    }
}