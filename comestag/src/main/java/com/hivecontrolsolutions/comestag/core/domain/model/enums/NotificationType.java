package com.hivecontrolsolutions.comestag.core.domain.model.enums;

public enum NotificationType {
    /* Legacy / social */
    POST_REACTED,
    POST_COMMENTED,
    COMMENT_REPLIED,
    TESTIMONIAL_ADDED,
    EVENT_REGISTERED,
    EVENT_REGISTRATION_CANCELLED,
    ORG_APPROVAL_CHANGED,
    EVENT_REMINDER,
    /* Wire-friendly aliases (frontend + outbox) */
    POST_LIKE,
    POST_COMMENT,
    FOLLOW,
    SYSTEM,
    /* RFQ & messaging */
    RFQ_NEW,
    RFQ_BID,
    RFQ_AWARDED,
    RFQ_CLOSED,
    MESSAGE_NEW,
    /* Opportunities hub */
    OPPORTUNITY_NEW,
    OPPORTUNITY_INTEREST
}