package com.hivecontrolsolutions.comestag.core.application.entity.input;

import lombok.Builder;

import java.util.Set;
import java.util.UUID;

@Builder
public record CreatePostInput(
        UUID orgId,
        String body,
        Set<UUID> mediaIds
) {}
