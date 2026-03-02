package com.hivecontrolsolutions.comestag.entrypoint.entity.capability;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.Set;

public record CapabilityRequest(
        @NotBlank String title,
        @NotBlank String body,
        @NotNull Set<Long> hashtags
) {
}