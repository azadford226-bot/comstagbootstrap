package com.hivecontrolsolutions.comestag.entrypoint.stream.message;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@Component
public class MessageSseRegistry {

    private final ConcurrentHashMap<UUID, CopyOnWriteArrayList<SseEmitter>> emitters = new ConcurrentHashMap<>();

    public SseEmitter register(UUID accountId) {
        SseEmitter emitter = new SseEmitter(0L); // No timeout

        emitters.computeIfAbsent(accountId, k -> new CopyOnWriteArrayList<>()).add(emitter);

        emitter.onCompletion(() -> cleanup(accountId, emitter, null));
        emitter.onTimeout(() -> cleanup(accountId, emitter, null));
        emitter.onError(e -> cleanup(accountId, emitter, e));

        safeSend(accountId, emitter, "connected", "ok");

        return emitter;
    }

    public void emit(UUID accountId, String event, Object data) {
        var list = emitters.get(accountId);
        if (list == null || list.isEmpty()) return;

        for (SseEmitter emitter : list) {
            safeSend(accountId, emitter, event, data);
        }
    }

    public void heartbeatAll() {
        emitters.forEach((accountId, list) -> {
            if (list == null || list.isEmpty()) return;
            for (SseEmitter emitter : list) {
                safeSend(accountId, emitter, "heartbeat", "ping");
            }
        });
    }

    private void remove(UUID accountId, SseEmitter emitter) {
        var list = emitters.get(accountId);
        if (list == null) return;
        list.remove(emitter);
        if (list.isEmpty()) emitters.remove(accountId);
    }

    private void safeSend(UUID accountId, SseEmitter emitter, String event, Object data) {
        try {
            emitter.send(SseEmitter.event().name(event).data(data));
        } catch (IOException clientDisconnected) {
            // typical: broken pipe / client abort
            cleanup(accountId, emitter, clientDisconnected);
        } catch (IllegalStateException alreadyCompleted) {
            // emitter already completed
            cleanup(accountId, emitter, alreadyCompleted);
        } catch (Exception ex) {
            // any other unexpected sending error
            cleanup(accountId, emitter, ex);
        }
    }

    private void cleanup(UUID accountId, SseEmitter emitter, Throwable cause) {
        remove(accountId, emitter);

        // complete quietly (connection already gone)
        try {
            if (cause == null) {
                emitter.complete();
            } else {
                emitter.completeWithError(cause);
            }
        } catch (Exception ignored) {
            // ignore any follow-up errors (response is already committed, etc.)
        }
    }
}
