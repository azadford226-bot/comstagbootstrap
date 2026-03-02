# Messages Backend Implementation - Setup Guide

## ✅ Completed Implementation

All backend components for the messaging system have been created:

### Database Migration
- **File**: `src/main/resources/db/migration/V4__messages_system.sql`
- Creates `conversations` and `messages` tables
- Includes indexes and triggers for automatic last message updates

### Domain Layer
- **Models**: `MessageDm.java`, `ConversationDm.java`
- **Ports**: `MessagePort.java`, `ConversationPort.java`

### Application Layer
- **Use Cases**:
  - `SendMessageUseCase.java` - Send messages and create conversations
  - `ListConversationsUseCase.java` - List user's conversations
  - `ListMessagesUseCase.java` - Get messages in a conversation
  - `MarkConversationReadUseCase.java` - Mark messages as read

### Infrastructure Layer
- **Entities**: `MessageEntity.java`, `ConversationEntity.java`
- **Repositories**: `MessageRepository.java`, `ConversationRepository.java`
- **Adapters**: `MessageAdapter.java`, `ConversationAdapter.java`

### API Layer
- **Processors** (REST Controllers):
  - `ListConversationsProcessor.java` - GET `/v1/messages/conversations`
  - `ListMessagesProcessor.java` - GET `/v1/messages/conversations/{id}/messages`
  - `SendMessageProcessor.java` - POST `/v1/messages/send`
  - `MarkConversationReadProcessor.java` - PUT `/v1/messages/conversations/{id}/read`

### Frontend Integration
- Frontend API functions updated to handle `PageResult` format from backend
- Endpoints match between frontend and backend

## 🗄️ Database Setup

### Option 1: Using psql (Recommended)

```bash
# Connect as postgres superuser
psql -U postgres

# Run these commands:
CREATE DATABASE comestag;
CREATE USER comestag WITH PASSWORD 'comestag';
GRANT ALL PRIVILEGES ON DATABASE comestag TO comestag;

# Connect to the new database
\c comestag

# Grant schema privileges
GRANT ALL ON SCHEMA public TO comestag;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO comestag;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO comestag;
```

### Option 2: Using SQL File

```bash
psql -U postgres -f create-database.sql
```

### Option 3: Using Docker

If PostgreSQL is running in Docker:

```bash
docker exec -it <postgres-container-name> psql -U postgres

# Then run the CREATE commands from Option 1
```

## 🚀 Running the Application

Once the database is set up:

1. **Build the application**:
   ```bash
   cd comestag
   mvn clean package
   ```

2. **Run the JAR**:
   ```bash
   java -jar target/comestag-0.0.1-SNAPSHOT.jar
   ```

3. **The application will**:
   - Automatically run Flyway migrations (including V4__messages_system.sql)
   - Start on port 8080
   - Frontend will be available at http://localhost:8080
   - API will be available at http://localhost:8080/v1
   - Swagger UI at http://localhost:8080/swagger-ui.html

## 📝 API Endpoints

### Conversations
- `GET /v1/messages/conversations` - List conversations (with optional search)
- `GET /v1/messages/conversations/{id}/messages` - Get messages in a conversation
- `PUT /v1/messages/conversations/{id}/read` - Mark conversation as read

### Messages
- `POST /v1/messages/send` - Send a message (creates conversation if needed)

## 🔍 Testing

1. **Start the backend** (after database setup)
2. **Frontend will automatically connect** when running in production mode
3. **Or test with dev mode** - frontend uses mock data when `NEXT_PUBLIC_DEV_MODE=true`

## ⚠️ Notes

- The frontend is configured to use relative paths, so it expects the backend on the same origin
- When running the unified JAR, everything is on `http://localhost:8080`
- The messages migration (V4) will run automatically when the application starts
- All endpoints require authentication (`Profile_ACTIVE` authority)
