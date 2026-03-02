package com.hivecontrolsolutions.comestag.core.domain.port;

import com.hivecontrolsolutions.comestag.core.domain.model.IndustryDm;

import java.util.Set;

public interface IndustryPort {

    IndustryDm getById(Long id);

    Set<IndustryDm> getAll();
}