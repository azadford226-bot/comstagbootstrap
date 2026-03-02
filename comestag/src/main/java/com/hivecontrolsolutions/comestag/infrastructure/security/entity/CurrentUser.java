package com.hivecontrolsolutions.comestag.infrastructure.security.entity;

import java.util.Set;
import java.util.UUID;

public record CurrentUser(
        UUID id,
        Set<String> roles
) {}
