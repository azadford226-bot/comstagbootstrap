package com.hivecontrolsolutions.comestag.core.domain.port;

import com.hivecontrolsolutions.comestag.core.domain.model.VerificationCodeDm;

import java.util.UUID;

public interface VerificationCodePort {
    VerificationCodeDm getByUserId(UUID accountId);

    VerificationCodeDm updateOrSave(VerificationCodeDm verificationCodeDm);
}
