package com.hivecontrolsolutions.comestag.core.application.usecase.profile;

import com.hivecontrolsolutions.comestag.base.core.usecase.Usecase;
import com.hivecontrolsolutions.comestag.base.stereotype.UseCase;
import com.hivecontrolsolutions.comestag.core.application.entity.input.UpdateConsProfileInput;
import com.hivecontrolsolutions.comestag.core.domain.model.ConsumerDm;
import com.hivecontrolsolutions.comestag.core.domain.port.AccountPort;
import com.hivecontrolsolutions.comestag.core.domain.port.ConsumerPort;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

@UseCase
@RequiredArgsConstructor
public class UpdateConsProfileUseCase implements Usecase<UpdateConsProfileInput, ConsumerDm> {
    private final ConsumerPort consumerPort;
    private final AccountPort accountPort;

    @Transactional
    @Override
    public ConsumerDm execute(UpdateConsProfileInput input) {
        accountPort.updateAccountName(input.id(), input.displayName());
        return consumerPort.update(input);
    }
}
