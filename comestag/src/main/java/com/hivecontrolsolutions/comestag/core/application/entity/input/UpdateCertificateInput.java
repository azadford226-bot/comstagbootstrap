package com.hivecontrolsolutions.comestag.core.application.entity.input;

import lombok.Builder;

import java.time.LocalDate;
import java.util.UUID;

@Builder
public record UpdateCertificateInput(
        UUID orgId,
        UUID certificateId,
        String title,
        String body,
        String link,
        LocalDate certificateDate,
        UUID newImageId // nullable => keep existing
) {
}