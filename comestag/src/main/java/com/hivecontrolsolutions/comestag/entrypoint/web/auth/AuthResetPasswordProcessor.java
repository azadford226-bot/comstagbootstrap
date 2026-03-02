package com.hivecontrolsolutions.comestag.entrypoint.web.auth;

import com.hivecontrolsolutions.comestag.base.stereotype.Processor;
import com.hivecontrolsolutions.comestag.core.application.entity.input.ResetPasswordInput;
import com.hivecontrolsolutions.comestag.core.application.usecase.profile.ResetPasswordUseCase;
import com.hivecontrolsolutions.comestag.entrypoint.entity.auth.AuthResetPasswordRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@Processor
@RequiredArgsConstructor
@RequestMapping("/v1/auth")
public class AuthResetPasswordProcessor {
    private final ResetPasswordUseCase resetPasswordUseCase;

    @PostMapping("/reset-pass")
    public ResponseEntity<Void> resetPassword(@Valid @RequestBody AuthResetPasswordRequest request) {
        resetPasswordUseCase.execute(toResetPassword(request));
        return ResponseEntity.ok().build();
    }

    private ResetPasswordInput toResetPassword(AuthResetPasswordRequest request) {
        return new ResetPasswordInput(request.email(), request.newPassword(), null, request.verificationCode());
    }

}
