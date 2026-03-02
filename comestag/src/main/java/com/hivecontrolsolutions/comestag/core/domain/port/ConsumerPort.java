package com.hivecontrolsolutions.comestag.core.domain.port;

import com.hivecontrolsolutions.comestag.core.application.entity.input.UpdateConsProfileInput;
import com.hivecontrolsolutions.comestag.core.domain.model.ConsumerDm;

import java.util.Optional;
import java.util.UUID;

public interface ConsumerPort {
    ConsumerDm save(ConsumerDm org);

    Optional<ConsumerDm> getById(UUID id);

    void updateProfileImage(UUID accountId, UUID mediaId);

    void updateProfileCover(UUID accountId, UUID mediaId);

    ConsumerDm update(UpdateConsProfileInput input);

    void increaseViewCount(UUID consumerId);
}
