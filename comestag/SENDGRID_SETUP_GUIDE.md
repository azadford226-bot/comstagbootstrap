# SendGrid Email Configuration Guide

This guide will walk you through setting up SendGrid for email functionality in your application.

## Overview

The application uses `SendGridEmailNotificationClient` to send emails (verification emails, notifications, etc.). You need to:
1. Create a SendGrid account
2. Get an API key
3. Verify a sender email address
4. Set environment variables in Railway

## Step 1: Create SendGrid Account

1. Go to [https://sendgrid.com/](https://sendgrid.com/)
2. Click **"Start for Free"** or **"Sign Up"**
3. Fill in your details and create an account
4. Verify your email address (check your inbox)

## Step 2: Create API Key

1. Log in to your SendGrid dashboard
2. Go to **Settings** → **API Keys** (or click [here](https://app.sendgrid.com/settings/api_keys))
3. Click **"Create API Key"**
4. Choose **"Full Access"** or **"Restricted Access"**:
   - **Full Access**: Recommended for development/testing
   - **Restricted Access**: Select only "Mail Send" permission for production
5. Give it a name (e.g., "Comestag Production")
6. Click **"Create & View"**
7. **IMPORTANT**: Copy the API key immediately - you won't be able to see it again!
   - It will look like: `SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

## Step 3: Verify Sender Email

SendGrid requires you to verify the email address you'll use as the sender.

### Option A: Single Sender Verification (Quick Start)

1. Go to **Settings** → **Sender Authentication** → **Single Sender Verification**
2. Click **"Create a Sender"**
3. Fill in the form:
   - **From Email Address**: The email you want to use (e.g., `noreply@yourdomain.com`)
   - **From Name**: Display name (e.g., "Comestag")
   - **Reply To**: Same as From Email or a different one
   - **Address**: Your business address
   - **City, State, Zip Code**: Your location
   - **Country**: Your country
4. Click **"Create"**
5. Check your email inbox for a verification email from SendGrid
6. Click the verification link in the email
7. **Note**: This email will be your `MAIL_FROM` value

### Option B: Domain Authentication (Recommended for Production)

For production, you should authenticate your entire domain:

1. Go to **Settings** → **Sender Authentication** → **Domain Authentication**
2. Click **"Authenticate Your Domain"**
3. Select your DNS provider
4. Follow the instructions to add DNS records
5. Once verified, you can use any email from that domain (e.g., `noreply@yourdomain.com`, `support@yourdomain.com`)

## Step 4: Set Environment Variables in Railway

1. Go to your Railway project dashboard: [https://railway.app/](https://railway.app/)
2. Select your **Backend service** (the Spring Boot application, NOT the PostgreSQL service)
3. Click on the **Variables** tab
4. Click **"+ New Variable"** for each variable:

### Required Variables

#### 1. SENDGRID_API_KEY
- **Name**: `SENDGRID_API_KEY`
- **Value**: Your SendGrid API key (the one you copied in Step 2)
- **Example**: `SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

#### 2. MAIL_FROM
- **Name**: `MAIL_FROM`
- **Value**: The verified sender email address from Step 3
- **Example**: `noreply@yourdomain.com` or `no-reply@comestag.com`
- **Important**: This must be the exact email you verified in SendGrid

### Optional Variables

#### 3. MAIL_FROM_NAME (Optional)
- **Name**: `MAIL_FROM_NAME`
- **Value**: Display name for emails
- **Default**: `Comestag` (if not set)
- **Example**: `Comestag Platform` or `Your Company Name`

## Step 5: Verify Configuration

After setting the variables:

1. **Railway will automatically redeploy** your application
2. **Check the logs** in Railway:
   - Go to your Backend service → **Deployments** → Click on the latest deployment → **View Logs**
   - Look for: `"Configuring SendGrid email client with API key (length: XX)"`
   - If you see this, SendGrid is configured correctly!
   - If you see: `"SendGrid not configured"` or `"Falling back to no-op client"`, check your variables

3. **Test email sending**:
   - Try registering a new user account
   - Check if you receive a verification email
   - Check SendGrid dashboard → **Activity** → **Email Activity** to see sent emails

## Configuration Summary

Here's what you need to set in Railway:

```
SENDGRID_API_KEY=SG.your_actual_api_key_here
MAIL_FROM=noreply@yourdomain.com
MAIL_FROM_NAME=Comestag (optional)
```

## How It Works

The application automatically:
- ✅ Checks if `SENDGRID_API_KEY` and `MAIL_FROM` are set
- ✅ If both are set → Uses `SendGridEmailNotificationClient` (sends real emails)
- ✅ If either is missing → Uses `NoOpEmailNotificationClient` (logs warnings, no emails sent)
- ✅ Falls back gracefully if SendGrid initialization fails

## Troubleshooting

### ❌ Application fails to start
- **Check**: Are `SENDGRID_API_KEY` and `MAIL_FROM` set correctly?
- **Check**: Are there any typos in the variable names?
- **Check**: Railway logs for specific error messages

### ❌ Emails not being sent
- **Verify**: API key is correct and has "Mail Send" permissions
- **Verify**: `MAIL_FROM` email is verified in SendGrid
- **Check**: SendGrid dashboard → Activity → Email Activity for delivery status
- **Check**: Railway logs for SendGrid error messages

### ❌ "Sender email not verified" error
- **Solution**: Verify the email in SendGrid (Step 3)
- **Note**: It can take a few minutes for verification to complete

### ❌ "Invalid API key" error
- **Solution**: Create a new API key in SendGrid and update `SENDGRID_API_KEY`
- **Note**: Make sure you copied the entire key (starts with `SG.`)

### ❌ Application uses no-op client (emails logged but not sent)
- **Check**: Railway logs for the warning message
- **Check**: Environment variables are set in the correct service (Backend, not PostgreSQL)
- **Check**: Variables don't have extra quotes or spaces

## SendGrid Free Tier Limits

SendGrid's free tier includes:
- **100 emails/day** (forever free)
- **40,000 emails** for the first 30 days

For production, consider upgrading to a paid plan if you need more emails.

## Security Best Practices

1. **Never commit API keys** to Git
2. **Use Restricted Access API keys** in production (only "Mail Send" permission)
3. **Rotate API keys** periodically
4. **Monitor email activity** in SendGrid dashboard
5. **Set up domain authentication** for production (not just single sender)

## Next Steps

1. ✅ Set `SENDGRID_API_KEY` and `MAIL_FROM` in Railway
2. ✅ Verify the application starts successfully
3. ✅ Test by registering a new user
4. ✅ Check SendGrid dashboard for email activity
5. ✅ Monitor Railway logs for any issues

## Quick Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `SENDGRID_API_KEY` | ✅ Yes | SendGrid API key | `SG.xxx...` |
| `MAIL_FROM` | ✅ Yes | Verified sender email | `noreply@domain.com` |
| `MAIL_FROM_NAME` | ❌ No | Display name | `Comestag` |

## Support

- **SendGrid Documentation**: [https://docs.sendgrid.com/](https://docs.sendgrid.com/)
- **SendGrid Support**: [https://support.sendgrid.com/](https://support.sendgrid.com/)
- **Railway Support**: [https://railway.app/help](https://railway.app/help)
