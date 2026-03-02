package com.hivecontrolsolutions.comestag.core.application.usecase.successstory;

import com.hivecontrolsolutions.comestag.base.core.usecase.UsecaseWithoutOutput;
import com.hivecontrolsolutions.comestag.base.stereotype.UseCase;
import com.hivecontrolsolutions.comestag.core.application.entity.input.CreateSuccessStoryInput;
import com.hivecontrolsolutions.comestag.core.domain.model.HashtagDm;
import com.hivecontrolsolutions.comestag.core.domain.model.MediaDm;
import com.hivecontrolsolutions.comestag.core.domain.port.*;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import static com.hivecontrolsolutions.comestag.core.domain.model.enums.MediaStatus.UNLINKED;

@UseCase
@RequiredArgsConstructor
public class CreateSuccessStoryUseCase implements UsecaseWithoutOutput<CreateSuccessStoryInput> {

    private final SuccessStoryPort successStoryPort;
    private final SuccessStoryMediaPort successStoryMediaPort;
    private final MediaPort mediaPort;
    private final HashtagPort hashtagPort;
    private final SuccessStoryHashtagPort successStoryHashtagPort;

    @Transactional
    @Override
    public void execute(CreateSuccessStoryInput input) {
        Set<UUID> existingIds = mediaPort.getExistingIdsByOrgIdAndIdIn(input.orgId(), input.mediaIds())
                .stream()
                .filter(mediaDm -> mediaDm.getStatus().equals(UNLINKED))
                .map(MediaDm::getId)
                .collect(Collectors.toSet());

        Set<Long> existingHashtagIds = hashtagPort.getByIds(input.hashtags())
                .stream()
                .map(HashtagDm::getId)
                .collect(Collectors.toSet());

        var successStory = successStoryPort.create(input.orgId(), input.title(), input.body());
        if (!existingIds.isEmpty()) {
            successStoryMediaPort.create(successStory.getId(), existingIds);
        }

        if (!input.hashtags().isEmpty()) {
            successStoryHashtagPort.create(successStory.getId(), existingHashtagIds);
        }

    }
}
