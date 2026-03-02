package com.hivecontrolsolutions.comestag.infrastructure.persistence.repo;

import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.HashtagEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

public interface HashtagRepository extends JpaRepository<HashtagEntity, UUID> {

    List<HashtagEntity> findByIdIn(Collection<Long> ids);

}
