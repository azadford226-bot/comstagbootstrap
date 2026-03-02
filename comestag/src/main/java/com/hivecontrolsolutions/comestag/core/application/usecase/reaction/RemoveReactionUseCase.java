package com.hivecontrolsolutions.comestag.core.application.usecase.reaction;

import com.hivecontrolsolutions.comestag.base.core.usecase.UsecaseWithoutOutput;
import com.hivecontrolsolutions.comestag.base.stereotype.UseCase;
import com.hivecontrolsolutions.comestag.core.domain.port.PostPort;
import com.hivecontrolsolutions.comestag.core.domain.port.PostReactionPort;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

@UseCase
@RequiredArgsConstructor
public class RemoveReactionUseCase implements UsecaseWithoutOutput<RemoveReactionUseCase.Input> {

    public record Input(java.util.UUID postId, java.util.UUID accountId) {}

    private final PostPort postPort;
    private final PostReactionPort reactionPort;

    @Override
    @Transactional
    public void execute(Input input) {
        postPort.getById(input.postId());
        reactionPort.removeReaction(input.postId(), input.accountId());
    }
}
