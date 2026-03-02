package com.hivecontrolsolutions.comestag.core.application.usecase.post;

import com.hivecontrolsolutions.comestag.base.core.usecase.Usecase;
import com.hivecontrolsolutions.comestag.base.stereotype.UseCase;
import com.hivecontrolsolutions.comestag.core.application.entity.input.GetPostDetailsInput;
import com.hivecontrolsolutions.comestag.core.domain.model.PostDm;
import com.hivecontrolsolutions.comestag.core.domain.port.PostPort;
import lombok.RequiredArgsConstructor;

@UseCase
@RequiredArgsConstructor
public class GetPostDetailsUseCase implements Usecase<GetPostDetailsInput, PostDm> {

    private final PostPort postPort;

    @Override
    public PostDm execute(GetPostDetailsInput input) {
        var postDm = postPort.getById(input.postId());
        if (!input.currentUserId().equals(postDm.getOrgId()))
            postPort.increaseViewCount(input.postId());

        return postDm;
    }
}
