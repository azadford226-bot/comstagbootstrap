package com.hivecontrolsolutions.comestag.entrypoint.web.notification;


import com.hivecontrolsolutions.comestag.base.stereotype.CurrentUserId;
import com.hivecontrolsolutions.comestag.core.application.entity.PageResult;
import com.hivecontrolsolutions.comestag.core.application.usecase.notification.*;
import com.hivecontrolsolutions.comestag.core.domain.model.NotificationSettingsDm;
import com.hivecontrolsolutions.comestag.core.domain.model.NotificationViewDm;
import com.hivecontrolsolutions.comestag.entrypoint.entity.notification.UpdateNotificationSettingsRequest;
import com.hivecontrolsolutions.comestag.entrypoint.stream.notification.NotificationSseRegistry;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.UUID;

@RestController
@RequestMapping("/v1/notifications")
@RequiredArgsConstructor
public class NotificationProcessor {

    private final ListMyNotificationsUseCase listUseCase;
    private final GetUnreadCountUseCase unreadCountUseCase;
    private final MarkNotificationReadUseCase markReadUseCase;
    private final MarkAllReadUseCase markAllReadUseCase;

    private final GetMyNotificationSettingsUseCase getSettingsUseCase;
    private final UpdateMyNotificationSettingsUseCase updateSettingsUseCase;

    private final NotificationSseRegistry sseRegistry;

    @PreAuthorize("hasAnyRole('CONSUMER','ORG') and hasAuthority('Profile_ACTIVE')")
    @GetMapping
    public ResponseEntity<PageResult<NotificationViewDm>> listMy(@CurrentUserId UUID currentUserId,
                                                                 @RequestParam(defaultValue = "0") int page,
                                                                 @RequestParam(defaultValue = "20") int size) {
        var result = listUseCase.execute(new ListMyNotificationsUseCase.Input(currentUserId, page, size));
        return ResponseEntity.ok(result);
    }

    @PreAuthorize("hasAnyRole('CONSUMER','ORG') and hasAuthority('Profile_ACTIVE')")
    @GetMapping("/unread-count")
    public ResponseEntity<?> unreadCount(@CurrentUserId UUID currentUserId) {
        var result=unreadCountUseCase.execute(currentUserId);
        return ResponseEntity.ok(result);
    }

    @PreAuthorize("hasAnyRole('CONSUMER','ORG') and hasAuthority('Profile_ACTIVE')")
    @PostMapping("/{id}/read")
    public ResponseEntity<?> markRead(@CurrentUserId UUID currentUserId, @PathVariable UUID id) {
        markReadUseCase.execute(new MarkNotificationReadUseCase.Input(currentUserId, id));
        return ResponseEntity.ok().build();

    }

    @PreAuthorize("hasAnyRole('CONSUMER','ORG') and hasAuthority('Profile_ACTIVE')")
    @PostMapping("/read-all")
    public ResponseEntity<?> markAllRead(@CurrentUserId UUID currentUserId) {
        markAllReadUseCase.execute(new MarkAllReadUseCase.Input(currentUserId));
        return ResponseEntity.ok().build();

    }

    // SSE
    @PreAuthorize("hasAnyRole('CONSUMER','ORG') and hasAuthority('Profile_ACTIVE')")
    @GetMapping(value = "/stream", produces = "text/event-stream")
    public SseEmitter stream(@CurrentUserId UUID currentUserId) {
        return sseRegistry.register(currentUserId);
    }

    // Settings
    @PreAuthorize("hasAnyRole('CONSUMER','ORG') and hasAuthority('Profile_ACTIVE')")
    @GetMapping("/settings")
    public ResponseEntity<NotificationSettingsDm> settings(@CurrentUserId UUID currentUserId) {
        var result = getSettingsUseCase.execute(currentUserId);
        return ResponseEntity.ok(result);
    }

    @PreAuthorize("hasAnyRole('CONSUMER','ORG') and hasAuthority('Profile_ACTIVE')")
    @PutMapping("/settings")
    public ResponseEntity<NotificationSettingsDm> updateSettings(@CurrentUserId UUID currentUserId, @RequestBody UpdateNotificationSettingsRequest req) {

        NotificationSettingsDm dm = NotificationSettingsDm.builder()
                .accountId(currentUserId)
                .inAppEnabled(req.inAppEnabled())
                .emailEnabled(req.emailEnabled())
                .smsEnabled(req.smsEnabled())
                .preferences(req.preferences())
                .build();

        var result = updateSettingsUseCase.execute(dm);
        return ResponseEntity.ok(result);
    }
}
