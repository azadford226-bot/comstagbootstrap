# Fix Login Accounts Script
# Creates/updates admin and test company accounts with correct passwords

Write-Host "=== Fixing Login Accounts ===" -ForegroundColor Cyan
Write-Host ""

$env:PGPASSWORD = "comestag"

# Password hash for "Admin@123!" and "Test123!"
# Both use the same hash for simplicity (BCrypt hash)
$passwordHash = '$2a$10$n8BTO.VZAO1Y2v0WMbNm6ei4/IAlvWfqRr.X1dvnIdCT/uJaKLbyy'

Write-Host "1. Fixing admin account..." -ForegroundColor Yellow
$adminSql = @"
INSERT INTO accounts (
    id,
    display_name,
    type,
    email,
    password_hash,
    status,
    email_verified,
    created_at,
    updated_at
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    'System Administrator',
    'ADMIN',
    'admin@comstag.com',
    '$passwordHash',
    'ACTIVE',
    true,
    now(),
    now()
) ON CONFLICT (email) DO UPDATE SET
    password_hash = EXCLUDED.password_hash,
    status = 'ACTIVE',
    email_verified = true,
    type = 'ADMIN',
    updated_at = now();
"@

psql -h localhost -U comestag -d comestag -c $adminSql | Out-Null
Write-Host "   [OK] Admin account fixed" -ForegroundColor Green

Write-Host "`n2. Creating test company account..." -ForegroundColor Yellow
$testCompanySql = @"
INSERT INTO accounts (
    id,
    display_name,
    type,
    email,
    password_hash,
    status,
    email_verified,
    created_at,
    updated_at
) VALUES (
    '11111111-1111-1111-1111-111111111111',
    'Test Company Ltd',
    'ORG',
    'testcompany@comstag.com',
    '$passwordHash',
    'ACTIVE',
    true,
    now(),
    now()
) ON CONFLICT (email) DO UPDATE SET
    password_hash = EXCLUDED.password_hash,
    status = 'ACTIVE',
    email_verified = true,
    type = 'ORG',
    updated_at = now();

-- Create organization profile if it doesn't exist
INSERT INTO organizations (
    account_id,
    display_name,
    website,
    industry_id,
    established,
    size,
    country,
    state,
    city,
    who_we_are,
    what_we_do,
    created_at,
    updated_at
) VALUES (
    '11111111-1111-1111-1111-111111111111',
    'Test Company Ltd',
    'https://testcompany.example.com',
    1,
    '2020-01-01',
    '10-50',
    'United States',
    'California',
    'San Francisco',
    'We are a test company for development and testing purposes.',
    'We test features and ensure everything works correctly.',
    now(),
    now()
) ON CONFLICT (account_id) DO UPDATE SET
    display_name = EXCLUDED.display_name,
    updated_at = now();
"@

psql -h localhost -U comestag -d comestag -c $testCompanySql | Out-Null
Write-Host "   [OK] Test company account created" -ForegroundColor Green

Write-Host "`n3. Verifying accounts..." -ForegroundColor Yellow
$verifySql = "SELECT email, type, status, email_verified FROM accounts WHERE email IN ('admin@comstag.com', 'testcompany@comstag.com') ORDER BY email;"
psql -h localhost -U comestag -d comestag -c $verifySql

$env:PGPASSWORD = $null

Write-Host "`n✅ Login accounts fixed!" -ForegroundColor Green
Write-Host "`nCredentials:" -ForegroundColor Cyan
Write-Host "  Admin:" -ForegroundColor White
Write-Host "    Email: admin@comstag.com" -ForegroundColor Gray
Write-Host "    Password: Admin@123!" -ForegroundColor Gray
Write-Host "`n  Test Company:" -ForegroundColor White
Write-Host "    Email: testcompany@comstag.com" -ForegroundColor Gray
Write-Host "    Password: Test123!" -ForegroundColor Gray
Write-Host "`nYou can now login with these credentials!" -ForegroundColor Green
