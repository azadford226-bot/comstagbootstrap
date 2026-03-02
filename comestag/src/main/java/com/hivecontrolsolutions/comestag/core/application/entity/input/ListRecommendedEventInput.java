package com.hivecontrolsolutions.comestag.core.application.entity.input;

import java.util.UUID;

public record ListRecommendedEventInput(UUID accountId, int page, int size) {
}
