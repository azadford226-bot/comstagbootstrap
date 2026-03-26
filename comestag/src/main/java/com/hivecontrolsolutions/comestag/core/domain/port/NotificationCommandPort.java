package com.hivecontrolsolutions.comestag.core.domain.port;


import com.hivecontrolsolutions.comestag.core.domain.model.NotificationEnvelopeDm;
import com.hivecontrolsolutions.comestag.core.domain.model.NotificationViewDm;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

public interface NotificationCommandPort {

    Optional<NotificationViewDm> createInAppIfAllowedAndNotDuplicated(NotificationEnvelopeDm envelope);

    void markRead(UUID accountId, UUID notificationId, Instant readAt);

    int markAllRead(UUID accountId, Instant readAt);

    int archiveNotification(UUID accountId, UUID notificationId, Instant archivedAt);

    int archiveAllNotifications(UUID accountId, Instant archivedAt);

    int deleteNotification(UUID accountId, UUID notificationId);
}
