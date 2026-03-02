package com.hivecontrolsolutions.comestag.core.domain.model;

import java.nio.file.Path;

public record EmailNotificationData(String to, String subject, String body, boolean isHtml, Path file) {
}
