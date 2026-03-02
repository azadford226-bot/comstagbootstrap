package com.hivecontrolsolutions.comestag.entrypoint.entity.post;

import jakarta.validation.constraints.NotBlank;

import java.util.Set;
import java.util.UUID;

public record PostRequest(
        @NotBlank String body,
        Set<UUID> mediaIds
) {}
