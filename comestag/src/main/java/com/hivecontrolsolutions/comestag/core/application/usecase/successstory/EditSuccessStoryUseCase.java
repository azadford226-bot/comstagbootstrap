package com.hivecontrolsolutions.comestag.core.application.usecase.successstory;

import com.hivecontrolsolutions.comestag.base.core.usecase.UsecaseWithoutOutput;
import com.hivecontrolsolutions.comestag.base.stereotype.UseCase;
import com.hivecontrolsolutions.comestag.core.application.entity.input.UpdateSuccessStoryInput;
import com.hivecontrolsolutions.comestag.core.domain.model.HashtagDm;
import com.hivecontrolsolutions.comestag.core.domain.model.MediaDm;
import com.hivecontrolsolutions.comestag.core.domain.model.SuccessStoryDm;
import com.hivecontrolsolutions.comestag.core.domain.model.enums.MediaStatus;
import com.hivecontrolsolutions.comestag.core.domain.port.*;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@UseCase
@RequiredArgsConstructor
public class EditSuccessStoryUseCase implements UsecaseWithoutOutput<UpdateSuccessStoryInput> {

    private final SuccessStoryPort successStoryPort;
    private final SuccessStoryMediaPort successStoryMediaPort;
    private final MediaPort mediaPort;
    private final HashtagPort hashtagPort;
    private final SuccessStoryHashtagPort successStoryHashtagPort;

    @Transactional
    @Override
    public void execute(UpdateSuccessStoryInput input) {
        SuccessStoryDm successStory = successStoryPort.getByOrgIdAndId(input.orgId(), input.successStoryId());

        Set<UUID> newMediaIds = input.newMediaIds() == null ? Set.of() : input.newMediaIds();
        Set<UUID> deletedMediaIds = input.deletedMediaIds() == null ? Set.of() : input.deletedMediaIds();
        Set<UUID> allMediaIds = Stream.concat(newMediaIds.stream(), deletedMediaIds.stream()).collect(Collectors.toSet());

        Set<Long> newHashtagIds = input.newHashtagIds() == null ? Set.of() : input.newHashtagIds();
        Set<Long> deletedHashtagIds = input.deletedHashtagIds() == null ? Set.of() : input.deletedHashtagIds();
        Set<Long> allHashtagIds = Stream.concat(newHashtagIds.stream(), deletedHashtagIds.stream()).collect(Collectors.toSet());

        if (!allMediaIds.isEmpty()) {
            Set<MediaDm> existingOrgMediaDms = mediaPort.getExistingIdsByOrgIdAndIdIn(input.orgId(), allMediaIds);
            var deletedMediaDms = existingOrgMediaDms.stream()
                    .filter(mediaDm ->
                            deletedMediaIds.contains(mediaDm.getId()) && MediaStatus.LINKED.equals(mediaDm.getStatus())
                    )
                    .collect(Collectors.toSet());
            var newMediaDms = existingOrgMediaDms.stream()
                    .filter(mediaDm ->
                            newMediaIds.contains(mediaDm.getId()) && MediaStatus.UNLINKED.equals(mediaDm.getStatus())
                    )
                    .collect(Collectors.toSet());
            if (!deletedMediaDms.isEmpty()) {
                successStoryMediaPort.deleteBySuccessStoryIdAndMediaIdIn(
                        successStory.getId(),
                        deletedMediaDms.stream().map(MediaDm::getId).collect(Collectors.toSet())
                );
            }

            if (!newMediaDms.isEmpty()) {
                successStoryMediaPort.create(
                        successStory.getId(),
                        newMediaDms.stream().map(MediaDm::getId).collect(Collectors.toSet())
                );
            }
        }

        if (!allHashtagIds.isEmpty()) {
            Set<HashtagDm> existingOrgHashtagDms = hashtagPort.getByIds(allHashtagIds);
            var deletedHashtagDms = existingOrgHashtagDms.stream()
                    .filter(hashtagDm -> deletedHashtagIds.contains(hashtagDm.getId()))
                    .collect(Collectors.toSet());
            var newHashtagDms = existingOrgHashtagDms.stream()
                    .filter(hashtagDm -> newHashtagIds.contains(hashtagDm.getId()))
                    .collect(Collectors.toSet());
            if (!deletedHashtagDms.isEmpty()) {
                successStoryHashtagPort.deleteBySuccessStoryIdAndHashtagIdIn(
                        successStory.getId(),
                        deletedHashtagDms.stream().map(HashtagDm::getId).collect(Collectors.toSet())
                );
            }

            if (!newHashtagDms.isEmpty()) {
                successStoryHashtagPort.create(
                        successStory.getId(),
                        newHashtagDms.stream().map(HashtagDm::getId).collect(Collectors.toSet())
                );
            }
        }


        successStoryPort.update(successStory.getId(),
                input.title() == null ? successStory.getTitle() : input.title(),
                input.body() == null ? successStory.getBody() : input.body());

    }
}
