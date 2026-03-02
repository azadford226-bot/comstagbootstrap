package com.hivecontrolsolutions.comestag.base.core.error.entity;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.io.Serializable;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ErrorDetail(int status,
                          String errorMessage,
                          List fields) implements Serializable {
}
