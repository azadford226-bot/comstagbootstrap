package com.hivecontrolsolutions.comestag.entrypoint.entity.profile;

public record UpdateEmailRequest(String newEmail, String verificationCode) {
}
