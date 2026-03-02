package com.hivecontrolsolutions.comestag.entrypoint.web.testimonial;

import com.hivecontrolsolutions.comestag.base.stereotype.CurrentUserId;
import com.hivecontrolsolutions.comestag.base.stereotype.Processor;
import com.hivecontrolsolutions.comestag.core.application.entity.PageResult;
import com.hivecontrolsolutions.comestag.core.domain.model.TestimonialFilter;
import com.hivecontrolsolutions.comestag.core.domain.model.enums.SortType;
import com.hivecontrolsolutions.comestag.core.domain.port.AccountPort;
import com.hivecontrolsolutions.comestag.core.domain.port.TestimonialPort;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.UUID;

@Processor
@RequiredArgsConstructor
@RequestMapping("/v1/testimonial")
public class ListTestimonialProcessor {

    private final AccountPort accountPort;
    private final TestimonialPort testimonialPort;

    @PreAuthorize("(hasRole('ORG') and (hasAuthority('Profile_ACTIVE') or hasAuthority('Profile_PENDING')))")
    @GetMapping("/my-list")
    @Operation(summary = "List testimonials of organization",
            description = """
                    1. List testimonials of current authenticated organization.
                    2. Only organization have access to this endpoint.
                    """
    )
    public ResponseEntity<?> listMyTestimonials(@CurrentUserId UUID currentUserId,
                                                @Min(0) @RequestParam(defaultValue = "0") int page,
                                                @Min(1) @Max(100) @RequestParam(defaultValue = "10") int size,
                                                @RequestParam(required = false) LocalDate createdFrom,
                                                @RequestParam(required = false) LocalDate createdTo,
                                                @RequestParam(required = false) Integer minRating,
                                                @RequestParam(required = false) Integer maxRating,
                                                @RequestParam(required = false) SortType sortType

    ) {
        var filter = createFilter(minRating, maxRating, createdFrom, createdTo, sortType);
        var responseBody = testimonialPort.pageByOrganizationId(currentUserId, filter, page, size);
        return ResponseEntity.ok( PageResult.of(responseBody));
    }

    @PreAuthorize("hasAnyRole('CONSUMER', 'ORG') and hasAuthority('Profile_ACTIVE')")
    @GetMapping("/list")
    @Operation(summary = "List testimonials of organization",
            description = """
                    1. List testimonials of specific organization.
                    2. Only active consumer and organization have access to this endpoint.
                    """
    )
    public ResponseEntity<?> listTestimonials(@RequestParam UUID orgId,
                                              @Min(0) @RequestParam(defaultValue = "0") int page,
                                              @Min(1) @Max(100) @RequestParam(defaultValue = "10") int size,
                                              @RequestParam(required = false) LocalDate createdFrom,
                                              @RequestParam(required = false) LocalDate createdTo,
                                              @RequestParam(required = false) Integer minRating,
                                              @RequestParam(required = false) Integer maxRating,
                                              @RequestParam(required = false) SortType sortType
    ) {
        var filter = createFilter(minRating, maxRating, createdFrom, createdTo, sortType);
        if (accountPort.isActive(orgId)) {
            var responseBody = testimonialPort.pageByOrganizationId(orgId, filter, page, size);
            return ResponseEntity.ok(PageResult.of(responseBody));
        }
        return ResponseEntity.badRequest().build();

    }

    private TestimonialFilter createFilter(
            Integer minRating,
            Integer maxRating,
            LocalDate createdFrom,
            LocalDate createdTo,
            SortType sortType
    ) {
        Instant createdFromInstant = null;
        Instant createdToInstant = null;

        if (createdFrom != null) {
            createdFromInstant = createdFrom.atStartOfDay().toInstant(ZoneOffset.UTC);
        }
        if (createdTo != null) {
            // end-of-day
            createdToInstant = createdTo.plusDays(1).atStartOfDay().toInstant(ZoneOffset.UTC);
        }

        return TestimonialFilter.builder()
                .minRating(minRating)
                .maxRating(maxRating)
                .createdFrom(createdFromInstant)
                .createdTo(createdToInstant)
                .sortType(sortType)
                .build();
    }

}
