package com.hivecontrolsolutions.comestag.core.application.usecase.profile;

import com.hivecontrolsolutions.comestag.base.core.usecase.Usecase;
import com.hivecontrolsolutions.comestag.base.stereotype.UseCase;
import com.hivecontrolsolutions.comestag.core.application.entity.input.UpdateOrgProfileInput;
import com.hivecontrolsolutions.comestag.core.domain.model.OrganizationDm;
import com.hivecontrolsolutions.comestag.core.domain.port.AccountPort;
import com.hivecontrolsolutions.comestag.core.domain.port.OrganizationPort;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

@UseCase
@RequiredArgsConstructor
public class UpdateOrgProfileUseCase implements Usecase<UpdateOrgProfileInput, OrganizationDm> {
    private final OrganizationPort organizationPort;
    private final AccountPort accountPort;

    @Transactional
    @Override
    public OrganizationDm execute(UpdateOrgProfileInput input) {
        accountPort.updateAccountName(input.id(), input.displayName());
        return organizationPort.update(input);
    }
}
