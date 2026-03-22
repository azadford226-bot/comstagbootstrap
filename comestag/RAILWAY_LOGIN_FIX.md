# Fix Login When Hosted on Railway

If login fails with "Invalid credentials" or CORS errors when your app is deployed on Railway, follow these steps.

---

## CORS Fix (Automatic)

The app **automatically uses the proxy** when hosted on `*.vercel.app`, so CORS is avoided. Ensure:

1. **Vercel** has `BACKEND_URL` = `https://comstagbootstrap-production.up.railway.app` (your Railway URL)
2. **Optional**: Remove `NEXT_PUBLIC_API_BASE_URL` from Vercel (no longer needed)
3. **Custom domain**: Add `NEXT_PUBLIC_USE_PROXY=true` in Vercel to use the proxy

---

## Root Causes

1. **Wrong backend URL** – Frontend may be calling Render instead of Railway
2. **Admin account missing/wrong** – Railway PostgreSQL may not have the correct admin credentials
3. **CORS** – Railway backend may be blocking requests from your frontend

---

## Fix 1: Point Frontend to Railway Backend

### If frontend is on Vercel

1. Get your Railway backend URL: **Railway → Backend Service → Settings → Domains**
   - Example: `https://comestag-backend.up.railway.app`

2. In **Vercel → Project → Settings → Environment Variables**, add:
   - **Key**: `NEXT_PUBLIC_API_BASE_URL`
   - **Value**: Your Railway URL (e.g. `https://comestag-backend.up.railway.app`)
   - **Environments**: Production, Preview, Development

3. **Or** use `BACKEND_URL` (proxy only, no rebuild needed):
   - **Key**: `BACKEND_URL`
   - **Value**: Same Railway URL

4. Redeploy Vercel (Deployments → ⋯ → Redeploy).

---

## Fix 2: Fix Admin Account in Railway Database

The admin account or password hash may be incorrect in Railway PostgreSQL.

### Option A: Railway CLI

```bash
railway login
cd comestag
railway connect
```

Then run this SQL:

```sql
-- Fix admin account in Railway database
UPDATE accounts SET 
  password_hash = '$2a$10$n8BTO.VZAO1Y2v0WMbNm6ei4/IAlvWfqRr.X1dvnIdCT/uJaKLbyy',
  status = 'ACTIVE',
  email_verified = true,
  type = 'ADMIN',
  updated_at = now()
WHERE email = 'admin@comstag.com';

-- If admin doesn't exist, create it:
INSERT INTO accounts (id, email, password_hash, email_verified, type, status, display_name, created_at, updated_at)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'admin@comstag.com',
    '$2a$10$n8BTO.VZAO1Y2v0WMbNm6ei4/IAlvWfqRr.X1dvnIdCT/uJaKLbyy',
    true, 'ADMIN', 'ACTIVE', 'System Administrator', NOW(), NOW()
)
ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  status = 'ACTIVE',
  email_verified = true,
  type = 'ADMIN',
  updated_at = NOW();

-- Ensure admin record exists
INSERT INTO admin (id, email, display_name, role, active, created_at, updated_at)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'admin@comstag.com',
    'System Administrator',
    'SUPER_ADMIN',
    true, NOW(), NOW()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  display_name = EXCLUDED.display_name,
  role = EXCLUDED.role,
  active = true,
  updated_at = NOW();
```

### Option B: Railway Data tab

1. Open **Railway → PostgreSQL service → Data**.
2. Run the same SQL as above in the query panel.

---

## Fix 3: CORS Configuration on Railway

1. In **Railway → Backend Service → Variables**, set:

   **Key**: `CORS_ALLOWED_ORIGINS`  
   **Value**: Your frontend URL(s), comma-separated:
   ```
   https://your-app.vercel.app,https://your-railway-url.up.railway.app
   ```

2. Redeploy the backend after changing variables.

---

## Verify

1. **Backend health**:  
   `https://your-railway-url/actuator/health` → `{"status":"UP"}`

2. **Network tab**:  
   Login requests should go to `https://your-railway-url/v1/auth/login` (or `/api/proxy/...` which forwards there).

3. **Credentials**:  
   - Email: `admin@comstag.com`  
   - Password: `Admin@123!`

---

## Quick Checklist

- [ ] `NEXT_PUBLIC_API_BASE_URL` or `BACKEND_URL` set in Vercel to Railway URL
- [ ] Admin account fixed in Railway PostgreSQL (SQL above)
- [ ] `CORS_ALLOWED_ORIGINS` in Railway includes Vercel URL
- [ ] Vercel and Railway redeployed after changes
