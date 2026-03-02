package com.hivecontrolsolutions.comestag.core.application.entity.input;

import java.util.UUID;

public record GetPostDetailsInput (UUID currentUserId, UUID postId){
}
