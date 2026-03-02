# Fixing Vercel CLI SSL Certificate Errors

If you're getting `SELF_SIGNED_CERT_IN_CHAIN` errors, here are several solutions:

## Solution 1: Use GitHub Integration (Recommended)

Instead of using Vercel CLI, deploy directly from GitHub:

1. **Push your code to GitHub** (if not already):
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Deploy via Vercel Dashboard**:
   - Go to https://vercel.com/dashboard
   - Click "Add New Project"
   - Import your GitHub repository
   - Configure:
     - **Root Directory**: `comestag/frontend`
     - **Framework Preset**: Next.js
   - Add environment variables:
     - `NEXT_PUBLIC_API_BASE_URL`: Your backend URL
     - `NEXT_PUBLIC_DEV_MODE`: `false`
   - Click "Deploy"

This method avoids SSL certificate issues entirely.

## Solution 2: Configure Node.js to Accept Certificates (Temporary Fix)

**⚠️ Warning**: This disables SSL certificate verification. Only use for development/testing.

### Windows PowerShell:
```powershell
$env:NODE_TLS_REJECT_UNAUTHORIZED = "0"
vercel login
vercel
```

### Windows CMD:
```cmd
set NODE_TLS_REJECT_UNAUTHORIZED=0
vercel login
vercel
```

### For a single command:
```powershell
$env:NODE_TLS_REJECT_UNAUTHORIZED = "0"; vercel login
```

## Solution 3: Install Corporate Root Certificate

If you're in a corporate environment:

1. **Export the corporate root certificate**:
   - Ask your IT department for the root CA certificate
   - Or export it from your browser (Chrome: Settings → Privacy → Certificates → Export)

2. **Add to Node.js**:
   ```powershell
   # Set the certificate file path
   $env:NODE_EXTRA_CA_CERTS = "C:\path\to\your\corporate-root-ca.crt"
   vercel login
   ```

## Solution 4: Use a Different Network

If possible:
- Try from a different network (mobile hotspot, home network)
- Use a VPN if corporate network is blocking

## Solution 5: Use Vercel API Directly

You can also deploy using the Vercel REST API with curl:

```powershell
# First, get an access token from Vercel dashboard
# Settings → Tokens → Create Token

$VERCEL_TOKEN = "your-vercel-token"
$PROJECT_NAME = "your-project-name"

# Create deployment
curl -X POST "https://api.vercel.com/v13/deployments" `
  -H "Authorization: Bearer $VERCEL_TOKEN" `
  -H "Content-Type: application/json" `
  -d '{
    "name": "' + $PROJECT_NAME + '",
    "gitSource": {
      "type": "github",
      "repo": "your-username/your-repo",
      "ref": "main"
    }
  }'
```

## Recommended Approach

**For production deployments, use Solution 1 (GitHub Integration)** because:
- ✅ No SSL certificate issues
- ✅ Automatic deployments on git push
- ✅ Better CI/CD integration
- ✅ More secure (no need to disable certificate verification)
- ✅ Easier to manage environment variables

## Quick GitHub Deployment Steps

1. Ensure your code is on GitHub
2. Go to https://vercel.com/dashboard
3. Click "Add New Project"
4. Select your repository
5. Configure:
   - Root Directory: `comestag/frontend`
   - Framework: Next.js (auto-detected)
6. Add environment variables
7. Deploy!

The GitHub integration method is the most reliable and doesn't require dealing with SSL certificates.
