package com.hivecontrolsolutions.comestag.infrastructure.persistence.adapter;

import com.hivecontrolsolutions.comestag.base.core.error.exception.BusinessException;
import com.hivecontrolsolutions.comestag.base.stereotype.Adapter;
import com.hivecontrolsolutions.comestag.core.application.entity.input.UpdateConsProfileInput;
import com.hivecontrolsolutions.comestag.core.domain.model.ConsumerDm;
import com.hivecontrolsolutions.comestag.core.domain.port.ConsumerPort;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.ConsumerEntity;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.IndustryEntity;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.repo.ConsumerRepository;
import lombok.RequiredArgsConstructor;

import java.util.Optional;
import java.util.UUID;

import static com.hivecontrolsolutions.comestag.base.core.error.entity.enums.InternalStatusError.ACCOUNT_NOT_EXIST;
import static com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.ConsumerEntity.fromDm;

@RequiredArgsConstructor
@Adapter
public class ConsumerAdapter implements ConsumerPort {
    private final ConsumerRepository consumerRepository;

    @Override
    public ConsumerDm save(ConsumerDm consumerDm) {
        var e = fromDm(consumerDm);
        return consumerRepository.save(e).toDm();
    }

    @Override
    public Optional<ConsumerDm> getById(UUID id) {
        return consumerRepository.findById(id).map(ConsumerEntity::toDm);
    }

    @Override
    public void updateProfileImage(UUID accountId, UUID mediaId) {
        consumerRepository.updateProfileImage(accountId, mediaId);
    }

    @Override
    public void updateProfileCover(UUID accountId, UUID mediaId) {
        consumerRepository.updateProfileCover(accountId, mediaId);
    }

    @Override
    public ConsumerDm update(UpdateConsProfileInput input) {
        ConsumerEntity consumer = consumerRepository.findById(input.id())
                .orElseThrow(() -> new BusinessException(ACCOUNT_NOT_EXIST));

        consumer.setDisplayName(input.displayName());
        consumer.setWebsite(input.website());
        consumer.setIndustry(IndustryEntity.builder().id(input.industryId()).build());
        consumer.setEstablished(input.established());
        consumer.setInterests(input.interests());
        consumer.setSize(input.size());
        consumer.setPhone(input.phone());
        consumer.setCountry(input.country());
        consumer.setState(input.state());
        consumer.setCity(input.city());

        return consumerRepository.saveAndFlush(consumer).toDm();
    }

    @Override
    public void increaseViewCount(UUID consumerId) {
        consumerRepository.incrementViews(consumerId);
    }
}
