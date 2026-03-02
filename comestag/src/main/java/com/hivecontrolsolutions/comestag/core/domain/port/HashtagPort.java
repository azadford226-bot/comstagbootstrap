package com.hivecontrolsolutions.comestag.core.domain.port;

import com.hivecontrolsolutions.comestag.core.domain.model.HashtagDm;

import java.util.Set;

public interface HashtagPort {
    Set<HashtagDm> getByIds(Set<Long> ids);

    // get all hashtags
    Set<HashtagDm> getAll();
}
