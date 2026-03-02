# Test Login Feature - Quick Access for Development

## Overview

The test login feature provides quick access to pre-configured test accounts for development and testing purposes. This eliminates the need to manually enter credentials during testing.

## Features

### 1. Quick Test Login Buttons

Both the company login and admin login pages now include quick login buttons that:
- Auto-fill test credentials
- Only appear in development mode
- Have a distinctive yellow styling for easy identification
- Include a lightning bolt icon for quick recognition

### 2. Development Mode Detection

The quick login feature is automatically enabled when either:
- `NODE_ENV=development` (default for Next.js dev server)
- `NEXT_PUBLIC_DEV_MODE=true` in your `.env.local` file

### 3. Visual Indicators

- **Button Color:** Yellow background with yellow border
- **Icon:** Lightning bolt (⚡) icon
- **Text:** Clear indication of test mode
- **Help Text:** Small gray text explaining it's development mode

## Test Accounts

### Test Company Account
- **Email:** testcompany@comstag.com
- **Password:** Test123!
- **Type:** Organization
- **Display Name:** Test Company Ltd
- **Status:** Pre-verified and approved
- **Location:** San Francisco, CA, USA

**Use this account to test:**
- Company dashboard features
- Event creation and management
- RFQ submission
- Profile editing
- Messaging
- Settings

### Test Admin Account
- **Email:** admin@comstag.com
- **Password:** Admin123!
- **Type:** Admin
- **Role:** Super Admin
- **Display Name:** Admin User
- **Status:** Active

**Use this account to test:**
- Admin dashboard
- User management
- Organization approvals
- Platform analytics
- System settings

## Setup Instructions

### Step 1: Generate Password Hashes

You need BCrypt hashes for the passwords. Use one of these methods:

#### Option A: Online Generator (Easiest)
1. Visit https://bcrypt-generator.com/
2. Enter password: `Test123!`
3. Set rounds to: `10`
4. Copy the generated hash
5. Repeat for `Admin123!`

#### Option B: Use Backend Tool
1. Navigate to `comestag` directory
2. Use the existing password encoder in your backend

### Step 2: Update SQL Script

1. Open `comestag/setup-test-accounts.sql`
2. Find the placeholder: `$2a$10$placeholder.replace.with.actual.bcrypt.hash`
3. Replace all three occurrences with your generated hashes:
   - Test company password hash
   - Test consumer password hash (same as company for simplicity)
   - Admin password hash

### Step 3: Run SQL Script

```bash
# Navigate to comestag directory
cd comestag

# Run the SQL script
psql -U postgres -d comestag -f setup-test-accounts.sql
```

Or use pgAdmin or another PostgreSQL client to run the script.

### Step 4: Verify Setup

```sql
SELECT email, user_type, verified, created_at 
FROM users 
WHERE email IN ('testcompany@comstag.com', 'admin@comstag.com')
ORDER BY email;
```

You should see both accounts listed with `verified = true`.

### Step 5: Enable Development Mode (if needed)

If you're not already running in development mode:

1. Create or edit `.env.local` in the frontend directory:
```bash
NEXT_PUBLIC_DEV_MODE=true
```

2. Restart your Next.js development server

## Usage

### For Company Testing

1. Navigate to http://localhost:3000/login
2. Look for the yellow "Quick Test Login (Test Company)" button
3. Click the button
4. The form will auto-fill with test credentials and submit
5. Check your email for the verification code (or check logs if email is disabled)
6. Enter the verification code to complete login

### For Admin Testing

1. Navigate to http://localhost:3000/admin/login
2. Look for the yellow "Quick Admin Login" button
3. Click the button
4. The form will auto-fill with admin credentials and submit
5. Enter the verification code to complete login

## Bypassing Email Verification (Optional)

If you want to completely bypass the verification code step during development:

1. Modify the backend to accept a special bypass code like "000000" for test accounts
2. Or disable email verification entirely in development
3. Or auto-approve login codes in the backend when in development mode

**Example Backend Modification:**
```java
// In your verification service
if (isDevelopmentMode() && code.equals("000000")) {
    return true; // Bypass verification
}
```

## Security Considerations

⚠️ **IMPORTANT SECURITY NOTES:**

1. **Never Deploy to Production:** These test accounts should NEVER be deployed to production
2. **Environment Check:** The quick login buttons only appear in development mode
3. **Remove Before Production:** 
   - Delete test accounts from production database
   - Remove test credentials from SQL scripts
   - Set `NEXT_PUBLIC_DEV_MODE=false` in production
4. **Gitignore:** Ensure `.env.local` is in `.gitignore` (it should be by default)

### Pre-Production Checklist

Before deploying to production:

- [ ] Remove test accounts from database
- [ ] Set `NEXT_PUBLIC_DEV_MODE=false` or remove entirely
- [ ] Verify quick login buttons don't appear
- [ ] Remove or comment out test credential constants in code
- [ ] Delete `setup-test-accounts.sql` from production server
- [ ] Clear any test data from database

## Troubleshooting

### Quick Login Button Not Appearing

**Problem:** Button doesn't show on login page

**Solutions:**
1. Check `NODE_ENV`: Run `echo $env:NODE_ENV` (PowerShell) or `echo $NODE_ENV` (bash)
2. Add to `.env.local`: `NEXT_PUBLIC_DEV_MODE=true`
3. Restart Next.js dev server: `npm run dev`
4. Clear browser cache and hard reload

### Login Fails After Clicking Quick Login

**Problem:** Error message appears after clicking button

**Solutions:**
1. Verify backend is running on http://localhost:3000
2. Check if test accounts exist in database:
   ```sql
   SELECT * FROM users WHERE email = 'testcompany@comstag.com';
   ```
3. Verify password hash in database matches BCrypt format
4. Check backend logs for error messages

### Verification Code Not Received

**Problem:** No verification code email received

**Solutions:**
1. Check backend email configuration
2. Look in backend logs for the verification code (often logged in development)
3. Check spam/junk folder
4. Use a test email service like Mailtrap for development
5. Consider implementing a bypass code for development

## Files Modified/Created

### Modified Files
- `frontend/components/organisms/login-form/index.tsx` - Added quick test login button
- `frontend/app/admin/login/page.tsx` - Added quick admin login button

### Created Files
- `setup-test-accounts.sql` - SQL script to create test accounts
- `setup-test-accounts.ps1` - PowerShell helper script
- `generate-bcrypt-hash.ps1` - BCrypt hash generator helper
- `TEST_LOGIN_FEATURE.md` - This documentation
- `TEST_CREDENTIALS.md` - Quick reference for test credentials

## Additional Test Data (Optional)

You may want to create additional test data:

### Sample Events
```sql
-- Create test events for the test company
INSERT INTO events (id, organization_id, title, description, event_date, location, created_at)
VALUES (
    gen_random_uuid(),
    (SELECT id FROM users WHERE email = 'testcompany@comstag.com'),
    'Test Product Launch',
    'Testing event creation and management',
    '2026-03-15 10:00:00',
    'San Francisco, CA',
    NOW()
);
```

### Sample RFQs
```sql
-- Create test RFQs
-- (Add similar INSERT statements based on your RFQ table structure)
```

## Next Steps

After setting up test accounts:

1. **Test All Features:** Use the test accounts to verify all dashboard features work
2. **Create Test Data:** Add sample events, RFQs, messages, etc.
3. **Document Workflows:** Note any issues or improvements needed
4. **Automate Testing:** Consider using these accounts in automated tests

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review backend logs for errors
3. Verify database connection and schema
4. Ensure all environment variables are set correctly

---

**Remember:** This is a development feature only. Always remove test accounts and disable dev mode before deploying to production! 🔒
