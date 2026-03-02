package com.hivecontrolsolutions.comestag.core.application.usecase.capability;

import com.hivecontrolsolutions.comestag.base.core.usecase.UsecaseWithoutOutput;
import com.hivecontrolsolutions.comestag.base.stereotype.UseCase;
import com.hivecontrolsolutions.comestag.core.application.entity.input.UpdateCapabilityInput;
import com.hivecontrolsolutions.comestag.core.domain.model.CapabilityDm;
import com.hivecontrolsolutions.comestag.core.domain.model.HashtagDm;
import com.hivecontrolsolutions.comestag.core.domain.port.CapabilityHashtagPort;
import com.hivecontrolsolutions.comestag.core.domain.port.CapabilityPort;
import com.hivecontrolsolutions.comestag.core.domain.port.HashtagPort;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@UseCase
@RequiredArgsConstructor
public class EditCapabilityUseCase implements UsecaseWithoutOutput<UpdateCapabilityInput> {

    private final CapabilityPort capabilityPort;
    private final CapabilityHashtagPort capabilityHashtagPort;
    private final HashtagPort hashtagPort;

    @Transactional
    @Override
    public void execute(UpdateCapabilityInput input) {

        CapabilityDm capability = capabilityPort.getByOrgIdAndId(input.orgId(), input.capabilityId());

        Set<Long> newHashtagIds = input.newHashtagIds() == null ? Set.of() : input.newHashtagIds();
        Set<Long> deletedHashtagIds = input.deletedHashtagIds() == null ? Set.of() : input.deletedHashtagIds();
        Set<Long> allHashtagIds = Stream.concat(newHashtagIds.stream(), deletedHashtagIds.stream())
                .collect(Collectors.toSet());

        if (!allHashtagIds.isEmpty()) {
            Set<HashtagDm> existingHashtags = hashtagPort.getByIds(allHashtagIds);

            var deletedHashtags = existingHashtags.stream()
                    .filter(h -> deletedHashtagIds.contains(h.getId()))
                    .collect(Collectors.toSet());

            var newHashtags = existingHashtags.stream()
                    .filter(h -> newHashtagIds.contains(h.getId()))
                    .collect(Collectors.toSet());

            if (!deletedHashtags.isEmpty()) {
                capabilityHashtagPort.deleteByCapabilityIdAndHashtagIdIn(
                        capability.getId(),
                        deletedHashtags.stream().map(HashtagDm::getId).collect(Collectors.toSet())
                );
            }

            if (!newHashtags.isEmpty()) {
                capabilityHashtagPort.create(
                        capability.getId(),
                        newHashtags.stream().map(HashtagDm::getId).collect(Collectors.toSet())
                );
            }
        }

        capabilityPort.update(
                capability.getId(),
                input.name() == null ? capability.getTitle() : input.name(),
                input.body() == null ? capability.getBody() : input.body()
        );
    }
}