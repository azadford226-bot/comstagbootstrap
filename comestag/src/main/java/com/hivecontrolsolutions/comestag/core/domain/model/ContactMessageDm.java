package com.hivecontrolsolutions.comestag.core.domain.model;

import lombok.Builder;
import lombok.Getter;

import java.time.Instant;
import java.util.UUID;

@Getter
@Builder
public class ContactMessageDm {
    private UUID id;
    private String name;
    private String email;
    private String subject;
    private String message;
    private boolean read;
    private Instant createdAt;
    private Instant updatedAt;
}
