package com.hivecontrolsolutions.comestag.core.application.usecase.events;


import com.hivecontrolsolutions.comestag.base.core.usecase.UsecaseWithoutOutput;
import com.hivecontrolsolutions.comestag.base.stereotype.UseCase;
import com.hivecontrolsolutions.comestag.core.application.entity.input.CreateEventInput;
import com.hivecontrolsolutions.comestag.core.domain.model.MediaDm;
import com.hivecontrolsolutions.comestag.core.domain.model.enums.MediaStatus;
import com.hivecontrolsolutions.comestag.core.domain.port.EventMediaPort;
import com.hivecontrolsolutions.comestag.core.domain.port.EventPort;
import com.hivecontrolsolutions.comestag.core.domain.port.MediaPort;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@UseCase
@RequiredArgsConstructor
public class CreateEventUseCase implements UsecaseWithoutOutput<CreateEventInput> {

    private final EventPort eventPort;
    private final MediaPort mediaPort;
    private final EventMediaPort eventMediaPort;

    @Transactional
    @Override
    public void execute(CreateEventInput input) {

        Set<UUID> safeMediaIds = input.mediaIds() == null ? Set.of() : input.mediaIds();

        Set<UUID> existingImageIds = mediaPort.getExistingIdsByOrgIdAndIdIn(input.orgId(), safeMediaIds)
                .stream()
                .filter(m -> m.getStatus() == MediaStatus.UNLINKED)
                .map(MediaDm::getId)
                .collect(Collectors.toSet());

        var event = eventPort.create(
                input.orgId(),
                input.title(),
                input.body(),
                input.industry(),
                input.country(),
                input.state(),
                input.city(),
                input.address(),
                input.startAt(),
                input.endAt(),
                input.onlineLink(),
                input.online()
        );

        if (!existingImageIds.isEmpty()) {
            eventMediaPort.create(event.getId(), existingImageIds);
        }
    }
}