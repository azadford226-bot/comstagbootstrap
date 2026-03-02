package com.hivecontrolsolutions.comestag.entrypoint.web.auth;

import com.hivecontrolsolutions.comestag.base.stereotype.Processor;
import com.hivecontrolsolutions.comestag.core.application.entity.input.RetryVerificationInput;
import com.hivecontrolsolutions.comestag.core.application.entity.input.RetryVerificationInput.VerificationType;
import com.hivecontrolsolutions.comestag.core.application.usecase.auth.AuthRetryVerificationUseCase;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import static org.springframework.http.HttpStatus.CREATED;

@Processor
@RequestMapping("/v1/auth")
public class AuthRequestVerificationCodeProcessor {
    private final AuthRetryVerificationUseCase useCase;

    public AuthRequestVerificationCodeProcessor(AuthRetryVerificationUseCase useCase) {
        this.useCase = useCase;
    }

    //Todo: to be changed next phase to meaningful name from retry-verification to request-code
    @PostMapping("/request-code")
    @Operation(
            summary = "Resend verification code or verification email",
            description = """
                    Use this endpoint to resend verification.
                    There is no need to authenticate this endpoint.

                    Request parameters:
                    - email: user email.
                    - verificationCode:
                        * \"CODE\"  -> resend verification code for login page.
                        * \"EMAIL\" -> resend verification email (email confirmation).
                    
                    Behavior:
                    - For CODE: sends a new 6-digit code for login.
                    - For EMAIL: resends the email verification message.
                    """
    )
    public ResponseEntity<?> retry(@RequestParam(required = false) String email,
                                   @RequestParam(required = false) String identifier,
                                         @RequestParam VerificationType verificationType) {
        return ResponseEntity.status(CREATED).body(useCase.execute(toRegisterInput(verificationType, email, identifier)));
    }

    private RetryVerificationInput toRegisterInput(VerificationType verificationType, String email, String identifier) {
        return new RetryVerificationInput(verificationType, email, identifier);
    }

}
