# Admin Login Diagnostic Script

Write-Host "=== Admin Login Diagnostic ===" -ForegroundColor Cyan
Write-Host ""

# Check if backend is running
Write-Host "1. Checking backend process..." -ForegroundColor Yellow
$javaProcess = Get-Process -Name "java" -ErrorAction SilentlyContinue
if ($javaProcess) {
    Write-Host "   [OK] Java process running (PID: $($javaProcess.Id))" -ForegroundColor Green
} else {
    Write-Host "   [ERROR] No Java process found!" -ForegroundColor Red
    Write-Host "   Start backend with: java -jar target\comestag-0.0.1-SNAPSHOT.jar" -ForegroundColor Yellow
    exit
}

# Check if port is listening
Write-Host "`n2. Checking port 8080..." -ForegroundColor Yellow
$port8080 = netstat -ano | findstr ":8080" | findstr "LISTENING"
if ($port8080) {
    Write-Host "   [OK] Port 8080 is listening" -ForegroundColor Green
} else {
    Write-Host "   [ERROR] Port 8080 is not listening!" -ForegroundColor Red
    exit
}

# Test backend health
Write-Host "`n3. Testing backend health endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/actuator/health" -Method GET -TimeoutSec 5 -ErrorAction Stop
    Write-Host "   [OK] Backend is responding!" -ForegroundColor Green
    Write-Host "   Response: $($response.Content)" -ForegroundColor Gray
} catch {
    Write-Host "   [ERROR] Backend not responding: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   The backend may be stuck during startup." -ForegroundColor Yellow
    Write-Host "   Check the backend console for errors." -ForegroundColor Yellow
    exit
}

# Test login endpoint
Write-Host "`n4. Testing admin login endpoint..." -ForegroundColor Yellow
try {
    $body = @{
        email = "admin@comstag.com"
        password = "Admin@123!"
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "http://localhost:8080/v1/auth/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body $body `
        -TimeoutSec 5 `
        -ErrorAction Stop
    
    Write-Host "   [SUCCESS] Login endpoint works!" -ForegroundColor Green
    Write-Host "   Response: $($response.Content)" -ForegroundColor Gray
    Write-Host "`n   Admin login should work in the browser!" -ForegroundColor Green
} catch {
    if ($_.Exception.Response) {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "   [INFO] Backend responded with status: $statusCode" -ForegroundColor Yellow
        
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "   Response: $responseBody" -ForegroundColor Gray
        
        if ($statusCode -eq 401 -or $statusCode -eq 400) {
            Write-Host "`n   [ERROR] Login failed - check:" -ForegroundColor Red
            Write-Host "   1. Admin account exists in database" -ForegroundColor Yellow
            Write-Host "   2. Password is correct: Admin@123!" -ForegroundColor Yellow
            Write-Host "   3. Migration V5 has run" -ForegroundColor Yellow
        }
    } else {
        Write-Host "   [ERROR] Login endpoint not responding: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "   Backend may still be starting or there's a connection issue." -ForegroundColor Yellow
    }
}

Write-Host "`n=== Next Steps ===" -ForegroundColor Cyan
Write-Host "If login still doesn't work:" -ForegroundColor Yellow
Write-Host "1. Check browser console (F12) for errors" -ForegroundColor White
Write-Host "2. Verify admin account in database:" -ForegroundColor White
Write-Host "   SELECT * FROM accounts WHERE email = 'admin@comstag.com';" -ForegroundColor Gray
Write-Host "3. Check backend logs for startup errors" -ForegroundColor White
Write-Host "4. Try restarting the backend" -ForegroundColor White
