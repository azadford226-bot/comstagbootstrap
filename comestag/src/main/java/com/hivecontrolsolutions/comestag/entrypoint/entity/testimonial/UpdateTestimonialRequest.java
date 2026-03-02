package com.hivecontrolsolutions.comestag.entrypoint.entity.testimonial;

import java.util.UUID;

public record UpdateTestimonialRequest(
        UUID testimonialId,
        short rating,
        String comment,
        String code
) {
}
