package com.hivecontrolsolutions.comestag.core.application.usecase.events;


import com.hivecontrolsolutions.comestag.base.core.usecase.UsecaseWithoutOutput;
import com.hivecontrolsolutions.comestag.base.stereotype.UseCase;
import com.hivecontrolsolutions.comestag.core.application.entity.input.UpdateEventInput;
import com.hivecontrolsolutions.comestag.core.domain.model.EventDm;
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
import java.util.stream.Stream;

@UseCase
@RequiredArgsConstructor
public class EditEventUseCase implements UsecaseWithoutOutput<UpdateEventInput> {

    private final EventPort eventPort;
    private final EventMediaPort eventMediaPort;
    private final MediaPort mediaPort;

    @Transactional
    @Override
    public void execute(UpdateEventInput input) {
        // 1) Ensure the event belongs to this organization
        EventDm event = eventPort.getByOrgIdAndId(input.orgId(), input.eventId());

        // 2) Normalize media id sets
        Set<UUID> newMediaIds = input.newMediaIds() == null ? Set.of() : input.newMediaIds();
        Set<UUID> deletedMediaIds = input.deletedMediaIds() == null ? Set.of() : input.deletedMediaIds();
        Set<UUID> allMediaIds = Stream.concat(newMediaIds.stream(), deletedMediaIds.stream())
                .collect(Collectors.toSet());

        // 3) Handle media add/remove (same logic as EditSuccessStoryUseCase)
        if (!allMediaIds.isEmpty()) {
            Set<MediaDm> existingOrgMedia = mediaPort.getExistingIdsByOrgIdAndIdIn(input.orgId(), allMediaIds);

            var deletedMediaDms = existingOrgMedia.stream()
                    .filter(m -> deletedMediaIds.contains(m.getId())
                            && MediaStatus.LINKED.equals(m.getStatus()))
                    .collect(Collectors.toSet());

            var newMediaDms = existingOrgMedia.stream()
                    .filter(m -> newMediaIds.contains(m.getId())
                            && MediaStatus.UNLINKED.equals(m.getStatus()))
                    .collect(Collectors.toSet());

            if (!deletedMediaDms.isEmpty()) {
                eventMediaPort.deleteByEventIdAndMediaIdIn(
                        event.getId(),
                        deletedMediaDms.stream().map(MediaDm::getId).collect(Collectors.toSet())
                );
            }

            if (!newMediaDms.isEmpty()) {
                eventMediaPort.create(
                        event.getId(),
                        newMediaDms.stream().map(MediaDm::getId).collect(Collectors.toSet())
                );
            }
        }

        // 4) Update event fields (null => keep existing)
        eventPort.update(
                event.getId(),
                input.title() == null ? event.getTitle() : input.title(),
                input.body() == null ? event.getBody() : input.body(),
                input.industry() == null ? event.getIndustry().getId() : input.industry(),
                input.country() == null ? event.getCountry() : input.country(),
                input.state() == null ? event.getState() : input.state(),
                input.city() == null ? event.getCity() : input.city(),
                input.address() == null ? event.getAddress() : input.address(),
                input.startAt() == null ? event.getStartAt() : input.startAt(),
                input.endAt() == null ? event.getEndAt() : input.endAt(),
                input.onlineLink() == null ? event.getOnlineLink() : input.onlineLink(),
                input.online() // nullable – adapter decides how to map to EventMode
        );
    }
}

