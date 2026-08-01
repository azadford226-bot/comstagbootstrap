package com.hivecontrolsolutions.comestag.core.domain.model;

import lombok.Builder;
import lombok.Getter;

import java.util.UUID;

@Getter
@Builder
public class NotificationPreferenceDm {
    private UUID accountId;
    private String emailDigest;
    private boolean inAppEnabled;
    private boolean pushEnabled;
    private boolean rfqAlerts;
    private boolean messageAlerts;
    private boolean opportunityAlerts;
    private boolean systemAlerts;
}
