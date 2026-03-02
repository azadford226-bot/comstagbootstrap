package com.hivecontrolsolutions.comestag.core.application.entity.input;

import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

public record UploadMediaInput(MultipartFile file, UUID userId, String fileDir) {
}
