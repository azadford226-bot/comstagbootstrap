# Resend Email Configuration Guide

This guide will walk you through setting up Resend for email functionality in your application.

## Overview

The application supports **Resend** (preferred) and **SendGrid** (alternative) for sending emails. Resend is a modern email API service with excellent deliverability and developer experience.

**Priority Order:**
1. **Resend** (if `RESEND_API_KEY` is set)
2. **SendGrid** (if `SENDGRID_API_KEY` is set and Resend is not)
3. **NoOp** (if neither is configured - emails logged but not sent)

## Why Resend?

- ✅ **Modern API** - Clean, RESTful API design
- ✅ **Great Developer Experience** - Simple setup, excellent documentation
- ✅ **High Deliverability** - Optimized for inbox delivery
- ✅ **Free Tier** - 3,000 emails/month free, 100 emails/day
- ✅ **Fast Setup** - Get started in minutes
- ✅ **No Credit Card Required** - For free tier

## Step 1: Create Resend Account

1. Go to [https://resend.com/](https://resend.com/)
2. Click **"Get Started"** or **"Sign Up"**
3. Sign up with your email or GitHub account
4. Verify your email address (check your inbox)

## Step 2: Get API Key

1. Log in to your Resend dashboard
2. Go to **API Keys** section (or click [here](https://resend.com/api-keys))
3. Click **"Create API Key"**
4. Give it a name (e.g., "Comestag Production")
5. Select permissions:
   - **Full Access** (recommended for development)
   - **Sending Access** (for production - more secure)
6. Click **"Add"**
7. **IMPORTANT**: Copy the API key immediately - you'll see it only once!
   - It will look like: `re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

## Step 3: Verify Domain (Recommended for Production)

For production, you should verify your domain:

1. Go to **Domains** section in Resend dashboard
2. Click **"Add Domain"**
3. Enter your domain (e.g., `yourdomain.com`)
4. Follow the instructions to add DNS records:
   - Add the provided DNS records to your domain's DNS settings
   - Wait for DNS propagation (usually 5-30 minutes)
5. Once verified, you can use any email from that domain (e.g., `noreply@yourdomain.com`)

### Quick Start: Use Resend's Test Domain

For testing, you can use Resend's test domain:
- **From Email**: `onboarding@resend.dev`
- **Note**: This only works for testing. For production, verify your own domain.

## Step 4: Set Environment Variables in Railway

1. Go to your Railway project dashboard: [https://railway.app/](https://railway.app/)
2. Select your **Backend service** (the Spring Boot application, NOT the PostgreSQL service)
3. Click on the **Variables** tab
4. Click **"+ New Variable"** for each variable:

### Required Variables

#### 1. RESEND_API_KEY
- **Name**: `RESEND_API_KEY`
- **Value**: Your Resend API key (the one you copied in Step 2)
- **Example**: `re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

#### 2. MAIL_FROM
- **Name**: `MAIL_FROM`
- **Value**: The sender email address
  - **For testing**: `onboarding@resend.dev`
  - **For production**: `noreply@yourdomain.com` (must be from verified domain)
- **Example**: `noreply@yourdomain.com` or `onboarding@resend.dev`

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
   - Look for: `"Configuring Resend email client with API key (length: XX)"`
   - If you see this, Resend is configured correctly!
   - If you see: `"No email service configured"` or `"Falling back to no-op client"`, check your variables

3. **Test email sending**:
   - Try registering a new user account
   - Check if you receive a verification email
   - Check Resend dashboard → **Logs** → **Emails** to see sent emails

## Configuration Summary

Here's what you need to set in Railway:

```
RESEND_API_KEY=re_your_actual_api_key_here
MAIL_FROM=noreply@yourdomain.com
MAIL_FROM_NAME=Comestag (optional)
```

## How It Works

The application automatically:
- ✅ Checks if `RESEND_API_KEY` and `MAIL_FROM` are set → Uses Resend
- ✅ If Resend not set, checks `SENDGRID_API_KEY` → Uses SendGrid
- ✅ If neither is set → Uses NoOp client (logs warnings, no emails sent)
- ✅ Falls back gracefully if initialization fails

## Resend vs SendGrid

| Feature | Resend | SendGrid |
|---------|--------|----------|
| **Free Tier** | 3,000 emails/month | 100 emails/day |
| **Setup Time** | ~5 minutes | ~10 minutes |
| **API Design** | Modern REST API | REST API |
| **Documentation** | Excellent | Good |
| **Developer Experience** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

**Recommendation**: Use Resend for better free tier limits and modern API.

## Troubleshooting

### ❌ Application fails to start
- **Check**: Are `RESEND_API_KEY` and `MAIL_FROM` set correctly?
- **Check**: Are there any typos in the variable names?
- **Check**: Railway logs for specific error messages

### ❌ Emails not being sent
- **Verify**: API key is correct
- **Verify**: `MAIL_FROM` email is from a verified domain (or use `onboarding@resend.dev` for testing)
- **Check**: Resend dashboard → Logs → Emails for delivery status
- **Check**: Railway logs for Resend error messages

### ❌ "Domain not verified" error
- **Solution**: Verify your domain in Resend (Step 3) or use `onboarding@resend.dev` for testing
- **Note**: It can take a few minutes for DNS propagation

### ❌ "Invalid API key" error
- **Solution**: Create a new API key in Resend and update `RESEND_API_KEY`
- **Note**: Make sure you copied the entire key (starts with `re_`)

### ❌ Application uses no-op client (emails logged but not sent)
- **Check**: Railway logs for the warning message
- **Check**: Environment variables are set in the correct service (Backend, not PostgreSQL)
- **Check**: Variables don't have extra quotes or spaces
- **Check**: `RESEND_API_KEY` is set (not just `SENDGRID_API_KEY`)

## Resend Free Tier Limits

Resend's free tier includes:
- **3,000 emails/month** (forever free)
- **100 emails/day** limit
- **Unlimited domains** (after verification)

For production with higher volume, consider upgrading to a paid plan.

## Security Best Practices

1. **Never commit API keys** to Git
2. **Use "Sending Access" API keys** in production (not "Full Access")
3. **Rotate API keys** periodically
4. **Monitor email activity** in Resend dashboard
5. **Verify your domain** for production (not just test domain)

## Quick Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `RESEND_API_KEY` | ✅ Yes | Resend API key | `re_xxx...` |
| `MAIL_FROM` | ✅ Yes | Sender email | `noreply@domain.com` or `onboarding@resend.dev` |
| `MAIL_FROM_NAME` | ❌ No | Display name | `Comestag` |

## Testing with Resend Test Domain

For quick testing without domain verification:

1. Set `MAIL_FROM=onboarding@resend.dev`
2. Set `RESEND_API_KEY=your_api_key`
3. Deploy and test

**Note**: The test domain only works for testing. For production, verify your own domain.

## Next Steps

1. ✅ Set `RESEND_API_KEY` and `MAIL_FROM` in Railway
2. ✅ Verify the application starts successfully
3. ✅ Test by registering a new user
4. ✅ Check Resend dashboard for email activity
5. ✅ Verify your domain for production use

## Support

- **Resend Documentation**: [https://resend.com/docs](https://resend.com/docs)
- **Resend API Reference**: [https://resend.com/docs/api-reference](https://resend.com/docs/api-reference)
- **Resend Support**: [https://resend.com/support](https://resend.com/support)
- **Railway Support**: [https://railway.app/help](https://railway.app/help)
