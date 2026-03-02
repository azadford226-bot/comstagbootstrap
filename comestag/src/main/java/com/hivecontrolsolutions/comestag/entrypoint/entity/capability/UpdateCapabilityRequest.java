package com.hivecontrolsolutions.comestag.entrypoint.entity.capability;

import java.util.Set;

public record UpdateCapabilityRequest(
        String name,
        String body,
        Set<Long> deletedHashtagIds,
        Set<Long> newHashtagIds
) {
}