package com.hivecontrolsolutions.comestag.core.domain.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class HashtagDm {
    private Long id;
    private String name;
    @JsonIgnore
    private boolean custom;
}
