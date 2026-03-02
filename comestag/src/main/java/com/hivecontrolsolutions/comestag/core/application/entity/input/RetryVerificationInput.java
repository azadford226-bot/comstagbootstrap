package com.hivecontrolsolutions.comestag.core.application.entity.input;

public record RetryVerificationInput(VerificationType verificationType, String email, String identifier) {


    public enum VerificationType {
        EMAIL,
        CODE
    }
}

