package com.hivecontrolsolutions.comestag.entrypoint.entity.auth;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.*;
import org.hibernate.validator.constraints.URL;

import java.time.LocalDate;

public record AuthRegisterOrgRequest(
        @NotBlank(message = "Invalid name") String displayName,

        @NotNull(message = "Invalid industry") Long industryId,

        @Size(max = 500, message = "who we are is too long") String whoWeAre,

        @Size(max = 500, message = "what we do is too long") String whatWeDo,

        @NotBlank(message = "Invalid size") String size,
        @NotNull
        @PastOrPresent(message = "Established date cannot be in the future")
        @JsonFormat(pattern = "yyyy-MM-dd")
        LocalDate established,

        @NotBlank(message = "Invalid website")
        @Size(max = 2048, message = "website is too long")
        @URL(message = "website must be a valid URL")
        @Pattern(regexp = "(?i)^https://.+", message = "website must start with https://")
        String website,

        @NotBlank(message = "Invalid country")
        String country,

        @Size(max = 100, message = "state is too long")
        @Pattern(regexp = "^[\\p{L} .'-]+$", message = "state must contain only letters and basic punctuation")
        String state,

        @NotBlank(message = "Invalid city")
        String city,

        @NotBlank(message = "Invalid email")
        @Email(message = "Invalid email")
        String email,

        @NotBlank(message = "Invalid password")
        @Size(min = 8, max = 128, message = "Password must be between 8 and 128 characters")
        String password

) {
}