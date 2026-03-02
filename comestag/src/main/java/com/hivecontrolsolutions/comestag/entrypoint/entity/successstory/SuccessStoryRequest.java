package com.hivecontrolsolutions.comestag.entrypoint.entity.successstory;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.Set;
import java.util.UUID;

public record SuccessStoryRequest(
        @NotBlank
        @Size(max = 255)
        String title,
        @NotBlank
        String body,
        @Size(max = 20)
        Set<UUID> mediaIds,
        @Size(min = 1, max = 10) Set<Long> hashtags) {
}