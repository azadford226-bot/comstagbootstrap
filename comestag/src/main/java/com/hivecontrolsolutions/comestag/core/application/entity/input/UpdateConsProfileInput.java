package com.hivecontrolsolutions.comestag.core.application.entity.input;

import java.time.LocalDate;
import java.util.Set;
import java.util.UUID;

public record UpdateConsProfileInput(
        UUID id,
        String displayName,
        String website,
        Long industryId,
        LocalDate established,
        Set<String> interests,
        String size,
        String phone,
        String country,
        String state,
        String city) {
}
