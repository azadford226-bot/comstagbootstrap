package com.hivecontrolsolutions.comestag.core.domain.port;

import com.hivecontrolsolutions.comestag.core.domain.model.EmailNotificationData;

public interface EmailSenderPort {
    public void send(EmailNotificationData emailNotificationData);
}
