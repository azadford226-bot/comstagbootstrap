package com.hivecontrolsolutions.comestag.entrypoint.entity.rfq;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateRfqCommentRequest(
        @NotBlank @Size(max = 2000) String body
) {
}