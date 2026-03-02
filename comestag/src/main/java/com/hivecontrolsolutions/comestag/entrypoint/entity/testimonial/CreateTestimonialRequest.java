package com.hivecontrolsolutions.comestag.entrypoint.entity.testimonial;

import java.util.UUID;

public record CreateTestimonialRequest(
        UUID orgId,
        short rating,
        String comment,
        String verificationCode
) {
}
