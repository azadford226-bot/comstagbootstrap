-- Reference data for integration tests (Flyway is disabled under the test profile).
-- Registration references industries by id (org=1, consumer=2 in tests).
INSERT INTO industries (id, name, description, created_at, updated_at) VALUES
  (1, 'Technology', 'Technology sector', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (2, 'Finance', 'Finance sector', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
