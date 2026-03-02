package com.hivecontrolsolutions.comestag.entrypoint.entity.auth;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.*;
import org.hibernate.validator.constraints.URL;

import java.time.LocalDate;
import java.util.Set;

public record AuthRegisterConsRequest(

        @NotBlank(message = "Invalid name")
        String displayName,

        @NotNull(message = "Invalid industry") Long industryId,

        @NotEmpty(message = "Interests must not be empty")
        @Size(max = 20, message = "Invalid interests size")
        Set<@NotNull(message = "Interest cannot be blank") Long> interests,

        @NotBlank(message = "Invalid size")
        String size,

        @NotNull(message = "Established date is required")
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
        String password

) {
}

