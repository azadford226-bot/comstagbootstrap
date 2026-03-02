package com.hivecontrolsolutions.comestag.core.domain.port;

import com.hivecontrolsolutions.comestag.core.domain.model.enums.EventRegistrationStatus;

import java.util.UUID;

public interface EventRegistrationPort {

    void register(UUID eventId, UUID accountId);

    void unregister(UUID eventId, UUID accountId);

    boolean exists(UUID eventId, UUID accountId, EventRegistrationStatus status);
}