package com.hivecontrolsolutions.comestag.entrypoint.entity.post;

import java.util.Set;
import java.util.UUID;

public record UpdatePostRequest(
        String body,
        Set<UUID> deletedMediaIds,
        Set<UUID> newMediaIds
) {}
