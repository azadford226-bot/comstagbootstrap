package com.hivecontrolsolutions.comestag.entrypoint.web.testimonial;

import com.hivecontrolsolutions.comestag.base.stereotype.CurrentUserId;
import com.hivecontrolsolutions.comestag.base.stereotype.Processor;
import com.hivecontrolsolutions.comestag.core.application.entity.input.DeleteTestimonialInput;
import com.hivecontrolsolutions.comestag.core.application.usecase.testimonial.DeleteTestimonialUseCase;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.UUID;

@Processor
@RequiredArgsConstructor
@RequestMapping("/v1/testimonial")
public class DeleteTestimonialProcessor {

    private final DeleteTestimonialUseCase useCase;

    @PreAuthorize("hasRole('CONSUMER') and hasAuthority('Profile_ACTIVE')")
    @DeleteMapping("/{testimonialId}")
    @Operation(summary = "Delete testimonial",
            description = """
                    1. Delete specific testimonial by id.
                    2. Only consumer have access to this endpoint.
                    """
    )
    public ResponseEntity<?> deleteTestimonial(@CurrentUserId UUID userId,
                                               @PathVariable UUID testimonialId,
                                               @RequestParam String code) {
        useCase.execute(toInput(userId, testimonialId, code));
        return ResponseEntity.ok().build();
    }

    private DeleteTestimonialInput toInput(UUID userId, UUID testimonialId, String code) {
        return new DeleteTestimonialInput(testimonialId, userId, code);
    }
}
