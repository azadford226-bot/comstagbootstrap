package com.hivecontrolsolutions.comestag.core.application.entity.input;

import java.util.UUID;

public record GetPublicProfileInput(UUID currentUserId, UUID targetUserId) {
}
