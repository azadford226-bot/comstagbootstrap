package com.hivecontrolsolutions.comestag.infrastructure.persistence.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NotificationRecipientId implements Serializable {
    private UUID notificationId;
    private UUID recipientAccountId;
}