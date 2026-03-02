package com.hivecontrolsolutions.comestag.core.application.entity.input;

import lombok.Builder;

import java.util.Set;
import java.util.UUID;

@Builder
public record UpdatePostInput(
        UUID orgId,
        UUID postId,
        String body,
        Set<UUID> deletedMediaIds,
        Set<UUID> newMediaIds
) {
}