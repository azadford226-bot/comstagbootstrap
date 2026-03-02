package com.hivecontrolsolutions.comestag.core.application.entity.input;

import com.hivecontrolsolutions.comestag.core.domain.model.RfqDm;

import java.util.UUID;

public record ListRfqsInput(
        UUID organizationId,
        String filter, // "mine", "available", "all"
        RfqDm.RfqStatus status,
        Long industryId,
        int page,
        int size
) {}


