# Admin System Documentation

## Overview
A comprehensive admin system has been created to manage the ComStag platform, including:
- Admin login with email verification
- Dashboard with statistics and reports
- Company approval functionality
- Contact message management
- User conversation monitoring

## Backend Components

### Database Migration (V5__admin_system.sql)
- Updated `accounts` table to support `ADMIN` account type
- Created `contact_messages` table to store contact form submissions
- Created default admin account:
  - Email: `admin@comstag.com`
  - Password: `Admin@123!`
  - Status: ACTIVE, Email Verified: true

### Admin Endpoints

#### `/v1/admin/stats` (GET)
- Returns dashboard statistics:
  - Total organizations, consumers, admins
  - Pending organizations count
  - Contact messages (total and unread)
  - Total conversations
- **Authorization**: Requires `ROLE_ADMIN`

#### `/v1/admin/organizations` (GET)
- Lists all organizations (paginated)
- **Authorization**: Requires `ROLE_ADMIN`

#### `/v1/admin/organizations/pending` (GET)
- Lists organizations awaiting approval
- **Authorization**: Requires `ROLE_ADMIN`

#### `/v1/admin/organizations/{orgId}/approve` (POST)
- Approves a pending organization
- **Authorization**: Requires `ROLE_ADMIN`

#### `/v1/admin/contact-messages` (GET)
- Lists contact form messages
- Query params: `page`, `unreadOnly` (boolean)
- **Authorization**: Requires `ROLE_ADMIN`

#### `/v1/admin/contact-messages/{messageId}/read` (POST)
- Marks a contact message as read
- **Authorization**: Requires `ROLE_ADMIN`

#### `/v1/admin/conversations` (GET)
- Lists all user conversations
- **Authorization**: Requires `ROLE_ADMIN`

### Contact Form Updates
- Contact form submissions are now stored in the database
- Admin receives email notifications for new contact messages
- Messages can be marked as read/unread in admin dashboard

## Frontend Components

### Admin Login (`/admin/login`)
- Admin-specific login page
- Uses same authentication flow as regular users (email + password + verification code)
- Redirects to `/admin/dashboard` on success

### Admin Dashboard (`/admin/dashboard`)
- Statistics cards showing:
  - Total users by type
  - Pending organizations
  - Unread contact messages
  - Total conversations
- Navigation to:
  - Company approvals
  - Contact messages
  - User conversations

### Company Approval Interface
- List of pending organizations
- View organization details
- Approve/reject functionality

### Contact Messages Interface
- List of all contact form submissions
- Filter by read/unread status
- Mark messages as read
- View message details

### Conversations Interface
- List of all user conversations
- View conversation participants
- Monitor platform communication

## Security

### Admin Role
- Admin accounts have type `ADMIN`
- All admin endpoints require `@PreAuthorize("hasRole('ADMIN')")`
- Admin accounts bypass organization approval requirements

### Default Admin Credentials
- **Email**: `admin@comstag.com`
- **Password**: `Admin@123!`
- **⚠️ IMPORTANT**: Change the default password in production!

## Usage

### First-Time Setup
1. Run database migration: `V5__admin_system.sql` will create the admin account
2. Login at `/admin/login` with default credentials
3. Change password immediately (via profile settings)

### Daily Operations
1. Login to admin dashboard
2. Review pending organizations and approve/reject
3. Monitor contact messages and respond as needed
4. Review user conversations for platform health

## API Client

Frontend API client is available at `lib/api/admin.ts` with functions:
- `getAdminStats()`
- `listOrganizations(page)`
- `listPendingOrganizations(page)`
- `approveOrganization(orgId)`
- `listContactMessages(page, unreadOnly)`
- `markContactMessageRead(messageId)`
- `listAllConversations(page)`

## Notes

- All contact form submissions are automatically stored and emailed to admin
- Organization approval is required before they can post content
- Admin can view all conversations for moderation purposes
- Statistics are calculated in real-time from the database
