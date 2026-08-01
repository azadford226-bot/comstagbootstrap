package com.hivecontrolsolutions.comestag.core.domain.service;

import com.hivecontrolsolutions.comestag.core.domain.model.NotificationPreferenceDm;
import com.hivecontrolsolutions.comestag.core.domain.model.enums.NotificationType;

public final class NotificationTypeCategoryMapper {

    private NotificationTypeCategoryMapper() {}

    public static boolean isCategoryEnabled(NotificationPreferenceDm prefs, NotificationType type) {
        if (prefs == null) return true; // no preferences = all enabled by default
        return switch (type) {
            case RFQ_NEW, RFQ_BID, RFQ_AWARDED, RFQ_CLOSED -> prefs.isRfqAlerts();
            case MESSAGE_NEW -> prefs.isMessageAlerts();
            case OPPORTUNITY_NEW, OPPORTUNITY_INTEREST -> prefs.isOpportunityAlerts();
            default -> prefs.isSystemAlerts();
        };
    }
}
