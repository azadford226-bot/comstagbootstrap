package com.hivecontrolsolutions.comestag.entrypoint.entity.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record AuthLoginRequest(@Email String email,
                               @NotBlank String password) {
}

