package com.hivecontrolsolutions.comestag.core.application.entity;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record PrivateOrgProfileDro(Object userDetails) {

}
