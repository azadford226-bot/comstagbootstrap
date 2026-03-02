package com.hivecontrolsolutions.comestag.core.application.entity.input;

import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

public record UploadMultipleMediaInput(UUID userId, List<MultipartFile> files, String fileDir) {
}
