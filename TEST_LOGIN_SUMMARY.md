# Test Login Feature - Quick Access for Development

## ⚡ NEW: Quick Test Login Buttons (2026-02-08)

### What's New

Added quick login buttons to both company and admin login pages that auto-fill test credentials for faster testing!

**Features:**
- 🎯 One-click credential auto-fill
- ⚡ Lightning bolt icon for easy identification
- 🟨 Yellow styling to indicate test mode
- 🔒 Only visible in development mode
- 🚀 Speeds up testing workflow

---

## Quick Test Login Usage

## Quick Test Login Usage

### Company Login (`/login`)
1. Navigate to http://localhost:3000/login (or your frontend port)
2. Look for yellow "Quick Test Login (Test Company)" button
3. Click it to auto-fill test company credentials
4. Enter verification code when prompted

### Admin Login (`/admin/login`)
1. Navigate to http://localhost:3000/admin/login
2. Look for yellow "Quick Admin Login" button
3. Click it to auto-fill admin credentials
4. Enter verification code when prompted

### Enable Development Mode
The buttons automatically appear when:
- Running `npm run dev` (sets NODE_ENV=development)
- OR add to `.env.local`: `NEXT_PUBLIC_DEV_MODE=true`

---

## Test Account Setup Required

⚠️ **Before using quick login, you must set up test accounts in the database!**

### Setup Steps:

1. **Generate BCrypt password hashes:**
   - Visit https://bcrypt-generator.com/
   - Password: `Test123!` (for company)
   - Password: `Admin123!` (for admin)
   - Rounds: 10

2. **Update SQL script:**
   - Edit `comestag/setup-test-accounts.sql`
   - Replace placeholder hashes with generated ones

3. **Run SQL script:**
   ```bash
   cd comestag
   psql -U postgres -d comestag -f setup-test-accounts.sql
   ```

4. **Verify accounts:**
   ```sql
   SELECT email, user_type, verified FROM users 
   WHERE email IN ('testcompany@comstag.com', 'admin@comstag.com');
   ```

### Or Use Helper Script:
```bash
./setup-test-accounts.ps1
```

This will guide you through the setup process.

---

## Test Account Credentials

### New Test Company (for Quick Login)
```
Email:    testcompany@comstag.com
Password: Test123!
Type:     Organization
Status:   Pre-verified and approved
```

**Company Details:**
- Name: Test Company Ltd
- Industry: Technology
- Size: 50-200 employees
- Location: San Francisco, CA, USA
- Website: https://testcompany.example.com

### New Admin Account (for Quick Login)
```
Email:    admin@comstag.com
Password: Admin123!
Type:     Admin
Role:     Super Admin
Status:   Active
```

---

## Current Status (2026-02-08)

### ✅ Quick Login Feature Added
- Company login page has quick test button
- Admin login page has quick test button
- Only visible in development mode
- Auto-fills test credentials

### ⚠️ Backend Stability Issue
The backend keeps stopping unexpectedly. This needs investigation - likely a configuration or resource issue causing crashes.

---

## Admin Account

### Login Credentials:
```
Email:    admin@comstag.com
Password: password
```

### Access:
- **URL**: http://localhost:9090/admin/login
- **Dashboard URL**: http://localhost:9090/admin/dashboard

### Features:
- View statistics (companies, users, pending approvals, messages, conversations)
- Approve pending organization registrations
- Manage contact messages
- Real-time dashboard updates

### Notes:
- ✅ Admin login does NOT require email verification
- ✅ Password hash verified working in database
- ⚠️ Rate limiting: Wait 15 minutes after 5 failed attempts
- ⚠️ Current password is "password" (NOT "Admin@123!" - hash validation issues)

---

## Legacy Test Company Accounts (Still Valid)

These accounts were documented previously and can still be used:

### Company 1: Tech Solutions Inc

```
Email:    techsolutions@testcompany.com
Password: TestCompany123!
```

**Company Details:**
- Name: Tech Solutions Inc
- Industry: Software & IT Services (ID: 1)
- Established: May 15, 2018
- Size: 50-200 employees
- Location: San Francisco, California, United States
- Website: https://techsolutions-test.com

**Description:**
- Who We Are: Leading software development company specializing in enterprise solutions
- What We Do: End-to-end software development services (web, mobile, cloud, integration)

**Status:** ❌ Not yet registered

---

### Company 2: Digital Innovations LLC

```
Email:    digitalinnovations@testcompany.com
Password: TestCompany456!
```

**Company Details:**
- Name: Digital Innovations LLC
- Industry: SaaS & Cloud Platforms (ID: 2)
- Established: March 20, 2020
- Size: 10-50 employees
- Location: New York City, New York, United States
- Website: https://digitalinnovations-test.com

**Description:**
- Who We Are: Fast-growing SaaS company building innovative cloud-based solutions
- What We Do: SaaS platforms for project management, CRM, and business analytics

**Status:** ❌ Not yet registered

---

## How to Register Test Companies

### Method 1: Using PowerShell Script (Recommended)

```powershell
cd D:\comstag\fomregyptcomestag\comestag
.\register-test-companies.ps1
```

**Prerequisites:**
- Backend must be running on port 9090 (or 8080/8081)
- Database must be set up
- Script will auto-detect the backend port

### Method 2: Manual Registration via API

**Endpoint:** `POST http://localhost:9090/v1/auth/register/org`

**Company 1 Payload:**
```json
{
    "email": "techsolutions@testcompany.com",
    "password": "TestCompany123!",
    "displayName": "Tech Solutions Inc",
    "industryId": 1,
    "established": "2018-05-15",
    "size": "50-200",
    "country": "United States",
    "state": "California",
    "city": "San Francisco",
    "website": "https://techsolutions-test.com",
    "whoWeAre": "Tech Solutions Inc is a leading software development company specializing in enterprise solutions.",
    "whatWeDo": "We provide end-to-end software development services including web applications, mobile apps, and cloud solutions."
}
```

**Company 2 Payload:**
```json
{
    "email": "digitalinnovations@testcompany.com",
    "password": "TestCompany456!",
    "displayName": "Digital Innovations LLC",
    "industryId": 2,
    "established": "2020-03-20",
    "size": "10-50",
    "country": "United States",
    "state": "New York",
    "city": "New York City",
    "website": "https://digitalinnovations-test.com",
    "whoWeAre": "Digital Innovations LLC is a fast-growing SaaS company focused on building innovative cloud-based solutions.",
    "whatWeDo": "We develop and maintain SaaS platforms for project management, CRM, and business analytics."
}
```

---

## Email Verification

### ⚠️ Important: Email Verification Required for Organizations

Unlike admin accounts, **organization accounts REQUIRE email verification** before they can log in.

### Options to Verify:

#### Option 1: Check Application Logs
Since emails aren't configured, verification codes appear in the backend logs:
```
Look for: "Verification code for {email}: {6-digit-code}"
```

#### Option 2: Manual Database Verification (Quick Fix)

```sql
-- Find the account
SELECT id, email, email_verified FROM accounts 
WHERE email = 'techsolutions@testcompany.com';

-- Manually verify (replace {account_id} with actual UUID)
UPDATE accounts SET email_verified = TRUE 
WHERE id = '{account_id}';

-- Delete verification code requirement
DELETE FROM verification_code 
WHERE user_id = '{account_id}';
```

#### Option 3: Use Verification API
```
POST http://localhost:9090/v1/auth/email-verify
Body: {
    "email": "techsolutions@testcompany.com",
    "code": "123456"
}
```

---

## Files Created for Quick Login Feature

### Setup Files
- `comestag/setup-test-accounts.sql` - Database setup script
- `setup-test-accounts.ps1` - PowerShell setup helper
- `generate-bcrypt-hash.ps1` - BCrypt hash generator
- `TEST_LOGIN_FEATURE.md` - Detailed documentation
- `TEST_CREDENTIALS.md` - Quick reference (created by script)

### Modified Files
- `frontend/components/organisms/login-form/index.tsx` - Added quick test button
- `frontend/app/admin/login/page.tsx` - Added quick admin button

---

## Security Notes

⚠️ **Important Security Reminders:**

1. **Development Only:** Quick login buttons only appear in dev mode
2. **Never in Production:** Set `NEXT_PUBLIC_DEV_MODE=false` for production
3. **Remove Test Accounts:** Delete from production database
4. **Environment Variables:** Never commit `.env.local` with dev mode enabled

### Before Production Checklist:
- [ ] Remove test accounts from database
- [ ] Set `NEXT_PUBLIC_DEV_MODE=false` or remove entirely  
- [ ] Verify quick login buttons don't appear
- [ ] Delete setup SQL files from server
- [ ] Clear any test data

---

## Troubleshooting Quick Login

### Button Not Appearing?
1. Check: `echo $env:NODE_ENV` should be "development"
2. Or create `.env.local` with: `NEXT_PUBLIC_DEV_MODE=true`
3. Restart Next.js: `npm run dev`
4. Hard refresh browser: Ctrl+Shift+R

### Login Fails After Button Click?
1. Verify backend is running (check http://localhost:3000/actuator/health)
2. Check test accounts exist in database
3. Verify password hashes are BCrypt format
4. Check backend logs for errors

### Still Having Issues?
See detailed troubleshooting in `TEST_LOGIN_FEATURE.md`

---

## What Can Be Tested with Company Accounts

### 1. Authentication & Authorization
- ✅ Organization registration
- ✅ Email verification flow
- ✅ Login with credentials
- ✅ Password reset
- ✅ JWT token generation

### 2. Profile Management
- ✅ View organization profile
- ✅ Edit organization details
- ✅ Upload profile and cover images
- ✅ Update contact information

### 3. RFQ System (Request for Quotation)
- ✅ Create RFQs
- ✅ Browse available RFQs
- ✅ Submit proposals to RFQs
- ✅ Award RFQs to companies
- ✅ View RFQ details and submissions

### 4. Messaging System
- ✅ Send messages between companies
- ✅ Real-time messaging via Server-Sent Events
- ✅ Conversation management
- ✅ Message history
- ✅ Unread message counts

### 5. Posts & Social Features
- ✅ Create company posts
- ✅ Upload media files (images, videos)
- ✅ Manage media library
- ✅ Post reactions and comments
- ✅ Hashtag management

### 6. Events Management
- ✅ Create business events
- ✅ Register for events
- ✅ View event registrations
- ✅ Event media and details

### 7. Testimonials
- ✅ Write testimonials for other companies
- ✅ View received testimonials
- ✅ Rating system

### 8. Capabilities & Services
- ✅ Define company capabilities
- ✅ List services offered
- ✅ Searchable capability tags

### 9. Success Stories
- ✅ Share success stories
- ✅ Upload story media
- ✅ Hashtag categorization

---

## Database Quick Reference

### Check Registered Companies
```sql
SELECT 
    a.email,
    a.display_name,
    a.type,
    a.email_verified,
    a.status,
    o.display_name as org_name,
    o.approved,
    o.city,
    o.state
FROM accounts a
LEFT JOIN organizations o ON a.id = o.account_id
WHERE a.type = 'ORG'
ORDER BY a.created_at DESC;
```

### Approve Organization (Admin Action)
```sql
UPDATE organizations 
SET approved = TRUE 
WHERE account_id = (
    SELECT id FROM accounts WHERE email = 'techsolutions@testcompany.com'
);
```

### Check Verification Status
```sql
SELECT 
    u.id,
    u.email,
    u.email_verified,
    v.code_hash IS NOT NULL as has_verification_code,
    v.status as verification_status,
    v.expires_at
FROM accounts u
LEFT JOIN verification_code v ON u.id = v.user_id
WHERE u.email IN (
    'techsolutions@testcompany.com',
    'digitalinnovations@testcompany.com'
);
```

---

## Current Backend Issues

### Problem: Backend Keeps Stopping
**Symptoms:**
- Java process terminates unexpectedly
- Health check returns DOWN status
- No obvious errors in startup logs

**Possible Causes:**
1. Database connection pool exhaustion
2. Memory issues (insufficient heap)
3. Configuration errors in local profile
4. Port conflicts
5. Missing environment variables

**Temporary Solution:**
Restart backend manually:
```powershell
cd D:\comstag\fomregyptcomestag\comestag
.\start-backend.ps1
```

**Long-term Fix Needed:**
- Investigate application logs for errors
- Check system resources (memory, CPU)
- Review database connection settings
- Add health monitoring/auto-restart

---

## Port Configuration

### Current Setup:
- **Backend**: Port 9090 (local profile)
- **Frontend**: Integrated with backend (served on same port)
- **Database**: Port 5432 (PostgreSQL)

### Alternative Ports (from documentation):
- Port 8080: Production default
- Port 8081: Alternative local profile

---

## Quick Start Checklist

- [ ] 1. Ensure PostgreSQL is running
- [ ] 2. Start backend: `.\start-backend.ps1`
- [ ] 3. Wait 30-40 seconds for startup
- [ ] 4. Verify backend: http://localhost:9090/actuator/health
- [ ] 5. Register test companies: `.\register-test-companies.ps1`
- [ ] 6. Verify company emails (manual DB update or via API)
- [ ] 7. Login as admin to approve companies
- [ ] 8. Login as company to test features

---

## Contact & Support

For issues or questions:
1. Check `ADMIN_DASHBOARD_COMPLETE.md` for admin features
2. Check `TEST_COMPANIES.md` for detailed company setup
3. Review application logs in console output
4. Check database for verification codes and account status

---

## Last Updated
2026-02-08 01:45 UTC

**Status:** 
- ✅ Quick login feature added to both login pages
- ✅ Setup scripts and documentation created
- ⚠️ Test accounts need to be created in database (one-time setup)
- ⚠️ Backend stability issue (separate concern, unrelated to quick login)

**Next Steps:**
1. Run setup-test-accounts.ps1 to create test accounts
2. Try the quick login buttons
3. Test dashboard features with test accounts

---

## Additional Documentation

- **TEST_LOGIN_FEATURE.md** - Complete feature documentation
- **ADMIN_DASHBOARD_COMPLETE.md** - Admin dashboard features  
- **setup-test-accounts.sql** - Database setup script
