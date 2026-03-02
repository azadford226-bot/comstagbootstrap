package com.hivecontrolsolutions.comestag.core.application.entity.input;

import java.util.Set;
import java.util.UUID;

public record CreateSuccessStoryInput(
        UUID orgId,
        String title,
        String body,
        Set<UUID> mediaIds,
        Set<Long> hashtags) {
}