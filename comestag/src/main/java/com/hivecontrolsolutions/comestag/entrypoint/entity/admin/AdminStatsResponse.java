package com.hivecontrolsolutions.comestag.entrypoint.entity.admin;

public record AdminStatsResponse(
        long totalOrganizations,
        long totalConsumers,
        long totalAdmins,
        long pendingOrganizations,
        long totalContactMessages,
        long unreadContactMessages,
        long totalConversations
) {}
