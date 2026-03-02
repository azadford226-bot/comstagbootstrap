package com.hivecontrolsolutions.comestag.core.application.usecase.profile;

import com.hivecontrolsolutions.comestag.base.core.usecase.Usecase;
import com.hivecontrolsolutions.comestag.base.stereotype.UseCase;
import com.hivecontrolsolutions.comestag.core.application.entity.input.ResetPasswordInput;
import com.hivecontrolsolutions.comestag.core.application.service.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;


@UseCase
@RequiredArgsConstructor
public class ResetPasswordUseCase implements Usecase<ResetPasswordInput, Void> {
    private final AccountService accountService;

    @Transactional
    @Override
    public Void execute(ResetPasswordInput in) {
        if (in.verificationCode() != null)
            accountService.updatePasswordByCode(in.email(), in.newPassword(), in.verificationCode());
        else
            accountService.updatePasswordByOldPass(in.email(), in.oldPassword(), in.newPassword());
        return null;
    }
}
