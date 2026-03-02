package com.hivecontrolsolutions.comestag.core.domain.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
@Builder
public class CertificateDm {

    private UUID id;
    @JsonIgnore
    private UUID orgId;

    private String title;
    private String body;
    private String link;

    private LocalDate certificateDate;
    private boolean verified;

    @JsonIgnore
    private Instant createdAt;
    private Instant updatedAt;

    private MediaDm image; // optional: full media info (if loaded)
}