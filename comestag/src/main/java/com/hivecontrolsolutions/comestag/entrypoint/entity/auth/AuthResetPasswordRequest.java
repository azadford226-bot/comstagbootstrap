package com.hivecontrolsolutions.comestag.entrypoint.entity.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record AuthResetPasswordRequest(@Email String email,
                                       @NotBlank String newPassword,
                                       @NotBlank String verificationCode) {
}
