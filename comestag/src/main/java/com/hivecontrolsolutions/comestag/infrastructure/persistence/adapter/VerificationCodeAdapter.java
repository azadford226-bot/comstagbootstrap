package com.hivecontrolsolutions.comestag.infrastructure.persistence.adapter;

import com.hivecontrolsolutions.comestag.base.stereotype.Adapter;
import com.hivecontrolsolutions.comestag.core.domain.model.VerificationCodeDm;
import com.hivecontrolsolutions.comestag.core.domain.port.VerificationCodePort;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.VerificationCodeEntity;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.repo.VerificationCodeRepository;
import lombok.RequiredArgsConstructor;

import java.util.UUID;

@Adapter
@RequiredArgsConstructor
public class VerificationCodeAdapter implements VerificationCodePort {

    private final VerificationCodeRepository repo;

    @Override
    public VerificationCodeDm getByUserId(UUID userId) {
        return repo.findByUserId(userId)
                .map(VerificationCodeEntity::toDm)
                .orElse(VerificationCodeDm.builder()
                        .userId(userId).build());
    }

    @Override
    public VerificationCodeDm updateOrSave(VerificationCodeDm verificationCodeDm) {
        return repo.save(VerificationCodeEntity.fromDm(verificationCodeDm)).toDm();
    }
}
