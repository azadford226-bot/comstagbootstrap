package com.hivecontrolsolutions.comestag.core.application.entity.input;

public record ResetPasswordInput(String email, String newPassword, String oldPassword, String verificationCode) {
}
