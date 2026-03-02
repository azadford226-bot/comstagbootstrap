# Critical User Flows Testing Guide

This document outlines testing procedures for all critical user flows in the Comestag platform.

## Prerequisites

Before testing, ensure:
- ✅ Backend is running on port 3000
- ✅ Frontend is accessible
- ✅ Database is set up and migrations have run
- ✅ Test accounts are available (or create new ones)

---

## 1. Authentication Flows

### 1.1 User Registration (Organization)

**Steps:**
1. Navigate to `/signup`
2. Select "Organization" account type
3. Fill in registration form:
   - Email (must not be blocked domain)
   - Password (meet requirements)
   - Display name
   - Industry, size, location, etc.
4. Submit registration
5. Check email for verification code
6. Enter verification code
7. Verify account is created and status is PENDING

**Expected Results:**
- ✅ Registration form validates input
- ✅ Email verification code is sent
- ✅ Account created with PENDING status
- ✅ Organization profile created
- ✅ Redirected to under-review page

**Test Accounts:**
- Email: `test-org@example.com`
- Password: `Test@123!`

---

### 1.2 User Registration (Consumer)

**Steps:**
1. Navigate to `/signup`
2. Select "Consumer" account type
3. Fill in registration form
4. Submit and verify email
5. Complete profile setup

**Expected Results:**
- ✅ Consumer account created
- ✅ Profile can be edited
- ✅ Status is ACTIVE (consumers don't need approval)

---

### 1.3 User Login

**Steps:**
1. Navigate to `/login`
2. Enter email and password
3. Submit form
4. Check email for verification code
5. Enter verification code
6. Verify tokens are stored
7. Verify redirect to dashboard

**Expected Results:**
- ✅ Login request succeeds
- ✅ Verification code sent to email
- ✅ Code verification succeeds
- ✅ Access token and refresh token stored
- ✅ User redirected to appropriate dashboard
- ✅ User info displayed correctly

**Test Accounts:**
- Admin: `admin@comstag.com` / `Admin@123!`
- Organization: Use registered org account
- Consumer: Use registered consumer account

---

### 1.4 Password Reset

**Steps:**
1. Navigate to `/forgot-password`
2. Enter email address
3. Submit form
4. Check email for reset code
5. Navigate to `/reset-password`
6. Enter code and new password
7. Verify password is changed
8. Login with new password

**Expected Results:**
- ✅ Reset code sent to email
- ✅ Code verification works
- ✅ Password can be changed
- ✅ Login with new password succeeds

---

### 1.5 Email Verification

**Steps:**
1. Register new account (or use unverified account)
2. Check email for verification code
3. Navigate to `/verify-email`
4. Enter code
5. Verify account status changes to verified

**Expected Results:**
- ✅ Verification code received
- ✅ Code verification succeeds
- ✅ Account email_verified flag set to true

---

## 2. Admin Flows

### 2.1 Admin Login

**Steps:**
1. Navigate to `/admin/login`
2. Enter admin credentials: `admin@comstag.com` / `Admin@123!`
3. Enter verification code
4. Verify redirect to `/admin/dashboard`

**Expected Results:**
- ✅ Admin login succeeds
- ✅ User type set to ADMIN
- ✅ Redirected to admin dashboard
- ✅ Admin-only features accessible

---

### 2.2 Admin Dashboard - View Statistics

**Steps:**
1. Login as admin
2. Navigate to `/admin/dashboard`
3. View Overview tab
4. Check statistics cards

**Expected Results:**
- ✅ Statistics load correctly:
  - Total Organizations
  - Total Consumers
  - Total Admins
  - Pending Organizations
  - Unread Contact Messages
  - Total Conversations
- ✅ Numbers match actual database counts
- ✅ Cards are clickable (navigate to relevant tabs)

---

### 2.3 Admin - Approve Organization

**Steps:**
1. Login as admin
2. Navigate to "Pending Organizations" tab
3. View pending organization details
4. Click "Approve" button
5. Verify organization status changes
6. Refresh and verify organization no longer in pending list

**Expected Results:**
- ✅ Pending organizations list loads
- ✅ Organization details displayed correctly
- ✅ Approve button works
- ✅ Organization status changes to ACTIVE
- ✅ Organization removed from pending list
- ✅ Statistics update (pending count decreases)

**Test Data:**
- Create a test organization account (status will be PENDING)
- Use this account for approval testing

---

### 2.4 Admin - View Contact Messages

**Steps:**
1. Login as admin
2. Navigate to "Contact Messages" tab
3. View all messages
4. Toggle "Unread only" filter
5. Click "Mark Read" on unread message
6. Verify message status changes

**Expected Results:**
- ✅ Contact messages list loads
- ✅ Unread messages highlighted
- ✅ Message details displayed correctly
- ✅ "Mark Read" button works
- ✅ Message status updates
- ✅ Statistics update (unread count decreases)

**Test Data:**
- Submit contact form from `/contact` page
- Messages should appear in admin dashboard

---

## 3. Organization Flows

### 3.1 Create Event

**Steps:**
1. Login as organization
2. Navigate to `/event/create`
3. Fill in event form:
   - Title, description
   - Date, time, location
   - Event type (online/offline)
   - Registration settings
4. Submit form
5. Verify event is created

**Expected Results:**
- ✅ Event form validates input
- ✅ Event created successfully
- ✅ Event appears in "My Events" list
- ✅ Event visible in public events list

---

### 3.2 Edit Event

**Steps:**
1. Login as organization
2. Navigate to an event you created
3. Click "Edit" button
4. Modify event details
5. Save changes
6. Verify changes are reflected

**Expected Results:**
- ✅ Edit form loads with current data
- ✅ Changes save successfully
- ✅ Updated event details displayed
- ✅ Only event owner can edit

---

### 3.3 Create Post

**Steps:**
1. Login as organization
2. Navigate to dashboard or profile
3. Create a new post
4. Add content, hashtags, media
5. Submit post
6. Verify post appears in feed

**Expected Results:**
- ✅ Post creation form works
- ✅ Media upload works (if applicable)
- ✅ Post appears in feed
- ✅ Post visible on organization profile

---

### 3.4 Create RFQ

**Steps:**
1. Login as organization
2. Navigate to `/rfq`
3. Click "Create RFQ"
4. Fill in RFQ form:
   - Title, description
   - Category, industry
   - Budget, deadline
   - Requirements
5. Submit RFQ
6. Verify RFQ is created

**Expected Results:**
- ✅ RFQ form validates input
- ✅ RFQ created successfully
- ✅ RFQ appears in list
- ✅ RFQ visible to other organizations (if PUBLIC)

---

## 4. Consumer Flows

### 4.1 Register for Event

**Steps:**
1. Login as consumer
2. Navigate to `/events`
3. Browse available events
4. Click on an event
5. Click "Register" button
6. Verify registration

**Expected Results:**
- ✅ Events list loads
- ✅ Event details displayed
- ✅ Registration succeeds
- ✅ Registration appears in "My Registrations"
- ✅ Event registration count increases

---

### 4.2 Submit Testimonial

**Steps:**
1. Login as consumer
2. Navigate to an organization profile
3. Click "Write Testimonial"
4. Fill in testimonial form:
   - Rating (1-5 stars)
   - Review text
5. Submit testimonial
6. Verify testimonial appears

**Expected Results:**
- ✅ Testimonial form works
- ✅ Rating validation works
- ✅ Testimonial submitted successfully
- ✅ Testimonial appears on organization profile
- ✅ Organization's rating updated

---

### 4.3 Submit RFQ Proposal

**Steps:**
1. Login as organization (to submit proposal to another org's RFQ)
2. Navigate to `/rfq`
3. Browse available RFQs
4. Click on an RFQ
5. Click "Submit Proposal"
6. Fill in proposal form
7. Submit proposal
8. Verify proposal is submitted

**Expected Results:**
- ✅ RFQ details displayed
- ✅ Proposal form works
- ✅ Proposal submitted successfully
- ✅ Proposal count increases on RFQ
- ✅ RFQ owner can see proposals

---

## 5. Messaging Flows

### 5.1 Start Conversation

**Steps:**
1. Login as consumer or organization
2. Navigate to organization/consumer profile
3. Click "Message" or "Contact" button
4. Send initial message
5. Verify conversation is created

**Expected Results:**
- ✅ Conversation created
- ✅ Message sent successfully
- ✅ Conversation appears in messages list
- ✅ Recipient receives notification (if implemented)

---

### 5.2 Send Message

**Steps:**
1. Login as user
2. Navigate to `/messages`
3. Select a conversation
4. Type message
5. Send message
6. Verify message appears

**Expected Results:**
- ✅ Messages list loads
- ✅ Conversation selected
- ✅ Message sent successfully
- ✅ Message appears in conversation
- ✅ Real-time updates (if SSE implemented)

---

### 5.3 Mark Conversation as Read

**Steps:**
1. Login as user
2. Navigate to `/messages`
3. Select unread conversation
4. Verify conversation marked as read
5. Check unread count updates

**Expected Results:**
- ✅ Conversation automatically marked as read when opened
- ✅ Unread count decreases
- ✅ Conversation no longer shows as unread

---

## 6. Profile Management Flows

### 6.1 Edit Organization Profile

**Steps:**
1. Login as organization
2. Navigate to `/profile/edit`
3. Update profile fields:
   - Display name
   - About sections
   - Location
   - Website
   - Media (profile image, cover image)
4. Save changes
5. Verify changes reflected

**Expected Results:**
- ✅ Profile edit form loads with current data
- ✅ All fields can be updated
- ✅ Media upload works
- ✅ Changes save successfully
- ✅ Updated profile displayed

---

### 6.2 Edit Consumer Profile

**Steps:**
1. Login as consumer
2. Navigate to `/consumer-profile/edit`
3. Update profile information
4. Save changes
5. Verify changes reflected

**Expected Results:**
- ✅ Consumer profile edit form works
- ✅ Changes save successfully
- ✅ Updated profile displayed

---

### 6.3 View Public Profile

**Steps:**
1. Login as any user
2. Navigate to `/organization/[orgId]` or `/profile/[userId]`
3. View public profile
4. Verify all public information displayed

**Expected Results:**
- ✅ Profile loads correctly
- ✅ Public information displayed
- ✅ Private information hidden
- ✅ Posts, events, testimonials visible (if applicable)

---

## 7. Contact Form Flow

### 7.1 Submit Contact Form

**Steps:**
1. Navigate to `/contact` (no login required)
2. Fill in contact form:
   - Name
   - Email
   - Subject
   - Message
3. Submit form
4. Verify submission

**Expected Results:**
- ✅ Form validates input
- ✅ Submission succeeds
- ✅ Success message displayed
- ✅ Message appears in admin dashboard
- ✅ Email sent to contact email (if configured)

---

## 8. Error Handling Tests

### 8.1 Invalid Credentials

**Steps:**
1. Attempt login with wrong password
2. Verify error message
3. Attempt login with non-existent email
4. Verify error message

**Expected Results:**
- ✅ Appropriate error messages displayed
- ✅ No sensitive information leaked
- ✅ Rate limiting works (after multiple attempts)

---

### 8.2 Unauthorized Access

**Steps:**
1. Try to access admin dashboard as non-admin
2. Try to edit another user's event
3. Try to access protected endpoints without token

**Expected Results:**
- ✅ Access denied (403 or redirect)
- ✅ Appropriate error messages
- ✅ No data exposed

---

### 8.3 Invalid Input

**Steps:**
1. Submit forms with invalid data:
   - Empty required fields
   - Invalid email format
   - Password too short
   - Invalid date ranges
2. Verify validation errors

**Expected Results:**
- ✅ Client-side validation works
- ✅ Server-side validation works
- ✅ Clear error messages displayed
- ✅ Form highlights errors

---

## 9. Performance Tests

### 9.1 Load Time

**Test:**
- Measure page load times
- Check API response times
- Verify no slow queries

**Expected Results:**
- ✅ Pages load in < 2 seconds
- ✅ API responses in < 500ms
- ✅ No N+1 query problems

---

### 9.2 Concurrent Users

**Test:**
- Simulate multiple users accessing simultaneously
- Test concurrent logins
- Test concurrent data modifications

**Expected Results:**
- ✅ No race conditions
- ✅ Data integrity maintained
- ✅ Performance acceptable

---

## 10. Security Tests

### 10.1 XSS Protection

**Test:**
- Submit forms with script tags
- Check if scripts are executed

**Expected Results:**
- ✅ Scripts are escaped/sanitized
- ✅ No XSS vulnerabilities

---

### 10.2 SQL Injection

**Test:**
- Attempt SQL injection in form fields
- Check database queries

**Expected Results:**
- ✅ JPA/Hibernate protects against SQL injection
- ✅ No raw SQL queries vulnerable

---

### 10.3 CSRF Protection

**Test:**
- Verify CSRF tokens (if implemented)
- Test form submissions

**Expected Results:**
- ✅ CSRF protection in place (or stateless API)
- ✅ Forms submit correctly

---

## Test Checklist

Before considering testing complete, verify:

- [ ] All authentication flows work
- [ ] Admin dashboard functions correctly
- [ ] Organization approval works
- [ ] Contact messages can be viewed and marked read
- [ ] Events can be created, edited, and viewed
- [ ] Posts can be created and viewed
- [ ] RFQs can be created and proposals submitted
- [ ] Messages/conversations work
- [ ] Profiles can be edited
- [ ] Contact form works
- [ ] Error handling is appropriate
- [ ] Security measures work
- [ ] Performance is acceptable

---

## Test Data Setup

### Create Test Accounts

**Admin:**
- Email: `admin@comstag.com`
- Password: `Admin@123!`
- (Already exists in database)

**Organization:**
- Register new organization account
- Status will be PENDING (needs admin approval)

**Consumer:**
- Register new consumer account
- Status will be ACTIVE (no approval needed)

### Create Test Data

- Create test events
- Create test posts
- Create test RFQs
- Submit test contact messages
- Create test conversations

---

## Reporting Issues

When reporting issues, include:
1. **Flow**: Which user flow was being tested
2. **Steps**: Exact steps to reproduce
3. **Expected**: What should have happened
4. **Actual**: What actually happened
5. **Environment**: Browser, OS, backend version
6. **Logs**: Relevant error logs from browser console and backend

---

**Last Updated:** January 24, 2026
