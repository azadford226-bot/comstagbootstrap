package com.hivecontrolsolutions.comestag.base.core.error;

import com.hivecontrolsolutions.comestag.base.core.error.entity.ErrorDetail;
import com.hivecontrolsolutions.comestag.base.core.error.exception.BusinessException;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingRequestHeaderException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import static com.hivecontrolsolutions.comestag.base.core.error.entity.enums.InternalStatusError.MEDIA_SIZE_TOO_LONG;
import static com.hivecontrolsolutions.comestag.base.core.error.entity.enums.InternalStatusError.UNKNOWN_ERROR;
import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;
import static org.springframework.http.HttpStatus.UNSUPPORTED_MEDIA_TYPE;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MissingRequestHeaderException.class)
    public ResponseEntity<ProblemDetail> handleMissingHeader(MissingRequestHeaderException ex) {
        var pd = ProblemDetail.forStatus(BAD_REQUEST);
        pd.setTitle("Missing required header");
        pd.setDetail("Required header '" + ex.getHeaderName() + "' is not present.");
        pd.setProperty("header", ex.getHeaderName());
        log.error("MethodArgumentNotValidException: {}", ex.getMessage());
        return ResponseEntity.status(BAD_REQUEST).body(pd);
    }

    // e.g., invalid UUID in User-Id header
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ProblemDetail> handleTypeMismatch(MethodArgumentTypeMismatchException ex) {
        var pd = ProblemDetail.forStatus(BAD_REQUEST);
        pd.setTitle("Invalid parameter");
        pd.setDetail("Parameter '" + ex.getName() + "' has invalid value: " + ex.getValue());
        pd.setProperty("expectedType", ex.getRequiredType() != null ? ex.getRequiredType().getSimpleName() : "unknown");
        log.error("MethodArgumentNotValidException: {}", ex.getMessage());
        return ResponseEntity.status(BAD_REQUEST).body(pd);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ProblemDetail> handleConstraintViolation(ConstraintViolationException ex) {
        var pd = ProblemDetail.forStatus(BAD_REQUEST);
        pd.setTitle("Validation failed");
        pd.setDetail(ex.getMessage());
        log.error("MethodArgumentNotValidException: {}", ex.getConstraintViolations());

        return ResponseEntity.status(BAD_REQUEST).body(pd);
    }

    // Optional: binding errors on request bodies/DTOs
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ProblemDetail> handleMethodArgumentNotValid(MethodArgumentNotValidException ex) {
        var pd = ProblemDetail.forStatus(BAD_REQUEST);
        pd.setTitle("Validation failed");
        pd.setDetail(ex.getBindingResult().getAllErrors().stream()
                .findFirst().map(DefaultMessageSourceResolvable::getDefaultMessage).orElse("Invalid request"));
        log.error("MethodArgumentNotValidException: {}", ex.getDetailMessageArguments());
        return ResponseEntity.status(BAD_REQUEST).body(pd);
    }


    @ExceptionHandler(BusinessException.class)
    ResponseEntity<ErrorDetail> status(BusinessException ex) {
        var errorDetail = new ErrorDetail(
                ex.getInternalStatus().getCode(),
                ex.getInternalStatus().getDefaultMessage(),
                ex.getFields());
        log.error("BusinessException- {}", ex.getErrorMessage());
        return ResponseEntity.status(ex.getInternalStatus().getHttpStatus()).body(errorDetail);
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<ErrorDetail> handleMaxFileSize(MaxUploadSizeExceededException ex) {
        var errorDetail = new ErrorDetail(
                MEDIA_SIZE_TOO_LONG.getCode(),
                MEDIA_SIZE_TOO_LONG.getDefaultMessage(),
                null);
        log.error("MaxUploadSizeExceededException- {}", ex.getMessage());
        return ResponseEntity.status(UNSUPPORTED_MEDIA_TYPE).body(errorDetail);
    }

    /**
     * Catch-all handler for unexpected exceptions.
     * Prevents leaking sensitive information in production.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorDetail> handleUnexpectedException(Exception ex) {
        log.error("Unexpected exception occurred", ex);
        
        // In production, don't expose internal error details
        var errorDetail = new ErrorDetail(
                UNKNOWN_ERROR.getCode(),
                UNKNOWN_ERROR.getDefaultMessage(),
                null);
        
        return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(errorDetail);
    }
}