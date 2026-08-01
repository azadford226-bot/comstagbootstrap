package com.hivecontrolsolutions.comestag.core.domain.port;


import com.hivecontrolsolutions.comestag.core.application.entity.PageResult;
import com.hivecontrolsolutions.comestag.core.domain.model.NotificationViewDm;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public interface NotificationQueryPort {

    PageResult<NotificationViewDm> listMy(UUID accountId, int page, int size);

    long countUnread(UUID accountId);

    List<NotificationViewDm> listUnreadSince(UUID accountId, Instant since);
}
