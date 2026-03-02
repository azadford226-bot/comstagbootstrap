package com.hivecontrolsolutions.comestag.core.application.usecase.profile;

import com.hivecontrolsolutions.comestag.base.core.error.entity.enums.InternalStatusError;
import com.hivecontrolsolutions.comestag.base.core.error.exception.BusinessException;
import com.hivecontrolsolutions.comestag.base.core.usecase.Usecase;
import com.hivecontrolsolutions.comestag.base.stereotype.UseCase;
import com.hivecontrolsolutions.comestag.core.application.entity.PublicConsProfileDro;
import com.hivecontrolsolutions.comestag.core.application.entity.PublicOrgProfileDro;
import com.hivecontrolsolutions.comestag.core.application.entity.input.GetPublicProfileInput;
import com.hivecontrolsolutions.comestag.core.domain.model.AccountDm;
import com.hivecontrolsolutions.comestag.core.domain.model.ConsumerDm;
import com.hivecontrolsolutions.comestag.core.domain.model.OrganizationDm;
import com.hivecontrolsolutions.comestag.core.domain.port.AccountPort;
import com.hivecontrolsolutions.comestag.core.domain.port.ConsumerPort;
import com.hivecontrolsolutions.comestag.core.domain.port.OrganizationPort;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

@UseCase
@RequiredArgsConstructor
public class GetPublicProfileUseCase implements Usecase<GetPublicProfileInput, Object> {

    private final AccountPort accountPort;
    private final OrganizationPort organizationPort;
    private final ConsumerPort consumerPort;

    @Transactional
    @Override
    public Object execute(GetPublicProfileInput input) {
        var targetUserId = input.targetUserId();
        var currentUserId = input.currentUserId();

        var account = accountPort.getById(targetUserId)
                .filter(AccountDm::isActive)
                .orElseThrow(() -> new BusinessException(InternalStatusError.ACCOUNT_NOT_EXIST));

        return switch (account.getType()) {
            case ORG -> {
                var org = organizationPort.getById(targetUserId)
                        .orElseThrow(() -> new BusinessException(InternalStatusError.ACCOUNT_NOT_EXIST));
                if (!currentUserId.equals(targetUserId)) {
                    organizationPort.increaseViewCount(targetUserId);
                }
                yield getProfileOutput(org);
            }
            case CONSUMER -> {
                var cons = consumerPort.getById(targetUserId)
                        .orElseThrow(() -> new BusinessException(InternalStatusError.ACCOUNT_NOT_EXIST));
                if (!currentUserId.equals(targetUserId)) {
                    consumerPort.increaseViewCount(targetUserId);
                }
                yield getProfileOutput(cons);
            }
            default -> throw new BusinessException(InternalStatusError.ACCOUNT_NOT_EXIST);
        };
    }

    private PublicOrgProfileDro getProfileOutput(OrganizationDm organizationDm) {
        return PublicOrgProfileDro.builder()
                .id(organizationDm.getId())
                .displayName(organizationDm.getDisplayName())
                .industry(organizationDm.getIndustry())
                .profileImageId(organizationDm.getProfileImageId())
                .profileCoverId(organizationDm.getProfileCoverId())
                .city(organizationDm.getCity())
                .size(organizationDm.getSize())
                .state(organizationDm.getState())
                .country(organizationDm.getCountry())
                .website(organizationDm.getWebsite())
                .createdAt(organizationDm.getCreatedAt())
                .established(organizationDm.getEstablished())
                .ratingSum(organizationDm.getRatingSum())
                .reviewsCount(organizationDm.getReviewsCount())
                .whatWeDo(organizationDm.getWhatWeDo())
                .whoWeAre(organizationDm.getWhoWeAre())
                .build();
    }

    private PublicConsProfileDro getProfileOutput(ConsumerDm consumerDm) {
        return PublicConsProfileDro.builder()
                .id(consumerDm.getId())
                .industry(consumerDm.getIndustry())
                .displayName(consumerDm.getDisplayName())
                .profileCoverId(consumerDm.getProfileCoverId())
                .profileImageId(consumerDm.getProfileImageId())
                .size(consumerDm.getSize())
                .state(consumerDm.getState())
                .city(consumerDm.getCity())
                .country(consumerDm.getCountry())
                .established(consumerDm.getEstablished())
                .website(consumerDm.getWebsite())
                .createdAt(consumerDm.getCreatedAt())
                .build();
    }
}
