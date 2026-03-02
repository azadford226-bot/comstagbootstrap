# Email Verification Troubleshooting Guide

## Problem: "Email is not verified" but verification email was not sent

This happens when:
1. Email service is not configured (MAIL_USERNAME/MAIL_PASSWORD not set or incorrect)
2. Email sending fails silently (async errors may not be visible)
3. Account is created but email verification never happens

## Quick Solutions

### Solution 1: Check Backend Logs

The backend now logs email sending attempts and errors. Check your backend logs for:

```
Attempting to send email to: your-email@example.com
Failed to send email to: ...
Email service may not be configured. Check MAIL_USERNAME and MAIL_PASSWORD environment variables.
```

**To check logs:**
- If running in terminal, look for email-related errors
- If running as a service, check log files (usually `backend-error.log` or `backend-output.log`)

### Solution 2: Manually Verify Email (For Testing)

Use the SQL script to manually verify your email:

1. Connect to your PostgreSQL database:
```bash
psql -U comestag -d comestag
```

2. Run the verification script:
```sql
-- Replace 'your-email@example.com' with your actual email
UPDATE accounts 
SET email_verified = TRUE 
WHERE email = 'your-email@example.com';
```

3. Verify it worked:
```sql
SELECT id, email, email_verified, display_name, type, status 
FROM accounts 
WHERE email = 'your-email@example.com';
```

You should see `email_verified = true`.

### Solution 3: Resend Verification Email

If email service is now configured, you can resend the verification email:

**Option A: Via Frontend**
1. Go to `/verify-email` page
2. Enter your email
3. Click "Resend Verification Email"

**Option B: Via API**
```bash
curl -X POST http://localhost:3000/v1/auth/request-code \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-email@example.com",
    "verificationType": "EMAIL"
  }'
```

### Solution 4: Configure Email Service

#### For Local Development (Gmail)

1. **Create a Gmail App Password:**
   - Go to https://myaccount.google.com/apppasswords
   - Generate an app password for "Mail"
   - Copy the 16-character password

2. **Set Environment Variables:**
```bash
# Windows PowerShell
$env:MAIL_HOST = "smtp.gmail.com"
$env:MAIL_PORT = "587"
$env:MAIL_USERNAME = "your-email@gmail.com"
$env:MAIL_PASSWORD = "your-16-char-app-password"
$env:MAIL_FROM = "your-email@gmail.com"
$env:MAIL_FROM_NAME = "Comestag"

# Linux/Mac
export MAIL_HOST=smtp.gmail.com
export MAIL_PORT=587
export MAIL_USERNAME=your-email@gmail.com
export MAIL_PASSWORD=your-16-char-app-password
export MAIL_FROM=your-email@gmail.com
export MAIL_FROM_NAME=Comestag
```

3. **Restart Backend:**
   - Stop the backend
   - Start it again with the new environment variables

#### For Production (SendGrid)

1. **Get SendGrid API Key:**
   - Sign up at https://sendgrid.com
   - Create an API key
   - Copy the API key

2. **Set Environment Variables:**
```bash
export SENDGRID_API_KEY=your-sendgrid-api-key
export MAIL_FROM=noreply@yourdomain.com
export MAIL_FROM_NAME=Comestag
export SPRING_PROFILES_ACTIVE=stag  # or prod
```

3. **Restart Backend**

## Understanding the Flow

### Registration Flow:
1. User registers → Account created with `email_verified = false`
2. System attempts to send verification email (async)
3. If email fails → Account exists but email not verified
4. User tries to login → Gets "Email is not verified" error

### Login Flow:
1. User enters email/password
2. System checks if email is verified
3. If not verified → Error: "Email is not verified"
4. If verified → System sends 6-digit code to email
5. User enters code → Gets access token

## Common Email Errors

### Error: "MailAuthenticationException: Authentication failed"
**Cause:** Incorrect MAIL_USERNAME or MAIL_PASSWORD
**Fix:** 
- For Gmail: Use App Password, not regular password
- Check credentials are correct
- Ensure 2FA is enabled on Gmail account (required for App Passwords)

### Error: "Connection refused" or "Connection timeout"
**Cause:** MAIL_HOST or MAIL_PORT incorrect, or firewall blocking
**Fix:**
- Verify SMTP host and port
- Check firewall allows outbound connections
- Try different port (587 for TLS, 465 for SSL)

### Error: No error but email not received
**Cause:** Email sent but in spam folder, or email address typo
**Fix:**
- Check spam/junk folder
- Verify email address is correct
- Check backend logs for "Email sent successfully" message

## Testing Email Configuration

After configuring email, test it by:

1. **Register a new account** - Check if verification email arrives
2. **Check backend logs** - Look for "Email sent successfully" message
3. **Check spam folder** - Emails might be filtered

## Prevention

To prevent this issue in the future:

1. **Always configure email service before deployment**
2. **Test email sending during development**
3. **Monitor backend logs for email errors**
4. **Set up email service alerts/monitoring**

## Still Having Issues?

1. Check backend logs for detailed error messages
2. Verify environment variables are set correctly
3. Test email configuration with a simple SMTP test tool
4. Check if your email provider requires special configuration
5. For production, consider using a dedicated email service (SendGrid, AWS SES, etc.)

---

**Note:** The backend now includes improved error logging for email failures. Always check backend logs first when troubleshooting email issues.
