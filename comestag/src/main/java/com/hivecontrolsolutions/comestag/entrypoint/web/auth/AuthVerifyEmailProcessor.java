package com.hivecontrolsolutions.comestag.entrypoint.web.auth;

import com.hivecontrolsolutions.comestag.base.stereotype.Processor;
import com.hivecontrolsolutions.comestag.core.application.entity.input.AuthVerifyOtpInput;
import com.hivecontrolsolutions.comestag.core.application.usecase.auth.AuthVerifyEmailUseCase;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.constraints.Pattern;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.UUID;

import static com.hivecontrolsolutions.comestag.core.constant.ProcessorConstant.IDENTIFIER;

@Processor
@Validated
@RequestMapping("/v1/auth")
@RequiredArgsConstructor
public class AuthVerifyEmailProcessor {

    private final AuthVerifyEmailUseCase verifyEmailUC;

    @PostMapping("/email-verify")
    @Operation(
            summary = "Verify email via magic link",
            description = """
                    1 .Use this endpoint to verify email via magic link.
                    2. It suppose that the email has been sent to the user.
                    3. The email should have url rout to webpage with param value
                       userid_code.
                    4. This code should give to this endpoint as identifier param.
                    5. There is no need to authenticate this endpoint.
                    """
    )
    public ResponseEntity<Void> verify(
            @RequestParam(name = IDENTIFIER)
            @Pattern(
                    regexp = "^(?i)[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}_\\d{6}$",
                    message = "identifier  not valid")
            String identifier
    ) {
        String userId = identifier.split("_")[0];
        String code = identifier.split("_")[1];
        verifyEmailUC.execute(toLoginInput(UUID.fromString(userId), code));
        return ResponseEntity.ok().build();
    }

    private AuthVerifyOtpInput toLoginInput(UUID userId, String code) {
        return new AuthVerifyOtpInput(userId, code);
    }

}
