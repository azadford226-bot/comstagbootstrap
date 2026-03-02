package com.hivecontrolsolutions.comestag.core.application.entity.input;

import java.util.UUID;

public record DeleteTestimonialInput(
        UUID testimonialId,
        UUID consumerId,
        String code
) {
}
