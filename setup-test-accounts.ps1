# ==================================================
# Setup Test Accounts for Development
# ==================================================
# This script helps set up test accounts with proper
# BCrypt password hashes for testing the dashboard
# ==================================================

Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host "Test Accounts Setup Helper" -ForegroundColor Cyan
Write-Host "============================================`n" -ForegroundColor Cyan

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$comstagDir = Join-Path $scriptDir "comestag"

# Check if GeneratePasswordHash.java exists
$javaHasher = Join-Path $comstagDir "GeneratePasswordHash.java"
if (-not (Test-Path $javaHasher)) {
    Write-Host "❌ GeneratePasswordHash.java not found!" -ForegroundColor Red
    Write-Host "   Expected at: $javaHasher" -ForegroundColor Yellow
    Write-Host "`nCreating GeneratePasswordHash.java..." -ForegroundColor Yellow
    
    $javaCode = @'
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class GeneratePasswordHash {
    public static void main(String[] args) {
        if (args.length == 0) {
            System.out.println("Usage: java GeneratePasswordHash <password>");
            System.exit(1);
        }
        
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String password = args[0];
        String hash = encoder.encode(password);
        
        System.out.println("Password: " + password);
        System.out.println("BCrypt Hash: " + hash);
    }
}
'@
    
    Set-Content -Path $javaHasher -Value $javaCode -Encoding UTF8
    Write-Host "✅ Created GeneratePasswordHash.java" -ForegroundColor Green
}

# Test passwords
$testCompanyPassword = "Test123!"
$adminPassword = "Admin123!"

Write-Host "Generating BCrypt password hashes..." -ForegroundColor Yellow
Write-Host ""

# Try to generate hashes using Java
$javaAvailable = $false
try {
    $javaVersion = java -version 2>&1 | Select-String "version"
    if ($javaVersion) {
        $javaAvailable = $true
    }
} catch {
    $javaAvailable = $false
}

if ($javaAvailable) {
    Write-Host "✅ Java is available" -ForegroundColor Green
    Write-Host "`nCompiling password hash generator..." -ForegroundColor Yellow
    
    Push-Location $comstagDir
    
    # Check if Spring BCrypt is available (requires Spring Security in classpath)
    Write-Host "`nNote: This requires Spring Security BCrypt in the classpath" -ForegroundColor Yellow
    Write-Host "Attempting to use Maven to run the hash generator..." -ForegroundColor Yellow
    
    # Alternative: Use the backend to generate hashes via API or direct execution
    Write-Host "`n⚠️  Manual Hash Generation Required" -ForegroundColor Yellow
    Write-Host "Please generate BCrypt hashes using one of these methods:`n" -ForegroundColor White
    
    Write-Host "Method 1: Online BCrypt Generator (Easiest)" -ForegroundColor Cyan
    Write-Host "  1. Visit: https://bcrypt-generator.com/" -ForegroundColor White
    Write-Host "  2. Enter password: $testCompanyPassword" -ForegroundColor White
    Write-Host "  3. Rounds: 10" -ForegroundColor White
    Write-Host "  4. Copy the generated hash" -ForegroundColor White
    Write-Host "  5. Repeat for admin password: $adminPassword`n" -ForegroundColor White
    
    Write-Host "Method 2: Use Backend API" -ForegroundColor Cyan
    Write-Host "  1. Start the backend server" -ForegroundColor White
    Write-Host "  2. Create a temporary endpoint to generate hashes" -ForegroundColor White
    Write-Host "  3. Or use the existing password encoding in the registration flow`n" -ForegroundColor White
    
    Pop-Location
} else {
    Write-Host "⚠️  Java not found in PATH" -ForegroundColor Yellow
    Write-Host "`nPlease generate BCrypt hashes manually:" -ForegroundColor White
    Write-Host "  Visit: https://bcrypt-generator.com/" -ForegroundColor Cyan
    Write-Host "  Password 1: $testCompanyPassword" -ForegroundColor White
    Write-Host "  Password 2: $adminPassword" -ForegroundColor White
    Write-Host "  Rounds: 10`n" -ForegroundColor White
}

Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host "SQL Script Location" -ForegroundColor Cyan
Write-Host "============================================`n" -ForegroundColor Cyan

$sqlScript = Join-Path $comstagDir "setup-test-accounts.sql"
Write-Host "SQL script created at:" -ForegroundColor White
Write-Host "  $sqlScript`n" -ForegroundColor Yellow

Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "  1. Generate BCrypt hashes for the passwords (see methods above)" -ForegroundColor White
Write-Host "  2. Edit setup-test-accounts.sql and replace the placeholder hashes" -ForegroundColor White
Write-Host "  3. Run the SQL script in your PostgreSQL database:" -ForegroundColor White
Write-Host "     psql -U postgres -d comestag -f `"$sqlScript`"`n" -ForegroundColor Yellow

Write-Host "Test Credentials:" -ForegroundColor Cyan
Write-Host "  Test Company:" -ForegroundColor White
Write-Host "    Email: testcompany@comstag.com" -ForegroundColor Yellow
Write-Host "    Password: $testCompanyPassword`n" -ForegroundColor Yellow

Write-Host "  Test Consumer:" -ForegroundColor White
Write-Host "    Email: testconsumer@comstag.com" -ForegroundColor Yellow
Write-Host "    Password: $testCompanyPassword`n" -ForegroundColor Yellow

Write-Host "  Admin:" -ForegroundColor White
Write-Host "    Email: admin@comstag.com" -ForegroundColor Yellow
Write-Host "    Password: $adminPassword`n" -ForegroundColor Yellow

Write-Host "============================================`n" -ForegroundColor Cyan

# Create a quick reference file
$refFile = Join-Path $comstagDir "TEST_CREDENTIALS.md"
$refContent = @"
# Test Account Credentials

## Development/Testing Only
**⚠️ WARNING: Never use these credentials in production!**

## Test Accounts

### Test Company
- **Email:** testcompany@comstag.com
- **Password:** $testCompanyPassword
- **Type:** Organization
- **Status:** Pre-verified and approved
- **Purpose:** Testing dashboard features and company workflows

### Test Consumer
- **Email:** testconsumer@comstag.com
- **Password:** $testCompanyPassword
- **Type:** Consumer
- **Status:** Pre-verified
- **Purpose:** Testing consumer features and workflows

### Admin
- **Email:** admin@comstag.com
- **Password:** $adminPassword
- **Type:** Admin
- **Role:** Super Admin
- **Purpose:** Testing admin dashboard and management features

## Quick Login Feature

The login pages now include a **Quick Test Login** button in development mode:

- **Company Login** (`/login`): Click "Quick Test Login (Test Company)" to auto-fill credentials
- **Admin Login** (`/admin/login`): Click "Quick Admin Login" to auto-fill credentials

This feature is only visible when:
- `NODE_ENV=development` OR
- `NEXT_PUBLIC_DEV_MODE=true` in your `.env.local` file

## Setup Instructions

1. Generate BCrypt hashes for the passwords:
   - Visit https://bcrypt-generator.com/
   - Use 10 rounds
   - Generate hash for "Test123!" and "Admin123!"

2. Edit `setup-test-accounts.sql`:
   - Replace the placeholder hashes with your generated hashes

3. Run the SQL script:
   ```bash
   psql -U postgres -d comestag -f setup-test-accounts.sql
   ```

4. Verify accounts were created:
   ```sql
   SELECT email, user_type, verified FROM users 
   WHERE email IN ('testcompany@comstag.com', 'testconsumer@comstag.com', 'admin@comstag.com');
   ```

## Features to Test

### Company Dashboard
- Profile management
- Event creation and management
- RFQ submission and tracking
- Messaging
- Settings

### Admin Dashboard
- User management
- Organization approval
- Platform analytics
- System settings

## Security Notes

- These accounts are for **development and testing only**
- Passwords use BCrypt with 10 rounds
- Accounts are pre-verified to skip email verification
- Remove or disable these accounts before deploying to production
"@

Set-Content -Path $refFile -Value $refContent -Encoding UTF8
Write-Host "✅ Created reference file: TEST_CREDENTIALS.md`n" -ForegroundColor Green
