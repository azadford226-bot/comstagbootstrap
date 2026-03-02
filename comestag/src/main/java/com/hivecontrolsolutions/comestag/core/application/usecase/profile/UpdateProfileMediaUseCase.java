package com.hivecontrolsolutions.comestag.core.application.usecase.profile;

import com.hivecontrolsolutions.comestag.base.core.error.exception.BusinessException;
import com.hivecontrolsolutions.comestag.base.core.usecase.UsecaseWithoutOutput;
import com.hivecontrolsolutions.comestag.base.stereotype.UseCase;
import com.hivecontrolsolutions.comestag.core.application.entity.input.UploadProfileMediaInput;
import com.hivecontrolsolutions.comestag.core.domain.port.ConsumerPort;
import com.hivecontrolsolutions.comestag.core.domain.port.MediaPort;
import com.hivecontrolsolutions.comestag.core.domain.port.OrganizationPort;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

import static com.hivecontrolsolutions.comestag.base.core.error.entity.enums.InternalStatusError.MEDIA_NOT_EXIST;
import static com.hivecontrolsolutions.comestag.core.domain.model.enums.AccountType.CONSUMER;
import static com.hivecontrolsolutions.comestag.core.domain.model.enums.AccountType.ORG;

@RequiredArgsConstructor
@UseCase
public class UpdateProfileMediaUseCase implements UsecaseWithoutOutput<UploadProfileMediaInput> {

    private final ConsumerPort consumerPort;
    private final OrganizationPort organizationPort;
    private final MediaPort mediaPort;

    @Transactional
    @Override
    public void execute(UploadProfileMediaInput input) {
        boolean mediaExists = mediaPort.isExists(input.mediaId(), input.userId());
        if (!mediaExists)
            throw new BusinessException(MEDIA_NOT_EXIST);

        if (CONSUMER.equals(input.accountType()) && "IMAGE".equals(input.profileMediaType())) {
            consumerPort.updateProfileImage(input.userId(), input.mediaId());
        } else if (CONSUMER.equals(input.accountType()) && "COVER".equals(input.profileMediaType())) {
            consumerPort.updateProfileCover(input.userId(), input.mediaId());
        } else if (ORG.equals(input.accountType()) && "IMAGE".equals(input.profileMediaType())) {
            organizationPort.updateProfileImage(input.userId(), input.mediaId());
        } else if (ORG.equals(input.accountType()) && "COVER".equals(input.profileMediaType())) {
            organizationPort.updateProfileCover(input.userId(), input.mediaId());
        }
    }
}
