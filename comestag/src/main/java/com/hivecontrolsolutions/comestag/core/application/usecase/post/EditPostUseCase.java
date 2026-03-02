package com.hivecontrolsolutions.comestag.core.application.usecase.post;

import com.hivecontrolsolutions.comestag.base.core.usecase.UsecaseWithoutOutput;
import com.hivecontrolsolutions.comestag.base.stereotype.UseCase;
import com.hivecontrolsolutions.comestag.core.application.entity.input.UpdatePostInput;
import com.hivecontrolsolutions.comestag.core.domain.model.MediaDm;
import com.hivecontrolsolutions.comestag.core.domain.model.PostDm;
import com.hivecontrolsolutions.comestag.core.domain.model.enums.MediaStatus;
import com.hivecontrolsolutions.comestag.core.domain.port.MediaPort;
import com.hivecontrolsolutions.comestag.core.domain.port.PostMediaPort;
import com.hivecontrolsolutions.comestag.core.domain.port.PostPort;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@UseCase
@RequiredArgsConstructor
public class EditPostUseCase implements UsecaseWithoutOutput<UpdatePostInput> {

    private final PostPort postPort;
    private final PostMediaPort postMediaPort;
    private final MediaPort mediaPort;

    @Transactional
    @Override
    public void execute(UpdatePostInput input) {

        PostDm post = postPort.getByOrgIdAndId(input.orgId(), input.postId());

        Set<UUID> newMediaIds = input.newMediaIds() == null ? Set.of() : input.newMediaIds();
        Set<UUID> deletedMediaIds = input.deletedMediaIds() == null ? Set.of() : input.deletedMediaIds();
        Set<UUID> allMediaIds = Stream.concat(newMediaIds.stream(), deletedMediaIds.stream())
                .collect(Collectors.toSet());

        if (!allMediaIds.isEmpty()) {
            var existingOrgMedia = mediaPort.getExistingIdsByOrgIdAndIdIn(input.orgId(), allMediaIds);

            var toDelete = existingOrgMedia.stream()
                    .filter(m -> deletedMediaIds.contains(m.getId()) && m.getStatus() == MediaStatus.LINKED)
                    .collect(Collectors.toSet());

            var toAdd = existingOrgMedia.stream()
                    .filter(m -> newMediaIds.contains(m.getId()) && m.getStatus() == MediaStatus.UNLINKED)
                    .collect(Collectors.toSet());

            if (!toDelete.isEmpty()) {
                postMediaPort.deleteByPostIdAndMediaIdIn(
                        post.getId(),
                        toDelete.stream().map(MediaDm::getId).collect(Collectors.toSet())
                );
            }

            if (!toAdd.isEmpty()) {
                postMediaPort.create(
                        post.getId(),
                        toAdd.stream().map(MediaDm::getId).collect(Collectors.toSet())
                );
            }
        }

        postPort.update(
                post.getId(),
                input.body() == null ? post.getBody() : input.body()
        );
    }
}
