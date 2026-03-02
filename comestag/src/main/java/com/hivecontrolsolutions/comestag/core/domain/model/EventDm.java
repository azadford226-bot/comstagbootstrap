package com.hivecontrolsolutions.comestag.core.domain.model;

import com.hivecontrolsolutions.comestag.core.domain.model.enums.EventMode;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Builder
public class EventDm {

    private UUID id;
    private UUID orgId;

    private String title;
    private String body;

    private EventMode mode;

    private IndustryDm industry;

    private String country;
    private String state;
    private String city;
    private String address;

    private OffsetDateTime startAt;
    private OffsetDateTime endAt;

    private String onlineLink;

    private long viewers;
    private long registeredCount;

    private Instant createdAt;
    private Instant updatedAt;

    private List<MediaDm> media;
}