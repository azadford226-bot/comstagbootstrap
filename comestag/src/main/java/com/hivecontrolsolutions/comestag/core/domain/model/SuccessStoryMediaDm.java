package com.hivecontrolsolutions.comestag.core.domain.model;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Setter
@Getter
@Builder
public class SuccessStoryMediaDm {
    private UUID successStoryId;
    private MediaDm media;

}
