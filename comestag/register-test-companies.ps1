# Script to register 2 test companies for testing
# This script registers companies via the API and provides login credentials

# Try to detect backend port, default to 8080
$API_BASE_URL = "http://localhost:8080"
if ($env:NEXT_PUBLIC_API_BASE_URL) {
    $API_BASE_URL = $env:NEXT_PUBLIC_API_BASE_URL
} else {
    # Check if backend is on port 8081 (local profile)
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8081/actuator/health" -Method GET -TimeoutSec 2 -ErrorAction Stop
        $API_BASE_URL = "http://localhost:8081"
        Write-Host "Detected backend on port 8081" -ForegroundColor Cyan
    } catch {
        # Default to 8080
        $API_BASE_URL = "http://localhost:8080"
    }
}

Write-Host ""
Write-Host "=== Registering Test Companies ===" -ForegroundColor Cyan
Write-Host "API Base URL: $API_BASE_URL" -ForegroundColor Yellow
Write-Host ""

# Company 1: Tech Solutions Inc
$company1 = @{
    email = "techsolutions@testcompany.com"
    password = "TestCompany123!"
    displayName = "Tech Solutions Inc"
    industryId = 1
    established = "2018-05-15"
    size = "50-200"
    country = "United States"
    state = "California"
    city = "San Francisco"
    website = "https://techsolutions-test.com"
    whoWeAre = "Tech Solutions Inc is a leading software development company specializing in enterprise solutions and custom software development. We have been serving clients across various industries for over 6 years."
    whatWeDo = "We provide end-to-end software development services including web applications, mobile apps, cloud solutions, and system integration. Our team of experienced developers delivers high-quality, scalable solutions tailored to our clients' needs."
} | ConvertTo-Json

# Company 2: Digital Innovations LLC
$company2 = @{
    email = "digitalinnovations@testcompany.com"
    password = "TestCompany456!"
    displayName = "Digital Innovations LLC"
    industryId = 2
    established = "2020-03-20"
    size = "10-50"
    country = "United States"
    state = "New York"
    city = "New York City"
    website = "https://digitalinnovations-test.com"
    whoWeAre = "Digital Innovations LLC is a fast-growing SaaS company focused on building innovative cloud-based solutions for businesses. We combine cutting-edge technology with user-centric design to create products that make a difference."
    whatWeDo = "We develop and maintain SaaS platforms for project management, customer relationship management, and business analytics. Our cloud-native solutions help businesses streamline operations and improve productivity."
} | ConvertTo-Json

# Function to register a company
function Register-Company {
    param(
        [string]$CompanyData,
        [string]$CompanyName
    )
    
    Write-Host "Registering $CompanyName..." -ForegroundColor Yellow
    
    try {
        $response = Invoke-RestMethod -Uri "$API_BASE_URL/v1/auth/register/org" `
            -Method POST `
            -ContentType "application/json" `
            -Body $CompanyData `
            -ErrorAction Stop
        
        Write-Host "[SUCCESS] $CompanyName registered successfully!" -ForegroundColor Green
        return $true
    }
    catch {
        $statusCode = $null
        $errorBody = ""
        
        if ($_.Exception.Response) {
            $statusCode = $_.Exception.Response.StatusCode.value__
            $errorBody = $_.ErrorDetails.Message
        }
        
        if ($statusCode -eq 409) {
            Write-Host "[WARNING] $CompanyName already exists (email already registered)" -ForegroundColor Yellow
            return $true
        }
        elseif ($statusCode -eq 400) {
            Write-Host "[ERROR] Registration failed: Invalid data" -ForegroundColor Red
            if ($errorBody) {
                Write-Host "   Error: $errorBody" -ForegroundColor Red
            }
            return $false
        }
        elseif ($statusCode -eq $null) {
            $errorMessage = $_.Exception.Message
            if ($errorMessage -like "*connection*" -or $errorMessage -like "*refused*") {
                Write-Host "[ERROR] Cannot connect to backend server at $API_BASE_URL" -ForegroundColor Red
                Write-Host "   Make sure the backend is running and accessible" -ForegroundColor Red
            } else {
                Write-Host "[ERROR] Registration failed: $errorMessage" -ForegroundColor Red
            }
            return $false
        }
        else {
            Write-Host "[ERROR] Registration failed: HTTP $statusCode" -ForegroundColor Red
            if ($errorBody) {
                Write-Host "   Error: $errorBody" -ForegroundColor Red
            }
            return $false
        }
    }
}

# Register both companies
$company1Success = Register-Company -CompanyData $company1 -CompanyName "Tech Solutions Inc"
$company2Success = Register-Company -CompanyData $company2 -CompanyName "Digital Innovations LLC"

# Display summary
Write-Host ""
Write-Host "=== Registration Summary ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Test Company Credentials:" -ForegroundColor Yellow
Write-Host ""
Write-Host "Company 1: Tech Solutions Inc" -ForegroundColor White
Write-Host "  Email: techsolutions@testcompany.com" -ForegroundColor Gray
Write-Host "  Password: TestCompany123!" -ForegroundColor Gray
Write-Host "  Industry: Software and IT Services" -ForegroundColor Gray
Write-Host "  Location: San Francisco, CA, USA" -ForegroundColor Gray

Write-Host ""
Write-Host "Company 2: Digital Innovations LLC" -ForegroundColor White
Write-Host "  Email: digitalinnovations@testcompany.com" -ForegroundColor Gray
Write-Host "  Password: TestCompany456!" -ForegroundColor Gray
Write-Host "  Industry: SaaS and Cloud Platforms" -ForegroundColor Gray
Write-Host "  Location: New York City, NY, USA" -ForegroundColor Gray

Write-Host ""
Write-Host "[IMPORTANT] Email Verification Required" -ForegroundColor Yellow
Write-Host "After registration, check the email inboxes for verification codes." -ForegroundColor White
Write-Host "You will need to verify the email addresses before you can log in." -ForegroundColor White
Write-Host ""
Write-Host "To verify emails, use the endpoint:" -ForegroundColor Cyan
Write-Host "  POST $API_BASE_URL/v1/auth/email-verify" -ForegroundColor Gray
Write-Host "  Body: { email: <email>, code: <verification_code> }" -ForegroundColor Gray

Write-Host ""
Write-Host "[SUCCESS] Registration complete!" -ForegroundColor Green
