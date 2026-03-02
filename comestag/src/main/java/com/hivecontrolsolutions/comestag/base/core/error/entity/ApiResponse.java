package com.hivecontrolsolutions.comestag.base.core.error.entity;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ApiResponse<T> {
    private int statusCode;
    private String message;
    private T data;
    private String error;
}
