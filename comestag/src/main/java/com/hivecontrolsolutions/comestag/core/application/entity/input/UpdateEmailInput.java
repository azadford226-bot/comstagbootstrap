package com.hivecontrolsolutions.comestag.core.application.entity.input;

import java.util.UUID;

public record UpdateEmailInput(UUID userId, String newEmail, String verificationCode) {
}
