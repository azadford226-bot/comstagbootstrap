package com.hivecontrolsolutions.comestag.core.application.entity.input;

import lombok.Builder;

import java.util.Set;
import java.util.UUID;

@Builder
public record CreateCapabilityInput(
        UUID orgId,
        String title,
        String body,
        Set<Long> hashtags
) {
}