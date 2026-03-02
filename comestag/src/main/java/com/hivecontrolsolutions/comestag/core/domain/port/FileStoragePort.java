package com.hivecontrolsolutions.comestag.core.domain.port;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

public interface FileStoragePort {
    String store(UUID ownerAccountId,
                 MultipartFile file, String fileDire) throws IOException;

    void delete(String storedPath) throws IOException;

    Resource getImage(String fileDire) throws IOException;
}
