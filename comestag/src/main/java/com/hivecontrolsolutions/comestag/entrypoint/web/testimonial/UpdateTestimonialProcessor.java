package com.hivecontrolsolutions.comestag.entrypoint.web.testimonial;

import com.hivecontrolsolutions.comestag.base.stereotype.CurrentUserId;
import com.hivecontrolsolutions.comestag.base.stereotype.Processor;
import com.hivecontrolsolutions.comestag.core.application.entity.input.UpdateTestimonialInput;
import com.hivecontrolsolutions.comestag.core.application.usecase.testimonial.UpdateTestimonialUseCase;
import com.hivecontrolsolutions.comestag.entrypoint.entity.testimonial.UpdateTestimonialRequest;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.UUID;

@Processor
@RequiredArgsConstructor
@RequestMapping("/v1/testimonial")
public class UpdateTestimonialProcessor {

    private final UpdateTestimonialUseCase useCase;

    @PreAuthorize("hasRole('CONSUMER') and hasAuthority('Profile_ACTIVE')")
    @PutMapping
    @Operation(summary = "Update testimonial",
            description = """
                    1. Update specific testimonial by id.
                    2. Only consumer have access to this endpoint.
                    3. Request code first.
                    """
    )
    public ResponseEntity<?> updateTestimonial(@CurrentUserId UUID userId,
                                               @Valid @RequestBody UpdateTestimonialRequest request) {
        useCase.execute(toInput(userId, request));
        return ResponseEntity.ok().build();
    }

    private UpdateTestimonialInput toInput(UUID userId, UpdateTestimonialRequest request) {
        return new UpdateTestimonialInput(request.testimonialId(), userId, request.rating(), request.comment(), request.code());
    }
}
