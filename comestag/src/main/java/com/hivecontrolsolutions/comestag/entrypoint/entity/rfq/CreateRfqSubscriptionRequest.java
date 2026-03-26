package com.hivecontrolsolutions.comestag.entrypoint.entity.rfq;

public record CreateRfqSubscriptionRequest(
        String keyword,
        String category
) {}
