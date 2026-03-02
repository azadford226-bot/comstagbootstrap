package com.hivecontrolsolutions.comestag.infrastructure.persistence.dao;


import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hivecontrolsolutions.comestag.core.domain.model.NotificationEnvelopeDm;
import com.hivecontrolsolutions.comestag.core.domain.model.NotificationViewDm;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Repository
@RequiredArgsConstructor
public class NotificationJdbcRepository {

    private final NamedParameterJdbcTemplate jdbc;
    private final ObjectMapper objectMapper;

    /**
     * Insert notification + recipient row.
     *
     * Dedup behavior:
     * - If env.dedupeKey != null -> ensure only 1 notification per (recipient, dedupeKey)
     * - Implementation avoids orphan notifications by inserting recipient first using a new UUID,
     *   and only inserting notifications if recipient insert happened (RETURNING).
     *
     * Returns Optional.empty() if dedupe prevented insertion.
     */
    public Optional<NotificationViewDm> insertInApp(NotificationEnvelopeDm env) {
        String payloadJson = toJson(env.payload() == null ? Map.of() : env.payload());

        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("notificationId", UUID.randomUUID())
                .addValue("recipient", env.recipientAccountId())
                .addValue("dedupeKey", (env.dedupeKey() == null || env.dedupeKey().isBlank()) ? null : env.dedupeKey())
                .addValue("type", env.type().name())
                .addValue("actor", env.actorAccountId())
                .addValue("targetKind", env.targetKind())
                .addValue("targetId", env.targetId())
                .addValue("payloadJson", payloadJson);

        // If dedupeKey is present -> do dedup insert
        if (params.getValue("dedupeKey") != null) {

            // 1) Try insert into notification_recipients with dedupe uniqueness
            //    If ON CONFLICT happens, it returns 0 rows -> we stop and return empty.
            // 2) If inserted, insert notifications using the same notificationId, return created notification view.
            String sql = """
                WITH ins_r AS (
                  INSERT INTO notification_recipients(notification_id, recipient_account_id, dedupe_key)
                  VALUES (:notificationId, :recipient, :dedupeKey)
                  ON CONFLICT (recipient_account_id, dedupe_key) DO NOTHING
                  RETURNING notification_id, recipient_account_id, created_at
                ),
                ins_n AS (
                  INSERT INTO notifications(id, type, actor_account_id, target_kind, target_id, payload)
                  SELECT :notificationId, :type, :actor, :targetKind, :targetId, CAST(:payloadJson AS jsonb)
                  FROM ins_r
                  RETURNING id, type, actor_account_id, target_kind, target_id, payload, created_at
                )
                SELECT
                  n.id                AS notification_id,
                  n.type              AS type,
                  n.created_at        AS created_at,
                  n.actor_account_id  AS actor_account_id,
                  n.target_kind       AS target_kind,
                  n.target_id         AS target_id,
                  n.payload::text     AS payload_json,
                  NULL::timestamptz   AS read_at
                FROM ins_n n
                """;

            List<NotificationViewDm> created = jdbc.query(sql, params, (rs, i) -> mapRow(rs));
            return created.stream().findFirst();
        }

        // No dedupeKey -> normal insert notification then recipient
        String sqlInsertN = """
            INSERT INTO notifications(id, type, actor_account_id, target_kind, target_id, payload)
            VALUES (:notificationId, :type, :actor, :targetKind, :targetId, CAST(:payloadJson AS jsonb))
            RETURNING
              id               AS notification_id,
              type             AS type,
              created_at       AS created_at,
              actor_account_id AS actor_account_id,
              target_kind      AS target_kind,
              target_id        AS target_id,
              payload::text    AS payload_json,
              NULL::timestamptz AS read_at
            """;

        NotificationViewDm created;
        try {
            created = jdbc.queryForObject(sqlInsertN, params, (rs, i) -> mapRow(rs));
        } catch (EmptyResultDataAccessException ex) {
            return Optional.empty();
        }

        String sqlInsertR = """
            INSERT INTO notification_recipients(notification_id, recipient_account_id, dedupe_key)
            VALUES (:notificationId, :recipient, NULL)
            """;
        jdbc.update(sqlInsertR, params);

        return Optional.of(created);
    }

    /**
     * Returns Page<NotificationViewDm> ordered by newest first.
     * Stable order: created_at DESC, id DESC
     */
    public Page<NotificationViewDm> listMyPage(UUID accountId, int page, int size) {
        int offset = page * size;

        String countSql = """
            SELECT count(*)
            FROM notification_recipients r
            WHERE r.recipient_account_id = :accountId
            """;
        long total = jdbc.queryForObject(countSql, Map.of("accountId", accountId), Long.class);

        String sql = """
            SELECT
              n.id                AS notification_id,
              n.type              AS type,
              n.created_at        AS created_at,
              n.actor_account_id  AS actor_account_id,
              n.target_kind       AS target_kind,
              n.target_id         AS target_id,
              n.payload::text     AS payload_json,
              r.read_at           AS read_at
            FROM notification_recipients r
            JOIN notifications n ON n.id = r.notification_id
            WHERE r.recipient_account_id = :accountId
            ORDER BY n.created_at DESC, n.id DESC
            LIMIT :limit OFFSET :offset
            """;

        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("accountId", accountId)
                .addValue("limit", size)
                .addValue("offset", offset);

        List<NotificationViewDm> items = jdbc.query(sql, params, (rs, i) -> mapRow(rs));

        return new PageImpl<>(items, PageRequest.of(page, size), total);
    }

    public long countUnread(UUID accountId) {
        String sql = """
            SELECT count(*)
            FROM notification_recipients
            WHERE recipient_account_id = :accountId
              AND read_at IS NULL
            """;
        return jdbc.queryForObject(sql, Map.of("accountId", accountId), Long.class);
    }

    public void markRead(UUID accountId, UUID notificationId, Instant readAt) {
        String sql = """
            UPDATE notification_recipients
            SET read_at = :readAt
            WHERE recipient_account_id = :accountId
              AND notification_id = :notificationId
              AND read_at IS NULL
            """;
        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("accountId", accountId)
                .addValue("notificationId", notificationId)
                .addValue("readAt", Timestamp.from(readAt));
        jdbc.update(sql, params);
    }

    public int markAllRead(UUID accountId, Instant readAt) {
        String sql = """
            UPDATE notification_recipients
            SET read_at = :readAt
            WHERE recipient_account_id = :accountId
              AND read_at IS NULL
            """;
        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("accountId", accountId)
                .addValue("readAt", Timestamp.from(readAt));
        return jdbc.update(sql, params);
    }

    // ---------------- helpers ----------------

    private NotificationViewDm mapRow(ResultSet rs) {
        try {
            Map<String, Object> payload = objectMapper.readValue(
                    rs.getString("payload_json"),
                    new TypeReference<Map<String, Object>>() {}
            );

            UUID actor = rs.getString("actor_account_id") == null ? null : UUID.fromString(rs.getString("actor_account_id"));
            UUID target = rs.getString("target_id") == null ? null : UUID.fromString(rs.getString("target_id"));

            Instant createdAt = rs.getTimestamp("created_at").toInstant();
            Instant readAt = rs.getTimestamp("read_at") == null ? null : rs.getTimestamp("read_at").toInstant();

            return NotificationViewDm.builder()
                    .notificationId(UUID.fromString(rs.getString("notification_id")))
                    .type(rs.getString("type"))
                    .createdAt(createdAt)
                    .actorAccountId(actor)
                    .targetKind(rs.getString("target_kind"))
                    .targetId(target)
                    .payload(payload)
                    .readAt(readAt)
                    .build();
        } catch (Exception e) {
            throw new RuntimeException("Failed to map notification row", e);
        }
    }

    private String toJson(Map<String, Object> map) {
        try {
            return objectMapper.writeValueAsString(map);
        } catch (Exception e) {
            throw new RuntimeException("Cannot serialize json", e);
        }
    }
}
