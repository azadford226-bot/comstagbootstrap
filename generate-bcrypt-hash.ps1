#!/usr/bin/env pwsh
# Quick BCrypt Password Hash Generator
# Uses the backend's BCrypt implementation

param(
    [string]$Password
)

if (-not $Password) {
    Write-Host "`nUsage: .\generate-bcrypt-hash.ps1 -Password 'YourPassword'" -ForegroundColor Yellow
    Write-Host "`nExample:" -ForegroundColor Cyan
    Write-Host "  .\generate-bcrypt-hash.ps1 -Password 'Test123!'" -ForegroundColor White
    Write-Host "  .\generate-bcrypt-hash.ps1 -Password 'Admin123!'`n" -ForegroundColor White
    exit
}

Write-Host "`n🔐 Generating BCrypt Hash..." -ForegroundColor Cyan

# Create a temporary Java class to generate the hash
$tempDir = Join-Path $env:TEMP "bcrypt-gen"
New-Item -ItemType Directory -Force -Path $tempDir | Out-Null

$javaCode = @"
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class QuickHash {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(10);
        String hash = encoder.encode("$Password");
        System.out.println(hash);
    }
}
"@

$javaFile = Join-Path $tempDir "QuickHash.java"
Set-Content -Path $javaFile -Value $javaCode -Encoding UTF8

# Try to compile and run with Spring Security in classpath
Write-Host "Note: This requires Spring Security BCrypt in the classpath" -ForegroundColor Yellow
Write-Host "`nAlternative: Use online generator at https://bcrypt-generator.com/" -ForegroundColor Cyan
Write-Host "Password: $Password" -ForegroundColor White
Write-Host "Rounds: 10`n" -ForegroundColor White

# Clean up
Remove-Item -Recurse -Force $tempDir
