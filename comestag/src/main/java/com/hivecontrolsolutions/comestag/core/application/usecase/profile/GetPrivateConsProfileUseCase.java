package com.hivecontrolsolutions.comestag.core.application.usecase.profile;

import com.hivecontrolsolutions.comestag.base.core.error.exception.BusinessException;
import com.hivecontrolsolutions.comestag.base.core.usecase.Usecase;
import com.hivecontrolsolutions.comestag.base.stereotype.UseCase;
import com.hivecontrolsolutions.comestag.core.application.entity.PrivateConsProfileDto;
import com.hivecontrolsolutions.comestag.core.domain.model.ConsumerDm;
import com.hivecontrolsolutions.comestag.core.domain.port.ConsumerPort;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

import static com.hivecontrolsolutions.comestag.base.core.error.entity.enums.InternalStatusError.ACCOUNT_NOT_EXIST;

@UseCase
@RequiredArgsConstructor
public class GetPrivateConsProfileUseCase implements Usecase<UUID, PrivateConsProfileDto> {
    private final ConsumerPort consumerPort;

    @Transactional(readOnly = true)
    @Override
    public PrivateConsProfileDto execute(UUID currentUserId) {
        var cons = consumerPort.getById(currentUserId).orElseThrow(() -> new BusinessException(ACCOUNT_NOT_EXIST));

        return convertToDto(cons);
    }

    private PrivateConsProfileDto convertToDto(ConsumerDm consumer) {
        return new PrivateConsProfileDto(
                consumer.getIndustry(),
                consumer.getInterests(),
                consumer.getEstablished(),
                consumer.getSize(),
                consumer.getWebsite(),
                consumer.getPhone(),
                consumer.getCountry(),
                consumer.getState(),
                consumer.getCity(),
                consumer.getViews(),
                consumer.getProfileImageId(),
                consumer.getProfileCoverId(),
                consumer.getCreatedAt(),
                consumer.getUpdatedAt()
        );
    }

}
