package com.hivecontrolsolutions.comestag.infrastructure.persistence.adapter;

import com.hivecontrolsolutions.comestag.base.core.error.exception.BusinessException;
import com.hivecontrolsolutions.comestag.base.stereotype.Adapter;
import com.hivecontrolsolutions.comestag.core.domain.model.CertificateDm;
import com.hivecontrolsolutions.comestag.core.domain.port.CertificatePort;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.CertificateEntity;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.repo.CertificateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.UUID;

import static com.hivecontrolsolutions.comestag.base.core.error.entity.enums.InternalStatusError.CERTIFICATE_NOT_EXIST;

@Adapter
@RequiredArgsConstructor
public class CertificateAdapter implements CertificatePort {

    private final CertificateRepository repo;

    @Override
    public CertificateDm getById(UUID id) {
        return repo.findById(id)
                .orElseThrow(() -> new BusinessException(CERTIFICATE_NOT_EXIST))
                .toDm();
    }

    @Override
    public CertificateDm getByOrgIdAndId(UUID orgId, UUID id) {
        return repo.findByIdAndOrgId(id, orgId)
                .orElseThrow(() -> new BusinessException(CERTIFICATE_NOT_EXIST))
                .toDm();
    }

    @Override
    public CertificateDm create(UUID orgAccountId,
                                UUID imageId,
                                String title,
                                String body,
                                String link,
                                LocalDate certificateDate) {
        CertificateEntity e = CertificateEntity.builder()
                .orgId(orgAccountId)
                .imageId(imageId)
                .title(title)
                .body(body)
                .link(link)
                .certificateDate(certificateDate)
                .build();

        return repo.save(e).toDm();
    }

    @Override
    public int update(UUID certificateId,
                      String title,
                      String body,
                      String link,
                      LocalDate certificateDate,
                      UUID imageIdOrNull) {
        return repo.updateCertificate(
                certificateId,
                title,
                body,
                link,
                certificateDate,
                imageIdOrNull
        );
    }

    @Override
    @Transactional
    public void delete(UUID certificateId, UUID orgAccountId) {
        repo.deleteByIdAndOrgId(certificateId, orgAccountId);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CertificateDm> pageByOrganization(UUID orgId, int page, int size) {
        return repo.findByOrgId(orgId, PageRequest.of(page, size))
                .map(CertificateEntity::toDm);
    }
}