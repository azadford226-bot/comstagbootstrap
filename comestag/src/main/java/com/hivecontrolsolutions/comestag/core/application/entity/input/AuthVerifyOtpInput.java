package com.hivecontrolsolutions.comestag.core.application.entity.input;

import java.util.UUID;

public record AuthVerifyOtpInput(UUID userId, String code) {
}
