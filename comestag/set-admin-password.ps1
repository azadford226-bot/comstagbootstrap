# Script to update admin password
# Usage: .\set-admin-password.ps1 "YourNewPassword"

param(
    [Parameter(Mandatory=$false)]
    [string]$NewPassword = "Admin@123!"
)

Write-Host "Admin Password Update Utility" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Cyan
Write-Host ""

# Use Spring Boot's BCryptPasswordEncoder to generate hash
# We'll use a Java one-liner with the running classpath

$jarPath = "target\comestag-0.0.1-SNAPSHOT.jar"

if (-not (Test-Path $jarPath)) {
    Write-Host "Error: JAR file not found at $jarPath" -ForegroundColor Red
    exit 1
}

Write-Host "Generating BCrypt hash for password: $NewPassword" -ForegroundColor Yellow
Write-Host ""

# Create a temporary Java file to generate hash
$tempJava = @"
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class TempHashGen {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String hash = encoder.encode(args[0]);
        System.out.println(hash);
    }
}
"@

$tempDir = New-Item -ItemType Directory -Force -Path "temp_hash_gen"
$tempJava | Out-File -FilePath "$tempDir\TempHashGen.java" -Encoding UTF8

try {
    # Compile and run
    Write-Host "Compiling hash generator..." -ForegroundColor Gray
    $classpath = (Get-Item $jarPath).FullName
    javac -cp $classpath "$tempDir\TempHashGen.java" 2>&1 | Out-Null
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Compilation failed, using alternative method..." -ForegroundColor Yellow
        
        # Alternative: Use psql to update with a known good hash for common passwords
        $knownHashes = @{
            "Admin@123!" = '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG'
            "password" = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
            "admin" = '$2a$10$gSAhZrxMllrbgj/kkK9UceBPpChGWJA7SLkhOCxmnO7hJrjfNOB4G'
        }
        
        if ($knownHashes.ContainsKey($NewPassword)) {
            $hash = $knownHashes[$NewPassword]
            Write-Host "Using pre-generated hash for '$NewPassword'" -ForegroundColor Green
        } else {
            Write-Host "Error: Cannot generate hash for custom password" -ForegroundColor Red
            Write-Host "Supported passwords: Admin@123!, password, admin" -ForegroundColor Yellow
            exit 1
        }
    } else {
        Write-Host "Generating hash..." -ForegroundColor Gray
        $hash = java -cp "$classpath;$tempDir" TempHashGen $NewPassword
    }
    
    Write-Host ""
    Write-Host "Updating database..." -ForegroundColor Cyan
    
    $env:PGPASSWORD = "comestag"
    $updateQuery = "UPDATE accounts SET password_hash = '$hash' WHERE email = 'admin@comstag.com';"
    
    psql -U comestag -d comestag -c $updateQuery
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✓ Password updated successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Host "New credentials:" -ForegroundColor Cyan
        Write-Host "  Email:    admin@comstag.com" -ForegroundColor White
        Write-Host "  Password: $NewPassword" -ForegroundColor White
    } else {
        Write-Host "✗ Database update failed" -ForegroundColor Red
    }
    
} finally {
    # Cleanup
    Remove-Item -Recurse -Force $tempDir -ErrorAction SilentlyContinue
}
