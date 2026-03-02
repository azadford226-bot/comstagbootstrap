package com.hivecontrolsolutions.comestag.core.application.usecase.profile;

import com.hivecontrolsolutions.comestag.base.core.error.exception.BusinessException;
import com.hivecontrolsolutions.comestag.base.core.usecase.Usecase;
import com.hivecontrolsolutions.comestag.base.stereotype.UseCase;
import com.hivecontrolsolutions.comestag.core.application.entity.PrivateOrgProfileDro;
import com.hivecontrolsolutions.comestag.core.domain.port.OrganizationPort;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

import static com.hivecontrolsolutions.comestag.base.core.error.entity.enums.InternalStatusError.ACCOUNT_NOT_EXIST;

@UseCase
@RequiredArgsConstructor
public class GetPrivateOrgProfileUseCase implements Usecase<UUID, PrivateOrgProfileDro> {
    private final OrganizationPort organizationPort;

    @Transactional(readOnly = true)
    @Override
    public PrivateOrgProfileDro execute(UUID currentUserId) {
        var org = organizationPort.getById(currentUserId).orElseThrow(() -> new BusinessException(ACCOUNT_NOT_EXIST));
        return new PrivateOrgProfileDro(org);
    }

}
