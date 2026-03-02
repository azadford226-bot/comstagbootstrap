package com.hivecontrolsolutions.comestag.entrypoint.entity.certificate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.UUID;

public record CertificateRequest(
        @NotNull UUID imageId,
        @NotBlank String title,
        String body,
        String link,
        @NotNull LocalDate certificateDate
) {
}