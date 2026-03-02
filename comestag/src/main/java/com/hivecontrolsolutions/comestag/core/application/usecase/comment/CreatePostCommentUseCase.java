package com.hivecontrolsolutions.comestag.core.application.usecase.comment;

import com.hivecontrolsolutions.comestag.base.core.usecase.UsecaseWithoutOutput;
import com.hivecontrolsolutions.comestag.base.stereotype.UseCase;
import com.hivecontrolsolutions.comestag.core.application.entity.input.CreatePostCommentInput;
import com.hivecontrolsolutions.comestag.core.domain.port.PostCommentPort;
import com.hivecontrolsolutions.comestag.core.domain.port.PostPort;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

@UseCase
@RequiredArgsConstructor
public class CreatePostCommentUseCase implements UsecaseWithoutOutput<CreatePostCommentInput> {

    private final PostPort postPort;
    private final PostCommentPort commentPort;

    @Transactional
    @Override
    public void execute(CreatePostCommentInput input) {
        postPort.getById(input.postId());
        commentPort.create(input.postId(), input.accountId(), input.body(), input.parentCommentId());
    }
}
