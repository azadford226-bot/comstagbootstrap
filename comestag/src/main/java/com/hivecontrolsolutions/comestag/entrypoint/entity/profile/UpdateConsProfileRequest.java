package com.hivecontrolsolutions.comestag.entrypoint.entity.profile;

import java.time.LocalDate;
import java.util.Set;

public record UpdateConsProfileRequest(
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
