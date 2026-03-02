# Railway Email Configuration Guide

## Issue Fixed

The application was failing to start because `EmailSenderPort` bean was not found. This was because:
- The application runs with `prod` profile
- `SendGridEmailNotificationClient` was only active for `stag` profile
- `JavaMailNotificationClient` was only active for `local` profile

**Fix Applied:** Updated `SendGridEmailNotificationClient` to be active for both `stag` and `prod` profiles.

## Required Environment Variables for Email

To enable email functionality in production, you need to set the following environment variables in your **Railway Backend service**:

### Required Variables

1. **`SENDGRID_API_KEY`**
   - Description: Your SendGrid API key for sending emails
   - How to get it:
     1. Sign up at [SendGrid](https://sendgrid.com/)
     2. Go to Settings → API Keys
     3. Create a new API key with "Full Access" or "Mail Send" permissions
     4. Copy the API key (you'll only see it once!)

2. **`MAIL_FROM`**
   - Description: The email address that will appear as the sender
   - Example: `noreply@yourdomain.com` or `no-reply@comestag.com`
   - Note: This email must be verified in your SendGrid account

### Optional Variables

3. **`MAIL_FROM_NAME`** (Optional)
   - Description: The display name for the sender
   - Default: `Comestag`
   - Example: `Comestag Platform`

## How to Set Variables in Railway

1. Go to your Railway project dashboard
2. Select your **Backend service** (not the PostgreSQL service)
3. Click on the **Variables** tab
4. Click **+ New Variable**
5. Add each variable:
   - **Name:** `SENDGRID_API_KEY`
   - **Value:** `your-sendgrid-api-key-here`
6. Repeat for `MAIL_FROM` and optionally `MAIL_FROM_NAME`
7. Save changes

Railway will automatically redeploy your application after saving.

## Verification

After setting the variables and redeploying:

1. Check the Railway logs - the application should start successfully
2. Try registering a new user - you should receive a verification email
3. Check SendGrid dashboard for email activity

## Troubleshooting

### Application starts but emails don't send

- Verify `SENDGRID_API_KEY` is correct
- Check that `MAIL_FROM` email is verified in SendGrid
- Check Railway logs for SendGrid error messages

### Application fails to start with "No qualifying bean" error

- Ensure you've set `SENDGRID_API_KEY` and `MAIL_FROM`
- Check that the profile is set to `prod` (default)

### SendGrid API errors

- Verify your API key has "Mail Send" permissions
- Check SendGrid account status (not suspended)
- Verify sender email is verified in SendGrid

## Alternative: Disable Email (Not Recommended)

If you don't want to configure email right now, you would need to:
1. Create a no-op email sender implementation
2. Make it active for `prod` profile
3. This is not recommended as email verification is required for user registration

## Next Steps

1. Set `SENDGRID_API_KEY` and `MAIL_FROM` in Railway
2. Verify the application starts successfully
3. Test email functionality by registering a new user
