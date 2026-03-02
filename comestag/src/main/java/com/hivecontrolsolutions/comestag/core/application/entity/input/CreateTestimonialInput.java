package com.hivecontrolsolutions.comestag.core.application.entity.input;

import java.util.UUID;

public record CreateTestimonialInput (
        UUID consumerId,
        String consumerName,
        UUID organizationId,
        short rating,
        String comment,
        String code
){
}
