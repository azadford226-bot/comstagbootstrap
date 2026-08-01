package com.hivecontrolsolutions.comestag.core.domain.port;

import com.hivecontrolsolutions.comestag.core.domain.model.NotificationPreferenceDm;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface NotificationPreferencePort {
    Optional<NotificationPreferenceDm> findByAccountId(UUID accountId);
    List<NotificationPreferenceDm> findByEmailDigest(String digestFrequency);
}
