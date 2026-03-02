# Reset PostgreSQL postgres Password - Step by Step

## 🔐 Method 1: Using pg_hba.conf (Recommended)

### Step 1: Stop PostgreSQL Service

Open PowerShell as Administrator and run:

```powershell
# Find the PostgreSQL service name
Get-Service | Where-Object {$_.Name -like "*postgresql*"}

# Stop the service (replace with your actual service name)
Stop-Service postgresql-x64-15-*  # Adjust version number if different
```

Or use Services GUI:
- Press `Win + R`, type `services.msc`, press Enter
- Find "postgresql-x64-XX" service
- Right-click → Stop

### Step 2: Edit pg_hba.conf

**Location:** `C:\Program Files\PostgreSQL\<version>\data\pg_hba.conf`

**What to change:**
- Find lines starting with `host` for IPv4 local connections
- Change `scram-sha-256` or `md5` to `trust` for localhost connections

**Example:**
```conf
# Before:
host    all             all             127.0.0.1/32            scram-sha-256

# After:
host    all             all             127.0.0.1/32            trust
```

**Also change this line if it exists:**
```conf
# Before:
host    all             all             ::1/128                 scram-sha-256

# After:
host    all             all             ::1/128                 trust
```

**Save the file** (you may need Administrator privileges)

### Step 3: Start PostgreSQL Service

```powershell
Start-Service postgresql-x64-15-*  # Adjust version number
```

Or use Services GUI:
- Right-click the service → Start

### Step 4: Connect and Reset Password

```powershell
psql -U postgres
```

Now you should connect without a password. Then run:

```sql
ALTER USER postgres WITH PASSWORD 'your_new_password';
```

**Important:** Choose a strong password and remember it!

### Step 5: Revert pg_hba.conf (IMPORTANT for Security!)

**Change it back:**
```conf
# Change back to:
host    all             all             127.0.0.1/32            scram-sha-256
host    all             all             ::1/128                 scram-sha-256
```

**Save the file** and restart PostgreSQL:
```powershell
Restart-Service postgresql-x64-15-*
```

### Step 6: Test New Password

```powershell
psql -U postgres
# Enter your new password when prompted
```

---

## 🔐 Method 2: Using pgAdmin (If Installed)

1. Open pgAdmin
2. Connect to your PostgreSQL server (if you can)
3. Navigate to: **Servers** → **PostgreSQL XX** → **Login/Group Roles** → **postgres**
4. Right-click → **Properties**
5. Go to **Definition** tab
6. Enter new password
7. Click **Save**

---

## 🔐 Method 3: Using Windows Authentication (If Enabled)

If Windows authentication is enabled, you can:

1. Connect as your Windows user:
   ```powershell
   psql -U $env:USERNAME -d postgres
   ```

2. Then change postgres password:
   ```sql
   ALTER USER postgres WITH PASSWORD 'your_new_password';
   ```

---

## ⚠️ Troubleshooting

### "Access Denied" when editing pg_hba.conf
- Right-click Notepad → Run as Administrator
- Open the file from Administrator Notepad

### Can't find pg_hba.conf
- Default location: `C:\Program Files\PostgreSQL\<version>\data\pg_hba.conf`
- Or search: `Get-ChildItem -Path "C:\Program Files\PostgreSQL" -Recurse -Filter "pg_hba.conf"`

### Service won't start
- Check Windows Event Viewer for errors
- Verify pg_hba.conf syntax is correct
- Make sure no other PostgreSQL processes are running

---

## ✅ After Resetting Password

Once you have the password reset, you can proceed with database setup:

```powershell
psql -U postgres
# Enter your new password
```

Then run the database setup commands from `create-database.sql` or `SETUP_MESSAGES.md`.
