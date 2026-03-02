package com.hivecontrolsolutions.comestag.core.domain.model;

import lombok.Builder;
import lombok.Getter;

import java.util.Map;
import java.util.UUID;

@Getter
@Builder
public class NotificationSettingsDm {
    private UUID accountId;

    private boolean inAppEnabled;
    private boolean emailEnabled;
    private boolean smsEnabled;

    // JSONB map: {"POST_COMMENTED":{"in_app":true,"email":false}}
    private Map<String, Object> preferences;
}