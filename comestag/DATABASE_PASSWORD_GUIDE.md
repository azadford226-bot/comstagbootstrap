# PostgreSQL Password Guide

## 🔐 Understanding PostgreSQL Passwords

There are **two different passwords** involved:

1. **`postgres` superuser password** - The password for the PostgreSQL administrator account
2. **`comestag` database user password** - The password for the application database user (we'll create this)

---

## 📝 How to Enter Password When Prompted

When you see:
```
Password for user postgres:
```

**Just type your password and press Enter.** 
- The password will **NOT** be visible on screen (no asterisks, nothing)
- This is normal security behavior
- Type it carefully and press Enter

---

## 🔑 If You Don't Know the `postgres` Password

### Option 1: Check if PostgreSQL uses Windows Authentication

Try connecting without a password:
```powershell
psql -U postgres
```

If this works, you don't need a password (Windows authentication is enabled).

### Option 2: Reset the `postgres` Password

**Step 1:** Stop PostgreSQL service (if running):
```powershell
Stop-Service postgresql-x64-*
```

**Step 2:** Edit the `pg_hba.conf` file to allow local connections without password:
- Location: `C:\Program Files\PostgreSQL\<version>\data\pg_hba.conf`
- Find the line: `host all all 127.0.0.1/32 scram-sha-256`
- Change it to: `host all all 127.0.0.1/32 trust`
- Save the file

**Step 3:** Start PostgreSQL:
```powershell
Start-Service postgresql-x64-*
```

**Step 4:** Connect and set password:
```powershell
psql -U postgres
```

Then in psql:
```sql
ALTER USER postgres WITH PASSWORD 'your_new_password';
```

**Step 5:** Revert `pg_hba.conf` back to `scram-sha-256` for security.

### Option 3: Use pgAdmin (GUI Tool)

If you have pgAdmin installed:
1. Open pgAdmin
2. Connect to your PostgreSQL server
3. Right-click on "Login/Group Roles" → "postgres" → "Properties"
4. Go to "Definition" tab and set the password

---

## 🚀 Setting Up the Database (After You Can Connect)

Once you can connect as `postgres`, run these commands:

### Interactive Method (Recommended):

```powershell
psql -U postgres
```

Then in psql, run:
```sql
-- Create database
CREATE DATABASE comestag;

-- Create user with password 'comestag'
CREATE USER comestag WITH PASSWORD 'comestag';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE comestag TO comestag;

-- Connect to the new database
\c comestag

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO comestag;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO comestag;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO comestag;

-- Exit
\q
```

### Using Environment Variable (Non-Interactive):

If you know your `postgres` password, you can set it temporarily:

```powershell
# Set password as environment variable
$env:PGPASSWORD='your_postgres_password'

# Create database
psql -U postgres -c "CREATE DATABASE comestag;"

# Create user
psql -U postgres -c "CREATE USER comestag WITH PASSWORD 'comestag';"

# Grant database privileges
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE comestag TO comestag;"

# Grant schema privileges (connect to comestag database)
psql -U postgres -d comestag -c "GRANT ALL ON SCHEMA public TO comestag;"
psql -U postgres -d comestag -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO comestag;"
psql -U postgres -d comestag -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO comestag;"
```

---

## ✅ Verify Setup

After setup, verify everything works:

```powershell
# Test connection as comestag user
psql -U comestag -d comestag
# Password: comestag
```

If you can connect, the setup is complete!

---

## 📋 Summary

- **`postgres` user password**: Set during PostgreSQL installation (or use Windows auth)
- **`comestag` user password**: Set to `'comestag'` in the SQL script (you can change this)
- **Application password**: The app uses `comestag` / `comestag` by default (configured in `application.properties`)

---

## 🔧 Change Application Database Password

If you want to use a different password for the `comestag` user:

1. **Change in database:**
   ```sql
   ALTER USER comestag WITH PASSWORD 'your_new_password';
   ```

2. **Update application configuration:**
   - Set environment variable: `$env:SPRING_DATASOURCE_PASSWORD='your_new_password'`
   - Or update `application.properties` (not recommended for production)
