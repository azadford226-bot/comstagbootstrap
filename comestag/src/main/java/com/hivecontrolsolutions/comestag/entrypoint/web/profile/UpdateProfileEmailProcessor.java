package com.hivecontrolsolutions.comestag.entrypoint.web.profile;

import com.hivecontrolsolutions.comestag.base.stereotype.CurrentUserId;
import com.hivecontrolsolutions.comestag.base.stereotype.Processor;
import com.hivecontrolsolutions.comestag.core.application.entity.input.UpdateEmailInput;
import com.hivecontrolsolutions.comestag.core.application.usecase.profile.UpdateProfileEmailUseCase;
import com.hivecontrolsolutions.comestag.entrypoint.entity.profile.UpdateEmailRequest;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.UUID;

@Processor
@RequiredArgsConstructor
@RequestMapping("/v1/profile")
public class UpdateProfileEmailProcessor {

    private final UpdateProfileEmailUseCase useCase;

    @PreAuthorize(
            "(hasRole('CONSUMER') and hasAuthority('Profile_ACTIVE')) " +
                    "or (hasRole('ORG') and (hasAuthority('Profile_ACTIVE') or hasAuthority('Profile_PENDING')))"
    )
    @PutMapping("/email")
    @Operation(summary = "Update profile email",
            description = """
                    1. Update the email of the current user.
                    2. Send a verification code to the new email first.
                    """)
    public void updateEmail(@CurrentUserId UUID currentUserId,
                            @Valid @RequestBody UpdateEmailRequest input) {
        useCase.execute(toInput(currentUserId, input));
    }

    private UpdateEmailInput toInput(UUID currentUserId, UpdateEmailRequest input) {
        return new UpdateEmailInput(currentUserId, input.newEmail(), input.verificationCode());
    }
}