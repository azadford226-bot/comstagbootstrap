package com.hivecontrolsolutions.comestag.entrypoint.web.profile;

import com.hivecontrolsolutions.comestag.base.stereotype.Processor;
import com.hivecontrolsolutions.comestag.core.application.entity.input.ResetPasswordInput;
import com.hivecontrolsolutions.comestag.core.application.usecase.profile.ResetPasswordUseCase;
import com.hivecontrolsolutions.comestag.entrypoint.entity.profile.ProfileResetPasswordRequest;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@Processor
@RequiredArgsConstructor
@RequestMapping("/v1/profile")
public class ProfileResetPasswordProcessor {
    private final ResetPasswordUseCase resetPasswordUseCase;

    @PutMapping("/reset-pass")
    @PreAuthorize(
            "(hasRole('CONSUMER') and hasAuthority('Profile_ACTIVE')) " +
                    "or (hasRole('ORG') and (hasAuthority('Profile_ACTIVE') or hasAuthority('Profile_PENDING')))"
    )
    @Operation(summary = "Reset profile password",
            description = """
                    Reset password for the current user
                    """
    )
    public ResponseEntity<Void> resetPassword(@Valid @RequestBody ProfileResetPasswordRequest request) {
        resetPasswordUseCase.execute(toResetPassword(request));
        return ResponseEntity.ok().build();
    }

    private ResetPasswordInput toResetPassword(ProfileResetPasswordRequest request) {
        return new ResetPasswordInput(request.email(), request.newPassword(), request.oldPassword(), null);
    }
}
