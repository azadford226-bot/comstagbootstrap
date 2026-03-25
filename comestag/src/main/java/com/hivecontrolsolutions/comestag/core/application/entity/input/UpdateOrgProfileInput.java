package com.hivecontrolsolutions.comestag.core.application.entity.input;

import java.time.LocalDate;
import java.util.UUID;

public record UpdateOrgProfileInput(
        UUID id,
        String displayName,
        String companyType,
        String website,
        Long industryId,
        LocalDate established,
        String size,
        String whoWeAre,
        String whatWeDo,
        String phone,
        String country,
        String state,
        String city,
        String techStack) {
}
