package com.hivecontrolsolutions.comestag.entrypoint.entity.successstory;

import java.util.Set;
import java.util.UUID;

public record UpdateSuccessStoryRequest(
        String title,
        String body,
        Set<UUID> deletedMediaIds,
        Set<UUID> newMediaIds,
        Set<Long> deletedHashtagIds,
        Set<Long> newHashtagIds) {
}