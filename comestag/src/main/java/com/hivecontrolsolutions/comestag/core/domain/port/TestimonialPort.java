package com.hivecontrolsolutions.comestag.core.domain.port;

import com.hivecontrolsolutions.comestag.core.domain.model.TestimonialDm;
import com.hivecontrolsolutions.comestag.core.domain.model.TestimonialFilter;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.UUID;

public interface TestimonialPort {
    TestimonialDm create(TestimonialDm d);

    TestimonialDm getById(UUID id);

    Page<TestimonialDm> pageByOrganizationId(UUID orgId,
                                             TestimonialFilter filter,
                                             int page,
                                             int size);

    void update(UUID id, int rating, String comment);

    void delete(UUID id);
}
