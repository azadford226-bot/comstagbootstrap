package com.hivecontrolsolutions.comestag.core.application.entity;

import org.springframework.core.io.Resource;

public record ViewImageOutput(String contentType, Resource image) {
}
