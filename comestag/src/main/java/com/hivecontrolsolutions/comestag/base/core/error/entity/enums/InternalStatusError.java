package com.hivecontrolsolutions.comestag.base.core.error.entity.enums;

import lombok.Getter;
import org.springframework.http.HttpStatus;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import static org.springframework.http.HttpStatus.*;

@Getter
public enum InternalStatusError {

    INTERNAL_BAD_REQUEST(900, "Bad request", BAD_REQUEST),

    // ── Auth / Account lifecycle
    ACCOUNT_NOT_VERIFIED(1001, "Account is not verified", FORBIDDEN),
    ACCOUNT_LOCKED(1002, "Account is locked", FORBIDDEN),
    ACCOUNT_EXIST(1003, "Account already exist", CONFLICT),
    ACCOUNT_NOT_EXIST(1003, "Account not exist", NOT_FOUND),

    INVALID_CREDENTIALS(1012, "Invalid credentials", UNAUTHORIZED),
    PASSWORD_INVALID(1013, "Invalid password", UNAUTHORIZED),
    MFA_REQUIRED(1014, "Multi-factor authentication required", UNAUTHORIZED),
    TOKEN_EXPIRED(1015, "Token expired", UNAUTHORIZED),
    TOKEN_INVALID(1016, "Token is invalid", UNAUTHORIZED),

    VERIFY_CODE_INVALID(1020, "verification code is invalid", UNAUTHORIZED),
    VERIFY_CODE_LOCKED(1021, "Account is temporary locked try again later", UNAUTHORIZED),
    TESTIMONIAL_VERIFY_CODE_INVALID(1020, "Testimonial code is invalid", BAD_REQUEST),

    EMAIL_NOT_FOUND(1030, "Email is not exist", NOT_FOUND),
    ACCOUNT_EMAIL_NOT_VERIFIED(1031, "Email is not verified", UNAUTHORIZED),
    ACCOUNT_EMAIL_CHANGE_LOG_NOT_FOUND(1032, "Wrong Email restoration id", BAD_REQUEST),
    ACCOUNT_EMAIL_RESTORE_EXPIRED(1033, "You are not allowed to restore this email any more!. Please contact the support", UNAUTHORIZED),
    ACCOUNT_EMAIL_SAME(1034, "Same email without changes!", CONFLICT),
    ACCOUNT_EMAIL_ALREADY_VERIFIED(1035, "Email is already verified", CONFLICT),

    MEDIA_NOT_EXIST(1040, "Media not found", NOT_FOUND),
    MEDIA_COULD_NOT_UPLOAD(1041, "Couldn't upload media, try again later", INTERNAL_SERVER_ERROR),
    MEDIA_REQUIRED(1042, "Media file is required", UNSUPPORTED_MEDIA_TYPE),
    MEDIA_TYPE_NOT_SUPPORTED(1043, "Media type not supported", UNSUPPORTED_MEDIA_TYPE),
    MEDIA_SIZE_TOO_LONG(1044, "Media file size is too long", UNSUPPORTED_MEDIA_TYPE),
    MEDIA_ID_NOT_RELATED_ORG(1045, "Wrong media ids", BAD_REQUEST),

    RESOURCE_NOT_EXIST(1050, "Resource not found", NOT_FOUND),

    TESTIMONIAL_NOT_EXIST(1060, "Testimonial not found", NOT_FOUND),
    TESTIMONIAL_WRONG_CONSUMER(1061, "You are not allowed to edit this testimonial", FORBIDDEN),
    TESTIMONIAL_CONFLICT(1062, "You already added a testimonial before for this organization", CONFLICT),

    INDUSTRY_NOT_FOUND(1090, "Industry not found", NOT_FOUND),


    SUCCESS_STORY_NOT_EXIST(1070, "Success story not found", NOT_FOUND),

    CERTIFICATE_NOT_EXIST(1080, "Certificate not found", NOT_FOUND),
    EVENT_NOT_EXIST(1090, "Event not found", NOT_FOUND),

    // ── RFQ (Request for Quotation)
    RFQ_NOT_FOUND(1110, "RFQ not found", NOT_FOUND),
    RFQ_NOT_OPEN(1111, "RFQ is not open for proposals", BAD_REQUEST),
    RFQ_ACCESS_DENIED(1112, "You do not have access to this RFQ", FORBIDDEN),
    RFQ_NOT_OWNER(1113, "You are not the owner of this RFQ", FORBIDDEN),
    PROPOSAL_ALREADY_EXISTS(1114, "You have already submitted a proposal for this RFQ", CONFLICT),
    PROPOSAL_NOT_ALLOWED(1115, "You are not allowed to submit a proposal for this RFQ", FORBIDDEN),
    PROPOSAL_NOT_FOUND(1116, "Proposal not found", NOT_FOUND),

    // ── Access / Quotas
    PERMISSION_DENIED(1101, "You do not have permission", FORBIDDEN),
    RATE_LIMITED(1102, "Rate limit exceeded", TOO_MANY_REQUESTS),

    // ── Validation / Conflicts
    VALIDATION_FAILED(1201, "Request validation failed", BAD_REQUEST),
    DUPLICATE_REQUEST(1202, "Duplicate request", CONFLICT),
    CONFLICTING_OPERATION(1203, "Conflicting operation", CONFLICT),

    // ── Resources
    RESOURCE_NOT_FOUND(1301, "Requested resource was not found", NOT_FOUND),

    // ── System / Dependencies
    DEPENDENCY_FAILURE(1401, "Upstream dependency failed", BAD_GATEWAY),
    SERVICE_UNAVAILABLE(1402, "Service temporarily unavailable", HttpStatus.SERVICE_UNAVAILABLE),

    // ── Catch-all
    UNKNOWN_ERROR(1999, "Unknown error", INTERNAL_SERVER_ERROR);

    private final int code;
    private final String defaultMessage;
    private final HttpStatus httpStatus;

    InternalStatusError(int code, String defaultMessage, HttpStatus httpStatus) {
        this.code = code;
        this.defaultMessage = defaultMessage;
        this.httpStatus = httpStatus;
    }

    // Fast reverse lookup
    private static final Map<Integer, InternalStatusError> BY_CODE = new ConcurrentHashMap<>();

    static {
        for (var v : values()) BY_CODE.put(v.code, v);
    }

    public static InternalStatusError fromCode(int code) {
        return BY_CODE.getOrDefault(code, UNKNOWN_ERROR);
    }
}
