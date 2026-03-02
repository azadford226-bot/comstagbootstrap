package com.hivecontrolsolutions.comestag.core.domain.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@Builder
public class IndustryDm {

    private Long id;
    private String name;
    @JsonIgnore
    private String description;
    @JsonIgnore
    private Instant createdAt;
    @JsonIgnore
    private Instant updatedAt;
}