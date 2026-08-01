package com.hivecontrolsolutions.comestag.infrastructure.client;

import com.hivecontrolsolutions.comestag.base.stereotype.Client;
import com.hivecontrolsolutions.comestag.core.domain.port.FileStoragePort;
import com.hivecontrolsolutions.comestag.infrastructure.config.S3StorageProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Profile;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.net.URI;
import java.util.UUID;

/**
 * S3-compatible storage client for DigitalOcean Spaces, AWS S3 and Cloudflare R2.
 * Enabled in stag/prod when {@code storage.provider=s3}.
 * <p>
 * {@link #store} returns the object key (path inside the bucket); the same key is
 * expected by {@link #delete} and {@link #getImage} (a full public URL is also accepted
 * and its {@code publicBaseUrl} prefix is stripped).
 */
@Client
@RequiredArgsConstructor
@Profile({"stag", "prod"})
@ConditionalOnProperty(prefix = "storage", name = "provider", havingValue = "s3")
public class S3StorageClient implements FileStoragePort {

    private final S3StorageProperties props;
    private volatile S3Client s3;

    private S3Client s3() {
        S3Client local = s3;
        if (local == null) {
            synchronized (this) {
                local = s3;
                if (local == null) {
                    var builder = S3Client.builder()
                            .region(Region.of(props.region()))
                            .credentialsProvider(StaticCredentialsProvider.create(
                                    AwsBasicCredentials.create(props.accessKey(), props.secretKey())));
                    if (props.endpoint() != null && !props.endpoint().isBlank()) {
                        builder.endpointOverride(URI.create(props.endpoint()));
                    }
                    if (props.pathStyleAccess()) {
                        builder.forcePathStyle(true);
                    }
                    s3 = local = builder.build();
                }
            }
        }
        return local;
    }

    @Override
    public String store(UUID ownerAccountId, MultipartFile file, String fileDire) throws IOException {
        String ext = guessExtension(file.getOriginalFilename());
        String filename = UUID.randomUUID() + (ext != null ? "." + ext : "");
        String objectKey = fileDire + "/" + ownerAccountId + "/" + filename;

        PutObjectRequest request = PutObjectRequest.builder()
                .bucket(props.bucket())
                .key(objectKey)
                .contentType(file.getContentType() != null ? file.getContentType() : "application/octet-stream")
                .build();

        s3().putObject(request, RequestBody.fromBytes(file.getBytes()));
        return objectKey;
    }

    @Override
    public void delete(String storedPath) {
        if (storedPath == null || storedPath.isBlank()) return;
        s3().deleteObject(DeleteObjectRequest.builder()
                .bucket(props.bucket())
                .key(stripPublicPrefix(storedPath))
                .build());
    }

    @Override
    public Resource getImage(String objectKey) {
        byte[] bytes = s3().getObjectAsBytes(GetObjectRequest.builder()
                        .bucket(props.bucket())
                        .key(stripPublicPrefix(objectKey))
                        .build())
                .asByteArray();
        return new ByteArrayResource(bytes);
    }

    private String stripPublicPrefix(String value) {
        String base = props.publicBaseUrl();
        if (base != null && !base.isBlank() && value.startsWith(base)) {
            String stripped = value.substring(base.length());
            return stripped.startsWith("/") ? stripped.substring(1) : stripped;
        }
        return value;
    }

    private String guessExtension(String originalName) {
        if (originalName == null) return null;
        int idx = originalName.lastIndexOf('.');
        if (idx == -1) return null;
        return originalName.substring(idx + 1);
    }
}
