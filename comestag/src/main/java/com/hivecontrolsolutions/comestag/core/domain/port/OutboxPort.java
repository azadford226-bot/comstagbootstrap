package com.hivecontrolsolutions.comestag.core.domain.port;

import java.util.Map;

public interface OutboxPort {
    void enqueue(String eventType, Map<String, Object> payload);
}
