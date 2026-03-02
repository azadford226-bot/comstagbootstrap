package com.hivecontrolsolutions.comestag.core.application.usecase.post;

import com.hivecontrolsolutions.comestag.base.core.usecase.UsecaseWithoutOutput;
import com.hivecontrolsolutions.comestag.base.stereotype.UseCase;
import com.hivecontrolsolutions.comestag.core.application.entity.input.CreatePostInput;
import com.hivecontrolsolutions.comestag.core.domain.model.MediaDm;
import com.hivecontrolsolutions.comestag.core.domain.model.enums.MediaStatus;
import com.hivecontrolsolutions.comestag.core.domain.port.MediaPort;
import com.hivecontrolsolutions.comestag.core.domain.port.PostMediaPort;
import com.hivecontrolsolutions.comestag.core.domain.port.PostPort;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@UseCase
@RequiredArgsConstructor
public class CreatePostUseCase implements UsecaseWithoutOutput<CreatePostInput> {

    private final PostPort postPort;
    private final MediaPort mediaPort;
    private final PostMediaPort postMediaPort;

    @Transactional
    @Override
    public void execute(CreatePostInput input) {

        Set<UUID> mediaIds = input.mediaIds() == null ? Set.of() : input.mediaIds();

        // validate that media belong to org and are UNLINKED
        Set<UUID> existedMediaIds = mediaPort.getExistingIdsByOrgIdAndIdIn(input.orgId(), mediaIds)
                .stream()
                .filter(m -> m.getStatus() == MediaStatus.UNLINKED)
                .map(MediaDm::getId)
                .collect(Collectors.toSet());

        var post = postPort.create(input.orgId(), input.body());

        if (!existedMediaIds.isEmpty()) {
            postMediaPort.create(post.getId(), existedMediaIds);
        }
    }
}
