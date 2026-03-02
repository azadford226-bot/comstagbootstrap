package com.hivecontrolsolutions.comestag.entrypoint.web.profile;

import com.hivecontrolsolutions.comestag.base.stereotype.CurrentUserId;
import com.hivecontrolsolutions.comestag.base.stereotype.CurrentUserType;
import com.hivecontrolsolutions.comestag.base.stereotype.Processor;
import com.hivecontrolsolutions.comestag.core.application.entity.input.UploadProfileMediaInput;
import com.hivecontrolsolutions.comestag.core.application.usecase.profile.UpdateProfileMediaUseCase;
import com.hivecontrolsolutions.comestag.core.domain.model.enums.AccountType;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.UUID;

@Processor
@RequiredArgsConstructor
@RequestMapping("/v1/profile")
public class UpdateProfileMediaProcessor {

    private final UpdateProfileMediaUseCase useCase;

    @PreAuthorize(
            "(hasRole('CONSUMER') and hasAuthority('Profile_ACTIVE')) " +
                    "or (hasRole('ORG') and (hasAuthority('Profile_ACTIVE') or hasAuthority('Profile_PENDING')))"
    )
    @PutMapping(value = "/image")
    @Operation(summary = "Update profile image",
            description = """
                    1. Update the image of the current user.
                    2. Upload the image to the media first.
                    """)
    public ResponseEntity<?> uploadProfileImage(@RequestParam UUID mediaId,
                                                @CurrentUserId UUID userId,
                                                @CurrentUserType AccountType type) {

        useCase.execute(new UploadProfileMediaInput(userId, type, mediaId, "IMAGE"));
        return ResponseEntity.ok().build();
    }

    @PreAuthorize(
            "(hasRole('CONSUMER') and hasAuthority('Profile_ACTIVE')) " +
                    "or (hasRole('ORG') and (hasAuthority('Profile_ACTIVE') or hasAuthority('Profile_PENDING')))"
    )
    @PutMapping(value = "/cover")
    @Operation(summary = "Update profile cover",
            description = """
                    1. Update the cover of the current user.
                    2. Upload the image to the media first.
                    """)
    public ResponseEntity<?> uploadProfileCover(@RequestParam UUID mediaId,
                                                @CurrentUserId UUID userId,
                                                @CurrentUserType AccountType type) {
        useCase.execute(new UploadProfileMediaInput(userId, type, mediaId, "COVER"));
        return ResponseEntity.ok().build();
    }
}
