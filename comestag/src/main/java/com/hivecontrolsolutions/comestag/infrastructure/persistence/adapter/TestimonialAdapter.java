package com.hivecontrolsolutions.comestag.infrastructure.persistence.adapter;

import com.hivecontrolsolutions.comestag.base.core.error.exception.BusinessException;
import com.hivecontrolsolutions.comestag.base.stereotype.Adapter;
import com.hivecontrolsolutions.comestag.core.domain.model.TestimonialDm;
import com.hivecontrolsolutions.comestag.core.domain.model.TestimonialFilter;
import com.hivecontrolsolutions.comestag.core.domain.port.TestimonialPort;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.TestimonialEntity;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.repo.TestimonialRepository;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.spec.TestimonialSpecifications;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import static com.hivecontrolsolutions.comestag.base.core.error.entity.enums.InternalStatusError.TESTIMONIAL_CONFLICT;
import static com.hivecontrolsolutions.comestag.base.core.error.entity.enums.InternalStatusError.TESTIMONIAL_NOT_EXIST;

@Adapter
@RequiredArgsConstructor
public class TestimonialAdapter implements TestimonialPort {

    private final TestimonialRepository repository;

    @Override
    public TestimonialDm create(TestimonialDm d) {
        TestimonialDm createdTestimonial=null;
        try {
            createdTestimonial = repository.saveAndFlush(TestimonialEntity.fromDm(d)).toDm();
        }catch (Exception e){
            throw new BusinessException(TESTIMONIAL_CONFLICT);
        }
        return createdTestimonial;
    }

    @Override
    public TestimonialDm getById(UUID id) {
        return repository.findById(id)
                .map(TestimonialEntity::toDm)
                .orElseThrow(() -> new BusinessException(TESTIMONIAL_NOT_EXIST));
    }

    @Override
    public Page<TestimonialDm> pageByOrganizationId(UUID orgId,
                                                    TestimonialFilter filter,
                                                    int page,
                                                    int size) {
        var pageable = PageRequest.of(page, size, filter.toSort());
        return repository
                .findAll(TestimonialSpecifications.byOrganizationWithFilter(orgId, filter), pageable)
                .map(TestimonialEntity::toDm);
    }

    @Override
    public void update(UUID id, int rating, String comment) {
        repository.update(id, rating, comment);
    }

    @Override
    public void delete(UUID id) {
        repository.deleteById(id);
    }
}
