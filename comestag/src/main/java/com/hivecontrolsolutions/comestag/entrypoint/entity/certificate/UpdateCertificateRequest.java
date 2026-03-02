package com.hivecontrolsolutions.comestag.entrypoint.entity.certificate;

import java.time.LocalDate;
import java.util.UUID;

public record UpdateCertificateRequest(
        String title,
        String body,
        String link,
        LocalDate certificateDate,
        UUID newImageId
) {
}