package com.hivecontrolsolutions.comestag.base.core.error.exception;

import com.hivecontrolsolutions.comestag.base.core.error.entity.enums.InternalStatusError;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

import static com.hivecontrolsolutions.comestag.base.core.error.entity.enums.InternalStatusError.UNKNOWN_ERROR;

@Getter
@Setter
public class BusinessException extends RuntimeException {
    private final InternalStatusError internalStatus;
    private final String errorMessage;
    private List<String> fields;

    public BusinessException(String message) {
        super(message);
        errorMessage = message;
        this.internalStatus = UNKNOWN_ERROR;
    }

    public BusinessException(String message, List<String> fields) {
        super(message);
        errorMessage = message;
        this.internalStatus = UNKNOWN_ERROR;
        this.fields = fields;
    }

    public BusinessException(InternalStatusError internalStatus) {
        super(internalStatus.getDefaultMessage());
        errorMessage = internalStatus.getDefaultMessage();
        this.internalStatus = internalStatus;
    }

    public BusinessException(InternalStatusError internalStatus, List<String> fields) {
        super(internalStatus.getDefaultMessage());
        errorMessage = internalStatus.getDefaultMessage();
        this.internalStatus = internalStatus;
        this.fields = fields;
    }

    public BusinessException(InternalStatusError internalStatus, String errorMessage) {
        super(errorMessage);
        this.internalStatus = internalStatus;
        this.errorMessage = errorMessage;
    }


    public BusinessException(InternalStatusError internalStatus, String errorMessage, List<String> fields) {
        super(errorMessage);
        this.internalStatus = internalStatus;
        this.errorMessage = errorMessage;
        this.fields = fields;
    }
}

