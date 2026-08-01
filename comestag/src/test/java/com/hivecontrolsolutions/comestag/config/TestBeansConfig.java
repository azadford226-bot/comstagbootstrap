package com.hivecontrolsolutions.comestag.config;

import com.hivecontrolsolutions.comestag.core.domain.model.EmailNotificationData;
import com.hivecontrolsolutions.comestag.core.domain.port.EmailSenderPort;
import com.hivecontrolsolutions.comestag.core.domain.port.FileStoragePort;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

/**
 * Provides no-op infrastructure beans for the {@code test} profile.
 *
 * <p>The production adapters are profile-restricted:
 * {@code EmailConfig} and {@code SupabaseStorageClient} are {@code stag}/{@code prod} only,
 * and {@code LocalFileStorageClient} is {@code local} only. Integration tests run under the
 * {@code test} profile, so these no-op beans satisfy the required ports and let the
 * Spring context load without external services.
 */
@Configuration
@Profile("test")
public class TestBeansConfig {

    @Bean
    @Primary
    public EmailSenderPort emailSenderPort() {
        return (EmailNotificationData data) -> {
            // no-op: emails are not sent during tests
        };
    }

    @Bean
    @Primary
    public FileStoragePort fileStoragePort() {
        return new FileStoragePort() {
            @Override
            public String store(UUID ownerAccountId, MultipartFile file, String fileDire) {
                return fileDire + "/" + ownerAccountId + "/test-file";
            }

            @Override
            public void delete(String storedPath) {
                // no-op
            }

            @Override
            public Resource getImage(String fileDire) {
                return null;
            }
        };
    }
}
