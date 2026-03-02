# Test Companies for Testing

This document contains the credentials for 2 test companies that can be used to test all features of the application.

## Prerequisites

1. **Backend must be running** on `http://localhost:8081`
2. **Database must be set up** and migrations applied
3. Run the registration script: `.\register-test-companies.ps1`

## Test Company 1: Tech Solutions Inc

### Registration Details
- **Email**: `techsolutions@testcompany.com`
- **Password**: `TestCompany123!`
- **Company Name**: Tech Solutions Inc
- **Industry**: Software & IT Services (ID: 1)
- **Established**: May 15, 2018
- **Size**: 50-200 employees
- **Location**: San Francisco, California, United States
- **Website**: https://techsolutions-test.com

### Company Description
**Who We Are:**
Tech Solutions Inc is a leading software development company specializing in enterprise solutions and custom software development. We have been serving clients across various industries for over 6 years.

**What We Do:**
We provide end-to-end software development services including web applications, mobile apps, cloud solutions, and system integration. Our team of experienced developers delivers high-quality, scalable solutions tailored to our clients' needs.

---

## Test Company 2: Digital Innovations LLC

### Registration Details
- **Email**: `digitalinnovations@testcompany.com`
- **Password**: `TestCompany456!`
- **Company Name**: Digital Innovations LLC
- **Industry**: SaaS & Cloud Platforms (ID: 2)
- **Established**: March 20, 2020
- **Size**: 10-50 employees
- **Location**: New York City, New York, United States
- **Website**: https://digitalinnovations-test.com

### Company Description
**Who We Are:**
Digital Innovations LLC is a fast-growing SaaS company focused on building innovative cloud-based solutions for businesses. We combine cutting-edge technology with user-centric design to create products that make a difference.

**What We Do:**
We develop and maintain SaaS platforms for project management, customer relationship management, and business analytics. Our cloud-native solutions help businesses streamline operations and improve productivity.

---

## Email Verification

After registration, both companies will receive verification emails. You'll need to:

1. **Check the email inboxes** for verification codes (if email service is configured)
2. **Or check application logs** for verification codes (in development mode)
3. **Verify the email** using the verification link or code

### Verification Endpoint
```
POST http://localhost:8081/v1/auth/email-verify?identifier={userId}_{code}
```

The identifier format is: `{userId}_{6-digit-code}`

### Alternative: Manual Verification via Database

If email service is not configured, you can manually verify accounts in the database:

```sql
-- Find the account IDs
SELECT id, email, email_verified FROM accounts WHERE email IN (
    'techsolutions@testcompany.com',
    'digitalinnovations@testcompany.com'
);

-- Manually verify the emails (replace {account_id} with actual UUIDs)
UPDATE accounts SET email_verified = TRUE WHERE id = '{account_id}';
```

---

## Login Credentials Summary

| Company | Email | Password |
|---------|-------|----------|
| Tech Solutions Inc | `techsolutions@testcompany.com` | `TestCompany123!` |
| Digital Innovations LLC | `digitalinnovations@testcompany.com` | `TestCompany456!` |

---

## Testing Features

These test companies can be used to test:

1. **Authentication & Authorization**
   - Login with email and password
   - Email verification flow
   - Password reset

2. **Profile Management**
   - View organization profile
   - Edit organization details
   - Upload profile and cover images

3. **RFQ System**
   - Create RFQs
   - Submit proposals
   - Award RFQs
   - View RFQ details

4. **Messaging**
   - Send messages between companies
   - Real-time messaging via SSE
   - Conversation management

5. **Posts & Media**
   - Create posts
   - Upload media files
   - Manage media library

6. **Events**
   - Create events
   - Register for events
   - View event registrations

7. **Testimonials**
   - Write testimonials
   - View testimonials

---

## Registration Script

To register these companies, run:

```powershell
cd comestag
.\register-test-companies.ps1
```

The script will:
- Register both companies via the API
- Display credentials
- Provide verification instructions

---

## Notes

- These are test accounts with realistic but fictional data
- Email addresses use the `@testcompany.com` domain (may need email service configuration)
- Passwords meet the minimum requirements (8+ characters, mixed case, numbers, special characters)
- All data is suitable for testing various features of the application
