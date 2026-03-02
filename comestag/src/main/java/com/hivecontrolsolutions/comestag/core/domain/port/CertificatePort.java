package com.hivecontrolsolutions.comestag.core.domain.port;

import com.hivecontrolsolutions.comestag.core.domain.model.CertificateDm;
import org.springframework.data.domain.Page;

import java.time.LocalDate;
import java.util.UUID;

public interface CertificatePort {

    CertificateDm getById(UUID id);

    CertificateDm getByOrgIdAndId(UUID orgId, UUID id);

    CertificateDm create(UUID orgAccountId,
                         UUID imageId,
                         String title,
                         String body,
                         String link,
                         LocalDate certificateDate);

    int update(UUID certificateId,
               String title,
               String body,
               String link,
               LocalDate certificateDate,
               UUID imageIdOrNull);

    void delete(UUID certificateId, UUID orgAccountId);

    Page<CertificateDm> pageByOrganization(UUID orgId, int page, int size);
}