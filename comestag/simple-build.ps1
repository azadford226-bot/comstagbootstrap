# Simple build script
Write-Host "Building backend..."
& ".\mvnw.cmd" clean package -DskipTests
if ($LASTEXITCODE -eq 0) {
    Write-Host "Build successful!" -ForegroundColor Green
} else {
    Write-Host "Build failed!" -ForegroundColor Red
}
