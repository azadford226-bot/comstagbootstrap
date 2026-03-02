package com.hivecontrolsolutions.comestag.entrypoint.entity.home;


import com.hivecontrolsolutions.comestag.core.domain.model.HashtagDm;
import com.hivecontrolsolutions.comestag.core.domain.model.IndustryDm;

import java.util.Set;

public record HomeDynamicResponse(
        Set<IndustryDm> industries,
        Set<HashtagDm> hashtags,
        Set<String> sizes
) {
}
