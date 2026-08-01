package com.hivecontrolsolutions.comestag.core.application.usecase.reaction;

import com.hivecontrolsolutions.comestag.base.core.usecase.UsecaseWithoutOutput;
import com.hivecontrolsolutions.comestag.base.stereotype.UseCase;
import com.hivecontrolsolutions.comestag.core.application.entity.input.ReactToPostInput;
import com.hivecontrolsolutions.comestag.core.domain.port.PostPort;
import com.hivecontrolsolutions.comestag.core.domain.port.PostReactionPort;
import com.hivecontrolsolutions.comestag.entrypoint.stream.notification.NotificationOutboxPublisher;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

@UseCase
@RequiredArgsConstructor
public class ReactToPostUseCase implements UsecaseWithoutOutput<ReactToPostInput> {

    private final PostPort postPort;
    private final PostReactionPort reactionPort;
    private final NotificationOutboxPublisher notificationPublisher;

    @Transactional
    @Override
    public void execute(ReactToPostInput input) {
        var post = postPort.getById(input.postId());
        reactionPort.react(input.postId(), input.accountId(), input.reaction());
        // Notify post author (skip self-notification)
        if (post.getOrgId() != null && !post.getOrgId().equals(input.accountId())) {
            notificationPublisher.publishPostReacted(post.getOrgId(), input.accountId(), input.postId(), input.reaction().name());
        }
    }
}