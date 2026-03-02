package com.hivecontrolsolutions.comestag.infrastructure.client;

import com.hivecontrolsolutions.comestag.base.stereotype.Client;
import com.hivecontrolsolutions.comestag.core.domain.port.FileStoragePort;
import com.hivecontrolsolutions.comestag.infrastructure.config.SupabaseProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

import java.io.IOException;
import java.util.UUID;

@Client
@RequiredArgsConstructor
@Profile({"stag", "local", "prod"})
public class SupabaseStorageClient implements FileStoragePort {

    private final SupabaseProperties supabaseProperties;

    private WebClient webClient() {
        return WebClient.builder()
                .baseUrl(supabaseProperties.url() + "/storage/v1")
                .defaultHeader("apikey", supabaseProperties.serviceKey())
                .defaultHeader("Authorization", "Bearer " + supabaseProperties.serviceKey())
                .build();
    }

    @Override
    public String store(UUID ownerAccountId, MultipartFile file, String fileDire) throws IOException {
        String ext = guessExtension(file.getOriginalFilename());
        String filename = UUID.randomUUID() + (ext != null ? "." + ext : "");

        // path inside bucket: profile/image/<account-id>/<filename>
        String objectPath = fileDire + "/" + ownerAccountId + "/" + filename;

        MultipartBodyBuilder bodyBuilder = new MultipartBodyBuilder();
        bodyBuilder.part("file", file.getBytes())
                .filename(filename)
                .header(HttpHeaders.CONTENT_TYPE,
                        file.getContentType() != null
                                ? file.getContentType()
                                : MediaType.APPLICATION_OCTET_STREAM_VALUE);

        WebClient client = webClient();

        client.post()
                .uri(uriBuilder -> uriBuilder
                        .path("/object/{bucket}/{path}")
                        .build(supabaseProperties.storage().bucket(), objectPath))
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .body(BodyInserters.fromMultipartData(bodyBuilder.build()))
                .retrieve()
                .bodyToMono(String.class)
                .block();

        // Build public URL (for public bucket)
        String publicUrl = String.format(
                "%s/%s/%s",
                supabaseProperties.storage().publicBaseUrl(),
                supabaseProperties.storage().bucket(),
                objectPath
        );

        return objectPath;
    }

    @Override
    public void delete(String storedPath) throws IOException {
        if (storedPath == null || storedPath.isBlank()) {
            return;
        }

        String publicPrefix = String.format("%s/%s/",
                supabaseProperties.storage().publicBaseUrl(),
                supabaseProperties.storage().bucket());

        if (!storedPath.startsWith(publicPrefix)) {
            return;
        }

        String objectPath = storedPath.substring(publicPrefix.length());

        WebClient client = webClient();
        client.delete()
                .uri(uriBuilder -> uriBuilder
                        .path("/object/{bucket}/{path}")
                        .build(supabaseProperties.storage().bucket(), objectPath))
                .retrieve()
                .bodyToMono(Void.class)
                .block();
    }

    @Override
    public Resource getImage(String objectPath) throws IOException {
        // objectPath: profile/image/<accountId>/<filename>.png

        WebClient client = webClient();

        byte[] bytes = client.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/object/{bucket}/{path}")
                        .build(supabaseProperties.storage().bucket(), objectPath))
                .retrieve()
                .bodyToMono(byte[].class)
                .block();

        return new ByteArrayResource(bytes);
    }


    private String guessExtension(String originalName) {
        if (originalName == null) return null;
        int idx = originalName.lastIndexOf('.');
        if (idx == -1) return null;
        return originalName.substring(idx + 1);
    }
}
