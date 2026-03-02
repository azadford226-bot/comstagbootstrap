package com.hivecontrolsolutions.comestag.entrypoint.util;

import com.hivecontrolsolutions.comestag.base.core.error.exception.BusinessException;
import org.springframework.web.multipart.MultipartFile;

import java.util.Set;

import static com.hivecontrolsolutions.comestag.base.core.error.entity.enums.InternalStatusError.*;


public final class FileValidator {

    public static void validateImage(MultipartFile file, long maxFileSize, Set<String> allowedTypes) {
        if (file == null || file.isEmpty()) {
            throw new BusinessException(MEDIA_REQUIRED);
        }

        if (file.getSize() > maxFileSize) {
            throw new BusinessException(MEDIA_SIZE_TOO_LONG);
        }

        String contentType = file.getContentType();
        if (contentType == null || !allowedTypes.contains(contentType)) {
            throw new BusinessException(MEDIA_TYPE_NOT_SUPPORTED);
        }
    }
}
