package com.hivecontrolsolutions.comestag.core.application.usecase.capability;

import com.hivecontrolsolutions.comestag.base.core.usecase.UsecaseWithoutOutput;
import com.hivecontrolsolutions.comestag.base.stereotype.UseCase;
import com.hivecontrolsolutions.comestag.core.application.entity.input.CreateCapabilityInput;
import com.hivecontrolsolutions.comestag.core.domain.model.HashtagDm;
import com.hivecontrolsolutions.comestag.core.domain.port.CapabilityHashtagPort;
import com.hivecontrolsolutions.comestag.core.domain.port.CapabilityPort;
import com.hivecontrolsolutions.comestag.core.domain.port.HashtagPort;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.stream.Collectors;

@UseCase
@RequiredArgsConstructor
public class CreateCapabilityUseCase implements UsecaseWithoutOutput<CreateCapabilityInput> {

    private final CapabilityPort capabilityPort;
    private final HashtagPort hashtagPort;
    private final CapabilityHashtagPort capabilityHashtagPort;

    @Transactional
    @Override
    public void execute(CreateCapabilityInput input) {

        Set<Long> existingHashtagIds = hashtagPort.getByIds(input.hashtags())
                .stream()
                .map(HashtagDm::getId)
                .collect(Collectors.toSet());

        var capability = capabilityPort.create(input.orgId(), input.title(), input.body());

        if (!input.hashtags().isEmpty()) {
            capabilityHashtagPort.create(capability.getId(), existingHashtagIds);
        }
    }
}
