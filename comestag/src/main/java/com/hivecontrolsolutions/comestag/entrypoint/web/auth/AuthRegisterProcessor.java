package com.hivecontrolsolutions.comestag.entrypoint.web.auth;

import com.hivecontrolsolutions.comestag.base.stereotype.Processor;
import com.hivecontrolsolutions.comestag.core.application.entity.input.RegisterInput;
import com.hivecontrolsolutions.comestag.core.application.usecase.auth.AuthRegisterUseCase;
import com.hivecontrolsolutions.comestag.entrypoint.entity.auth.AuthRegisterConsRequest;
import com.hivecontrolsolutions.comestag.entrypoint.entity.auth.AuthRegisterOrgRequest;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import static com.hivecontrolsolutions.comestag.core.domain.model.enums.AccountType.CONSUMER;
import static com.hivecontrolsolutions.comestag.core.domain.model.enums.AccountType.ORG;
import static org.springframework.http.HttpStatus.CREATED;

@Processor
@RequestMapping("/v1/auth")
public class AuthRegisterProcessor {
    private final AuthRegisterUseCase useCase;

    public AuthRegisterProcessor(AuthRegisterUseCase useCase) {
        this.useCase = useCase;
    }

    @PostMapping("/register/org")
    @Operation(summary = "Register organization",
            description = """
                    Use this endpoint to register organization.
                    There is no need to authenticate this endpoint.
                    """
    )

    public ResponseEntity<?> registerOrg(@Valid @RequestBody AuthRegisterOrgRequest request) {
        useCase.execute(toRegisterInput(request));
        return ResponseEntity.status(CREATED).build();
    }

    @PostMapping("/register/cons")
    @Operation(summary = "Register consumer",
            description = """
                    Use this endpoint to register consumer
                    Interests values in request object will be hashtags ids
                    """
    )
    public ResponseEntity<Void> registerCons(@Valid @RequestBody AuthRegisterConsRequest request) {
        useCase.execute(toRegisterInput(request));
        return ResponseEntity.status(CREATED).build();
    }

    private RegisterInput toRegisterInput(AuthRegisterOrgRequest request) {
        return new RegisterInput(ORG, request.email(), request.password(), request.displayName(),
                request.industryId(), request.established(), request.size(), request.country(), request.state(),
                request.city(), request.website(), request.whoWeAre(), request.whatWeDo(), null);
    }

    private RegisterInput toRegisterInput(AuthRegisterConsRequest request) {
        return new RegisterInput(CONSUMER, request.email(), request.password(), request.displayName(),
                request.industryId(), request.established(), request.size(), request.country(), request.state(),
                request.city(), request.website(), null, null, request.interests());
    }
}
