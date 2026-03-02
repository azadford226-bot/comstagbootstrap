package com.hivecontrolsolutions.comestag.entrypoint.web.testimonial;

import com.hivecontrolsolutions.comestag.base.stereotype.CurrentUserId;
import com.hivecontrolsolutions.comestag.base.stereotype.CurrentUserName;
import com.hivecontrolsolutions.comestag.base.stereotype.Processor;
import com.hivecontrolsolutions.comestag.core.application.entity.input.CreateTestimonialInput;
import com.hivecontrolsolutions.comestag.core.application.usecase.testimonial.CreateTestimonialUseCase;
import com.hivecontrolsolutions.comestag.entrypoint.entity.testimonial.CreateTestimonialRequest;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.UUID;

@Processor
@RequiredArgsConstructor
@RequestMapping("/v1/testimonial")
public class CreateTestimonialProcessor {

    private final CreateTestimonialUseCase createTestimonialUseCase;

    @PreAuthorize("hasRole('CONSUMER') and hasAuthority('Profile_ACTIVE')")
    @PostMapping
    @Operation(summary = "Create testimonial",
            description = """
                    1. Create a testimonial for specific organization.
                    2. Request code first.
                    3. Only consumer have access to this endpoint.
                    """)
    public ResponseEntity<?> createTestimonial(@Valid @RequestBody CreateTestimonialRequest request,
                                               @CurrentUserId UUID userId,
                                               @CurrentUserName String userName
    ) {
        createTestimonialUseCase.execute(
                toInput(request, userId, userName)
        );

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    private CreateTestimonialInput toInput(CreateTestimonialRequest request, UUID userId, String userName) {
        return new CreateTestimonialInput(
                userId,
                userName,
                request.orgId(),
                request.rating(),
                request.comment(),
                request.verificationCode()
        );
    }
}
