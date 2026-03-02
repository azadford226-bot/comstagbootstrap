package com.hivecontrolsolutions.comestag.core.application.entity.input;

import java.util.UUID;

public record ListMyNotificationsInput(UUID accountId, int page, int size) {
}