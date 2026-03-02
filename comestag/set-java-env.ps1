# Script to help find and set Java environment
Write-Host "Searching for Java installation..." -ForegroundColor Yellow

# Common Java installation locations
$javaPaths = @(
    "$env:ProgramFiles\Eclipse Adoptium",
    "$env:ProgramFiles\Java",
    "$env:ProgramFiles (x86)\Java",
    "$env:LOCALAPPDATA\Programs\Eclipse Adoptium",
    "C:\Program Files\Eclipse Adoptium",
    "C:\Program Files\Java",
    "$env:USERPROFILE\.jdks"
)

$foundJava = $null

foreach ($basePath in $javaPaths) {
    if (Test-Path $basePath) {
        Write-Host "Checking: $basePath" -ForegroundColor Gray
        $jdkFolders = Get-ChildItem $basePath -Directory -ErrorAction SilentlyContinue | Where-Object {
            $_.Name -match 'jdk|java|temurin' -and (Test-Path (Join-Path $_.FullName "bin\java.exe"))
        }
        
        if ($jdkFolders) {
            # Get the latest version
            $latest = $jdkFolders | Sort-Object Name -Descending | Select-Object -First 1
            $foundJava = $latest.FullName
            Write-Host "`nFound Java at: $foundJava" -ForegroundColor Green
            break
        }
    }
}

if ($foundJava) {
    $javaExe = Join-Path $foundJava "bin\java.exe"
    if (Test-Path $javaExe) {
        Write-Host "`nSetting JAVA_HOME for this session..." -ForegroundColor Yellow
        $env:JAVA_HOME = $foundJava
        $env:PATH = "$foundJava\bin;$env:PATH"
        
        Write-Host "`nJAVA_HOME: $env:JAVA_HOME" -ForegroundColor Cyan
        Write-Host "`nVerifying Java..." -ForegroundColor Yellow
        & $javaExe -version
        
        Write-Host "`n✅ Java environment configured!" -ForegroundColor Green
        Write-Host "`nNote: This only sets JAVA_HOME for the current PowerShell session." -ForegroundColor Yellow
        Write-Host "To make it permanent, run this as Administrator:" -ForegroundColor Yellow
        Write-Host "[Environment]::SetEnvironmentVariable('JAVA_HOME', '$foundJava', 'Machine')" -ForegroundColor Gray
        Write-Host "[Environment]::SetEnvironmentVariable('PATH', `$env:PATH + ';$foundJava\bin', 'Machine')" -ForegroundColor Gray
    }
} else {
    Write-Host "`n❌ Java not found in common locations." -ForegroundColor Red
    Write-Host "`nPlease:" -ForegroundColor Yellow
    Write-Host "1. Restart your terminal/PowerShell after installing Java" -ForegroundColor White
    Write-Host "2. Or manually set JAVA_HOME:" -ForegroundColor White
    Write-Host "   `$env:JAVA_HOME = 'C:\path\to\your\java'" -ForegroundColor Gray
    Write-Host "   `$env:PATH = `"`$env:JAVA_HOME\bin;`$env:PATH`"" -ForegroundColor Gray
}


