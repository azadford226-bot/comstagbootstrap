package com.hivecontrolsolutions.comestag.infrastructure.client;

import com.hivecontrolsolutions.comestag.base.stereotype.Client;
import com.hivecontrolsolutions.comestag.core.domain.port.FileStoragePort;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Client
@RequiredArgsConstructor
@Profile("local")
public class LocalFileStorageClient implements FileStoragePort {

    @Value("${media.dire.base}")
    private String baseDir;

    @Override
    public String store(UUID ownerAccountId, MultipartFile file, String fileDire) throws IOException {
        // 1) Create folder if not exists
        Path folder = Paths.get(baseDir, fileDire, ownerAccountId.toString());
        Files.createDirectories(folder);

        // 2) Generate file name
        String ext = guessExtension(file.getOriginalFilename());
        String filename = UUID.randomUUID() + (ext != null ? "." + ext : "");

        Path target = folder.resolve(filename);

        // 3) Save the file
        file.transferTo(target.toFile());

        // 4) Build public URL (served by WebConfig)
        // e.g. /baseDire/fileDire/<account-id>/<filename>
        return String.format("%s/%s/%s/%s", baseDir, fileDire, ownerAccountId, filename);
    }

    @Override
    public void delete(String storedPath) throws IOException {
        if (storedPath == null || storedPath.isBlank()) return;
        Path path = Paths.get(storedPath);
        Files.deleteIfExists(path);
    }

    @Override
    public Resource getImage(String fileDire) throws IOException {
        Path filePath = Paths.get(fileDire);
        return new UrlResource(filePath.toUri());
    }

    private String guessExtension(String originalName) {
        if (originalName == null) return null;
        int idx = originalName.lastIndexOf('.');
        if (idx == -1) return null;
        return originalName.substring(idx + 1);
    }
}
