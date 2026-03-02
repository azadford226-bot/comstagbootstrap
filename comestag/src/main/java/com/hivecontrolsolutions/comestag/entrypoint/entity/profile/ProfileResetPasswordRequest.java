package com.hivecontrolsolutions.comestag.entrypoint.entity.profile;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record ProfileResetPasswordRequest(@Email String email,
                                          @NotBlank String newPassword,
                                          @NotBlank String oldPassword) {
}

