package com.hivecontrolsolutions.comestag.core.application.entity.input;

import lombok.Builder;

import java.util.Set;
import java.util.UUID;

@Builder
public record UpdateCapabilityInput(
        UUID orgId,
        UUID capabilityId,
        String name,
        String body,
        Set<Long> deletedHashtagIds,
        Set<Long> newHashtagIds
) {
}