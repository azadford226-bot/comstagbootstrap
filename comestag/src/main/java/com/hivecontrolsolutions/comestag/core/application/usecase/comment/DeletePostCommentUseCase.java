package com.hivecontrolsolutions.comestag.core.application.usecase.comment;

import com.hivecontrolsolutions.comestag.base.core.usecase.UsecaseWithoutOutput;
import com.hivecontrolsolutions.comestag.base.stereotype.UseCase;
import com.hivecontrolsolutions.comestag.core.domain.port.PostCommentPort;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

@UseCase
@RequiredArgsConstructor
public class DeletePostCommentUseCase implements UsecaseWithoutOutput<DeletePostCommentUseCase.Input> {

    public record Input(java.util.UUID commentId, java.util.UUID accountId) {}

    private final PostCommentPort commentPort;

    @Override
    @Transactional
    public void execute(Input input) {
        commentPort.delete(input.commentId(), input.accountId());
    }
}
