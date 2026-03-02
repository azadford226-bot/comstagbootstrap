package com.hivecontrolsolutions.comestag.core.application.entity.input;

import com.hivecontrolsolutions.comestag.core.domain.model.enums.AccountType;

import java.util.UUID;

public record UploadProfileMediaInput(UUID userId, AccountType accountType, UUID mediaId, String profileMediaType) {
}
