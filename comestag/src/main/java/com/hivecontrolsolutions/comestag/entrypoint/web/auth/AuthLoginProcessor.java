package com.hivecontrolsolutions.comestag.entrypoint.web.auth;

import com.hivecontrolsolutions.comestag.base.stereotype.Processor;
import com.hivecontrolsolutions.comestag.core.application.entity.input.AuthLoginInput;
import com.hivecontrolsolutions.comestag.core.application.usecase.auth.AuthLoginUseCase;
import com.hivecontrolsolutions.comestag.entrypoint.entity.auth.AuthLoginRequest;
import com.hivecontrolsolutions.comestag.entrypoint.entity.auth.AuthLoginResponse;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import static org.springframework.http.HttpStatus.CREATED;

@Processor
@RequestMapping("/v1/auth")
@RequiredArgsConstructor
public class AuthLoginProcessor {


    private final AuthLoginUseCase loginUC;

    @PostMapping("/login")
    @Operation(
            summary = "Login with username/password",
            description = """
                    For regular users (ORGANIZATION, CONSUMER):
                    1. Send username and password.
                    2. If credentials are valid:
                       - The API returns the userId in the response.
                       - A 6-digit verification code is sent to the user's email.
                    3. The returned userId must be used later in the Verify Code endpoint
                       together with the 6-digit code received via email.
                    
                    For ADMIN users:
                    1. Send username and password.
                    2. If credentials are valid:
                       - The API returns accessToken and refreshToken directly.
                       - No verification code is needed.
                    4. There is no need to authenticate this endpoint.
                    """
    )
    public ResponseEntity<AuthLoginResponse> login(@RequestBody @Valid AuthLoginRequest in) {
        return ResponseEntity.status(CREATED).body(loginUC.execute(toLoginInput(in)));
    }

    private AuthLoginInput toLoginInput(AuthLoginRequest input) {
        return new AuthLoginInput(input.email(), input.password());
    }
}
