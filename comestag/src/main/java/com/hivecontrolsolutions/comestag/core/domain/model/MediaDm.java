package com.hivecontrolsolutions.comestag.core.domain.model;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.hivecontrolsolutions.comestag.core.domain.model.enums.MediaStatus;
import com.hivecontrolsolutions.comestag.core.domain.model.enums.MediaType;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@Builder
public class MediaDm {
    private UUID id;
    @JsonIgnore
    private UUID ownerAccountId;
    @JsonIgnore
    private String uri;
    @JsonIgnore
    private MediaStatus status;
    private MediaType mediaType;
    @JsonIgnore
    private Instant createdAt;
    @JsonIgnore
    private Instant updatedAt;

}
