package com.hivecontrolsolutions.comestag.core.application.entity.input;

import java.util.UUID;

public record UpdateTestimonialInput(
        UUID testimonialId,
        UUID consumerId,
        short rating,
        String comment,
        String code
) {
}
