package com.hivecontrolsolutions.comestag.entrypoint.stream.notification;

import com.hivecontrolsolutions.comestag.core.domain.port.OutboxPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import static com.hivecontrolsolutions.comestag.core.domain.model.enums.NotificationType.POST_COMMENTED;
import static com.hivecontrolsolutions.comestag.core.domain.model.enums.NotificationType.POST_REACTED;

@Component
@RequiredArgsConstructor
public class NotificationOutboxPublisher {

    private final OutboxPort outboxPort;

    public void publishPostCommented(UUID recipientAccountId, UUID actorAccountId, UUID postId, UUID commentId) {
        Map<String, Object> payload = basePayload(recipientAccountId, actorAccountId, "POST", postId);

        payload.put("payload", Map.of(
                "postId", postId.toString(),
                "commentId", commentId.toString()
        ));

        payload.put("dedupeKey",
                "POST_COMMENTED:" + postId + ":" + recipientAccountId + ":" + actorAccountId + ":" + commentId
        );

        outboxPort.enqueue(POST_COMMENTED.name(), payload);
    }

    public void publishPostReacted(UUID recipientAccountId, UUID actorAccountId, UUID postId, String reaction) {
        Map<String, Object> payload = basePayload(recipientAccountId, actorAccountId, "POST", postId);

        payload.put("payload", Map.of(
                "postId", postId.toString(),
                "reaction", reaction
        ));

        // Dedup: one reaction notification per (post, recipient, actor)
        payload.put("dedupeKey",
                "POST_REACTED:" + postId + ":" + recipientAccountId + ":" + actorAccountId
        );

        outboxPort.enqueue(POST_REACTED.name(), payload);
    }

    private static Map<String, Object> basePayload(UUID recipientAccountId, UUID actorAccountId, String targetKind, UUID targetId) {
        Map<String, Object> m = new HashMap<>();
        m.put("recipientAccountId", recipientAccountId.toString());
        m.put("actorAccountId", actorAccountId == null ? null : actorAccountId.toString());
        m.put("targetKind", targetKind);
        m.put("targetId", targetId == null ? null : targetId.toString());
        // "payload" and "dedupeKey" will be added by caller
        return m;
    }
}
