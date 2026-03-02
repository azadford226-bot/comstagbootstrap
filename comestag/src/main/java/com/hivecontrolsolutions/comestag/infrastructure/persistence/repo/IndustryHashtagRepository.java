package com.hivecontrolsolutions.comestag.infrastructure.persistence.repo;

import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.IndustryHashtagEntity;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.IndustryHashtagId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IndustryHashtagRepository
        extends JpaRepository<IndustryHashtagEntity, IndustryHashtagId> {
}