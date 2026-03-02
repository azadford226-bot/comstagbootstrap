package com.hivecontrolsolutions.comestag.core.application.entity.input;

import lombok.Builder;

import java.time.LocalDate;
import java.util.UUID;

@Builder
public record CreateCertificateInput(
        UUID orgId,
        UUID imageId,
        String title,
        String body,
        String link,
        LocalDate certificateDate
) {
}