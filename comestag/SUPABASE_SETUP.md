# Supabase Setup Guide

## Overview

The backend uses Supabase Storage for media file storage (images, videos, documents). This guide will help you connect the backend to your Supabase project.

## Prerequisites

1. A Supabase account (sign up at https://supabase.com)
2. A Supabase project created
3. A storage bucket created in Supabase

## Step 1: Get Your Supabase Credentials

### 1.1 Get Your Project URL

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **API**
3. Copy your **Project URL** (e.g., `https://xxxxx.supabase.co`)

### 1.2 Get Your Service Key

1. In the same **Settings** → **API** page
2. Find **Project API keys**
3. Copy the **service_role** key (⚠️ Keep this secret! It has admin access)
   - **DO NOT** use the `anon` key - it doesn't have the necessary permissions

## Step 2: Create Storage Bucket

1. Go to **Storage** in your Supabase dashboard
2. Click **New bucket**
3. Name it: `comestag-media` (or your preferred name)
4. Make it **Public** (if you want public access to uploaded files)
   - Or **Private** if you want to control access
5. Click **Create bucket**

## Step 3: Configure Backend

### Option A: Environment Variables (Recommended)

Set these environment variables before starting the backend:

**Windows PowerShell:**
```powershell
$env:SUPABASE_URL = "https://your-project-id.supabase.co"
$env:SUPABASE_SERVICE_KEY = "your-service-role-key-here"
$env:SUPABASE_STORAGE_BUCKET = "comestag-media"  # Optional, defaults to comestag-media
```

**Linux/Mac:**
```bash
export SUPABASE_URL="https://your-project-id.supabase.co"
export SUPABASE_SERVICE_KEY="your-service-role-key-here"
export SUPABASE_STORAGE_BUCKET="comestag-media"  # Optional
```

### Option B: Application Properties

The configuration is already in `application-local.properties`:

```properties
supabase.url=${SUPABASE_URL:https://msnkhkvbexvrxykizidz.supabase.co}
supabase.serviceKey=${SUPABASE_SERVICE_KEY}
supabase.storage.bucket=${SUPABASE_STORAGE_BUCKET:comestag-media}
supabase.storage.public-base-url=${supabase.url}/storage/v1/object/public
```

Just set the environment variables and restart the backend.

## Step 4: Test the Connection

1. Start the backend with the environment variables set
2. Try uploading a file through the API
3. Check your Supabase Storage dashboard to see if the file appears

## Current Configuration

- **Supabase URL**: `https://msnkhkvbexvrxykizidz.supabase.co` (default)
- **Storage Bucket**: `comestag-media` (default)
- **Profile**: Works with `local`, `stag`, and `prod` profiles

## Security Notes

⚠️ **IMPORTANT**: 
- The `service_role` key has **full admin access** to your Supabase project
- **NEVER** commit this key to version control
- **NEVER** expose it in client-side code
- Only use it in secure backend environments
- Consider using Row Level Security (RLS) policies for additional security

## Troubleshooting

### Files Not Uploading

1. **Check Service Key**: Make sure you're using the `service_role` key, not the `anon` key
2. **Check Bucket Name**: Verify the bucket name matches exactly (case-sensitive)
3. **Check Bucket Permissions**: If using a private bucket, ensure RLS policies allow access
4. **Check Network**: Ensure your backend can reach Supabase (check firewall/proxy settings)

### 401 Unauthorized Errors

- Verify your service key is correct
- Check that the service key hasn't been rotated/regenerated
- Ensure the environment variable is set correctly

### 404 Not Found Errors

- Verify the bucket name is correct
- Check that the bucket exists in your Supabase project
- Ensure the bucket is in the correct project (if you have multiple projects)

## Storage Structure

Files are stored with the following structure:
```
bucket-name/
  ├── profile/
  │   └── {account-id}/
  │       └── {filename}.{ext}
  ├── post/
  │   └── {account-id}/
  │       └── {filename}.{ext}
  ├── event/
  │   └── {account-id}/
  │       └── {filename}.{ext}
  └── ...
```

## API Endpoints

The Supabase Storage API is accessed via:
- **Base URL**: `{SUPABASE_URL}/storage/v1`
- **Upload**: `POST /object/{bucket}/{path}`
- **Download**: `GET /object/{bucket}/{path}`
- **Delete**: `DELETE /object/{bucket}/{path}`

## Next Steps

1. Set the environment variables
2. Restart the backend
3. Test file upload functionality
4. Monitor Supabase dashboard for uploaded files
