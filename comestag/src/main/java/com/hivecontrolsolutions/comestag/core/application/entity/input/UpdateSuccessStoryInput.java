package com.hivecontrolsolutions.comestag.core.application.entity.input;

import java.util.Set;
import java.util.UUID;

public record UpdateSuccessStoryInput(
        UUID orgId,
        UUID successStoryId,
        String title,
        String body,
        Set<UUID> deletedMediaIds,
        Set<UUID> newMediaIds,
        Set<Long> deletedHashtagIds,
        Set<Long> newHashtagIds) {
}