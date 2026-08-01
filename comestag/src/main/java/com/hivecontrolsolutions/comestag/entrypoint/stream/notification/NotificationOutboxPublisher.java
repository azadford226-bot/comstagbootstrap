package com.hivecontrolsolutions.comestag.entrypoint.stream.notification;

import com.hivecontrolsolutions.comestag.core.domain.port.OutboxPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import static com.hivecontrolsolutions.comestag.core.domain.model.enums.NotificationType.*;

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

    public void publishRfqNew(UUID recipientAccountId, UUID actorAccountId, UUID rfqId, String rfqTitle) {
        Map<String, Object> payload = basePayload(recipientAccountId, actorAccountId, "RFQ", rfqId);
        payload.put("payload", Map.of("rfqId", rfqId.toString(), "rfqTitle", rfqTitle == null ? "" : rfqTitle));
        payload.put("dedupeKey", "RFQ_NEW:" + rfqId + ":" + recipientAccountId);
        outboxPort.enqueue(RFQ_NEW.name(), payload);
    }

    public void publishRfqBid(UUID recipientAccountId, UUID actorAccountId, UUID rfqId) {
        Map<String, Object> payload = basePayload(recipientAccountId, actorAccountId, "RFQ", rfqId);
        payload.put("payload", Map.of("rfqId", rfqId.toString()));
        payload.put("dedupeKey", "RFQ_BID:" + rfqId + ":" + actorAccountId);
        outboxPort.enqueue(RFQ_BID.name(), payload);
    }

    public void publishRfqAwarded(UUID recipientAccountId, UUID actorAccountId, UUID rfqId) {
        Map<String, Object> payload = basePayload(recipientAccountId, actorAccountId, "RFQ", rfqId);
        payload.put("payload", Map.of("rfqId", rfqId.toString()));
        payload.put("dedupeKey", "RFQ_AWARDED:" + rfqId + ":" + recipientAccountId);
        outboxPort.enqueue(RFQ_AWARDED.name(), payload);
    }

    public void publishMessageNew(UUID recipientAccountId, UUID actorAccountId, UUID conversationId, UUID messageId) {
        Map<String, Object> payload = basePayload(recipientAccountId, actorAccountId, "CONVERSATION", conversationId);
        payload.put("payload", Map.of("conversationId", conversationId.toString(), "messageId", messageId.toString()));
        payload.put("dedupeKey", "MESSAGE_NEW:" + conversationId + ":" + messageId);
        outboxPort.enqueue(MESSAGE_NEW.name(), payload);
    }

    public void publishFollow(UUID recipientAccountId, UUID actorAccountId) {
        Map<String, Object> payload = basePayload(recipientAccountId, actorAccountId, "ACCOUNT", recipientAccountId);
        payload.put("payload", Map.of());
        payload.put("dedupeKey", "FOLLOW:" + actorAccountId + ":" + recipientAccountId);
        outboxPort.enqueue(FOLLOW.name(), payload);
    }

    public void publishOpportunityInterest(UUID recipientAccountId, UUID actorAccountId, UUID opportunityId) {
        Map<String, Object> payload = basePayload(recipientAccountId, actorAccountId, "OPPORTUNITY", opportunityId);
        payload.put("payload", Map.of("opportunityId", opportunityId.toString()));
        payload.put("dedupeKey", "OPPORTUNITY_INTEREST:" + opportunityId + ":" + actorAccountId);
        outboxPort.enqueue(OPPORTUNITY_INTEREST.name(), payload);
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
