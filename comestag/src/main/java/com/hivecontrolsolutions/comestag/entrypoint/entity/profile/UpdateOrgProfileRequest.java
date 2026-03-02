package com.hivecontrolsolutions.comestag.entrypoint.entity.profile;

import java.time.LocalDate;

public record UpdateOrgProfileRequest(
        String displayName,
        String website,
        Long industryId,
        LocalDate established,
        String size,
        String whoWeAre,
        String whatWeDo,
        String phone,
        String country,
        String state,
        String city) {
}
