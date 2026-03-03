# Zoho Mail Configuration Guide

This guide will walk you through setting up Zoho Mail for email functionality in your application.

## Overview

The application supports **Zoho Mail** (preferred), **Resend**, and **SendGrid** for sending emails. Zoho Mail uses SMTP protocol and is a great choice if you already have a Zoho Mail account.

**Priority Order:**
1. **Zoho Mail** (if `ZOHO_MAIL_EMAIL` and `ZOHO_MAIL_PASSWORD` are set)
2. **Resend** (if `RESEND_API_KEY` is set and Zoho is not)
3. **SendGrid** (if `SENDGRID_API_KEY` is set and neither Zoho nor Resend is)
4. **NoOp** (if none are configured - emails logged but not sent)

## Why Zoho Mail?

- ✅ **Free for Personal Use** - Free email accounts available
- ✅ **Business Plans Available** - Professional email hosting
- ✅ **SMTP Support** - Standard SMTP protocol, reliable
- ✅ **No API Limits** - Use your own email account
- ✅ **Domain Email** - Use your own domain (with paid plans)
- ✅ **Familiar Interface** - Easy to manage

## Step 1: Create Zoho Mail Account

1. Go to [https://www.zoho.com/mail/](https://www.zoho.com/mail/)
2. Click **"Sign Up Now"** or **"Get Started"**
3. Choose a plan:
   - **Free Plan**: For personal use (5GB storage, 25MB attachment limit)
   - **Mail Lite**: $1/user/month (10GB storage, 30MB attachment limit)
   - **Mail Premium**: $4/user/month (50GB storage, 40MB attachment limit)
4. Sign up with your email or create a new Zoho account
5. Verify your email address (check your inbox)

## Step 2: Enable SMTP Access

1. Log in to your Zoho Mail account: [https://mail.zoho.com/](https://mail.zoho.com/)
2. Go to **Settings** (gear icon) → **Mail** → **POP/IMAP Access**
3. Enable **"IMAP Access"** (required for SMTP)
4. Go to **Settings** → **Security** → **App Passwords**
5. Click **"Generate New Password"**
6. Give it a name (e.g., "Comestag Application")
7. **IMPORTANT**: Copy the generated app password immediately - you'll see it only once!
   - It will look like: `xxxxxxxxxxxxxxxx` (16 characters)

**Note**: For security, use an **App Password** instead of your regular Zoho password. This is required for SMTP access.

## Step 3: Get Your Email Address

Your Zoho Mail email address will be:
- **Free Plan**: `yourname@zoho.com` or `yourname@zmail.com`
- **Paid Plan**: `yourname@yourdomain.com` (if you've configured your domain)

## Step 4: Set Environment Variables in Railway

1. Go to your Railway project dashboard: [https://railway.app/](https://railway.app/)
2. Select your **Backend service** (the Spring Boot application, NOT the PostgreSQL service)
3. Click on the **Variables** tab
4. Click **"+ New Variable"** for each variable:

### Required Variables

#### 1. ZOHO_MAIL_EMAIL
- **Name**: `ZOHO_MAIL_EMAIL`
- **Value**: Your Zoho Mail email address
- **Example**: `noreply@zoho.com` or `noreply@yourdomain.com`

#### 2. ZOHO_MAIL_PASSWORD
- **Name**: `ZOHO_MAIL_PASSWORD`
- **Value**: Your Zoho Mail **App Password** (NOT your regular password)
- **Example**: `xxxxxxxxxxxxxxxx` (the 16-character app password from Step 2)

#### 3. MAIL_FROM
- **Name**: `MAIL_FROM`
- **Value**: The sender email address (usually same as `ZOHO_MAIL_EMAIL`)
- **Example**: `noreply@zoho.com` or `noreply@yourdomain.com`

### Optional Variables

#### 4. MAIL_FROM_NAME (Optional)
- **Name**: `MAIL_FROM_NAME`
- **Value**: Display name for emails
- **Default**: `no-reply` (if not set)
- **Example**: `Comestag Platform` or `Your Company Name`

## Step 5: Verify Configuration

After setting the variables:

1. **Railway will automatically redeploy** your application
2. **Check the logs** in Railway:
   - Go to your Backend service → **Deployments** → Click on the latest deployment → **View Logs**
   - Look for: `"Configuring Zoho Mail email client with email: your-email@zoho.com"`
   - If you see this, Zoho Mail is configured correctly!
   - If you see: `"No email service configured"` or `"Falling back to no-op client"`, check your variables

3. **Test email sending**:
   - Try registering a new user account
   - Check if you receive a verification email
   - Check your Zoho Mail inbox for sent emails

## Configuration Summary

Here's what you need to set in Railway:

```
ZOHO_MAIL_EMAIL=noreply@zoho.com
ZOHO_MAIL_PASSWORD=your_app_password_here
MAIL_FROM=noreply@zoho.com
MAIL_FROM_NAME=Comestag (optional)
```

## How It Works

The application automatically:
- ✅ Checks if `ZOHO_MAIL_EMAIL` and `ZOHO_MAIL_PASSWORD` are set → Uses Zoho Mail
- ✅ If Zoho not set, checks `RESEND_API_KEY` → Uses Resend
- ✅ If Resend not set, checks `SENDGRID_API_KEY` → Uses SendGrid
- ✅ If none are set → Uses NoOp client (logs warnings, no emails sent)
- ✅ Falls back gracefully if initialization fails

## Zoho Mail SMTP Settings

The application uses these Zoho Mail SMTP settings automatically:
- **Host**: `smtp.zoho.com`
- **Port**: `587` (TLS)
- **Authentication**: Required (uses your email and app password)
- **Encryption**: STARTTLS

## Troubleshooting

### ❌ Application fails to start
- **Check**: Are `ZOHO_MAIL_EMAIL`, `ZOHO_MAIL_PASSWORD`, and `MAIL_FROM` set correctly?
- **Check**: Are there any typos in the variable names?
- **Check**: Railway logs for specific error messages

### ❌ "Authentication failed" error
- **Verify**: You're using an **App Password**, not your regular Zoho password
- **Verify**: App Password was generated correctly in Zoho settings
- **Verify**: IMAP Access is enabled in Zoho Mail settings
- **Solution**: Generate a new App Password and update `ZOHO_MAIL_PASSWORD`

### ❌ Emails not being sent
- **Verify**: Email address and app password are correct
- **Verify**: `MAIL_FROM` matches your Zoho Mail email address
- **Check**: Railway logs for Zoho Mail error messages
- **Check**: Zoho Mail inbox for any bounce-back messages

### ❌ "Connection timeout" error
- **Check**: Your Railway deployment has internet access
- **Check**: Zoho Mail SMTP server is accessible (smtp.zoho.com:587)
- **Solution**: Wait a few minutes and try again (could be temporary network issue)

### ❌ Application uses no-op client (emails logged but not sent)
- **Check**: Railway logs for the warning message
- **Check**: Environment variables are set in the correct service (Backend, not PostgreSQL)
- **Check**: Variables don't have extra quotes or spaces
- **Check**: Both `ZOHO_MAIL_EMAIL` and `ZOHO_MAIL_PASSWORD` are set (not just one)

### ❌ "Invalid credentials" error
- **Solution**: Make sure you're using an App Password, not your regular password
- **Solution**: Generate a new App Password in Zoho settings
- **Solution**: Ensure IMAP Access is enabled

## Zoho Mail Free Plan Limits

Zoho Mail free plan includes:
- **5GB storage** per account
- **25MB attachment** limit per email
- **Unlimited emails** (no sending limits)
- **Custom domain** support (with paid plans)

For production with higher volume or custom domains, consider upgrading to a paid plan.

## Security Best Practices

1. **Never commit passwords** to Git
2. **Use App Passwords** (not your regular Zoho password)
3. **Rotate App Passwords** periodically
4. **Monitor email activity** in Zoho Mail
5. **Use a dedicated email account** for application emails (not your personal account)
6. **Enable 2FA** on your Zoho account for extra security

## Quick Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `ZOHO_MAIL_EMAIL` | ✅ Yes | Your Zoho Mail email address | `noreply@zoho.com` |
| `ZOHO_MAIL_PASSWORD` | ✅ Yes | Zoho Mail App Password (16 chars) | `xxxxxxxxxxxxxxxx` |
| `MAIL_FROM` | ✅ Yes | Sender email (usually same as email) | `noreply@zoho.com` |
| `MAIL_FROM_NAME` | ❌ No | Display name | `Comestag` |

## Using Your Own Domain

If you have a paid Zoho Mail plan with a custom domain:

1. Configure your domain in Zoho Mail settings
2. Verify DNS records (MX, SPF, DKIM)
3. Use your domain email: `MAIL_FROM=noreply@yourdomain.com`
4. Use the same email for `ZOHO_MAIL_EMAIL`

## Comparison: Zoho vs Resend vs SendGrid

| Feature | Zoho Mail | Resend | SendGrid |
|---------|-----------|--------|----------|
| **Free Tier** | 5GB storage | 3,000 emails/month | 100 emails/day |
| **Setup Time** | ~10 minutes | ~5 minutes | ~10 minutes |
| **Protocol** | SMTP | REST API | REST API |
| **Custom Domain** | ✅ (paid) | ✅ (free) | ✅ (free) |
| **Best For** | Existing Zoho users | Modern apps | Enterprise |

**Recommendation**: 
- Use **Zoho Mail** if you already have a Zoho account or prefer SMTP
- Use **Resend** for modern apps with better free tier
- Use **SendGrid** for enterprise features

## Next Steps

1. ✅ Create Zoho Mail account
2. ✅ Generate App Password
3. ✅ Set `ZOHO_MAIL_EMAIL`, `ZOHO_MAIL_PASSWORD`, and `MAIL_FROM` in Railway
4. ✅ Verify the application starts successfully
5. ✅ Test by registering a new user
6. ✅ Check Zoho Mail inbox for sent emails

## Support

- **Zoho Mail Help**: [https://help.zoho.com/portal/en/kb/mail](https://help.zoho.com/portal/en/kb/mail)
- **Zoho Mail SMTP Settings**: [https://www.zoho.com/mail/help/zoho-mail-smtp-configuration.html](https://www.zoho.com/mail/help/zoho-mail-smtp-configuration.html)
- **Zoho Support**: [https://www.zoho.com/support/](https://www.zoho.com/support/)
- **Railway Support**: [https://railway.app/help](https://railway.app/help)
