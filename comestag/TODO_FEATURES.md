# TODO Features and Incomplete Functionality

This document lists all TODO comments and incomplete features found in the codebase.

## 🔴 **Backend TODO Items**

### 1. **RFQ (Request for Quotation) System**

#### `AwardRfqUseCase.java`
- **Line 32**: `// TODO: Better error message` - Using generic `SUCCESS_STORY_NOT_EXIST` error for RFQ ownership validation
- **Line 48**: `// TODO: Reject all other proposals` - When an RFQ is awarded, other proposals should be automatically rejected
- **Line 49**: `// TODO: Create project automatically (from NewWebsitedesign feature)` - Auto-create project when RFQ is awarded

#### `SubmitProposalUseCase.java`
- **Line 29**: `// TODO: Better error message` - Using generic error when RFQ is not OPEN
- **Line 35**: `// TODO: Better error message` - Using generic error when proposal already exists
- **Line 44**: `// TODO: Better error message` - Using generic error when organization is not allowed to submit

#### `GetRfqProcessor.java`
- **Line 44**: `// TODO: Better error message` - Using generic error when user doesn't have access to RFQ

#### `CreateRfqUseCase.java`
- **Line 37**: `// TODO: Link media if mediaIds provided` - Media attachment feature for RFQs not implemented
  - Comment mentions: "This would require an RfqMediaPort similar to PostMediaPort"

#### `RfqProposalAdapter.java`
- **Line 81**: `// TODO: Implement if needed` - `pageByOrganizationId()` method returns empty page
  - Method signature exists but implementation is missing

### 2. **Authentication System**

#### `AuthRegisterUseCase.java`
- **Line 63**: `//Todo: to be un commented on prod` - Some code is commented out for production
  - **Action Required**: Review and uncomment for production deployment

#### `AuthRegisterProcessor.java`
- **Line 41**: `//Todo: change interests from string to long` - Consumer registration interests should be hashtag IDs (long) instead of strings
  - **Impact**: Currently accepts string interests, should accept hashtag IDs

#### `AuthRequestVerificationCodeProcessor.java`
- **Line 24**: `//Todo: to be changed next phase to meaningful name from retry-verification to request-code`
  - **Impact**: Endpoint naming inconsistency - endpoint is `/retry-verification` but should be `/request-code`

### 3. **OTP Service**

#### `OtpService.java`
- **Line 27**: `//TODO:tobe deleted on prod` - Some code marked for deletion in production
  - **Action Required**: Review and remove before production deployment

## 🟡 **Frontend TODO Items**

### 1. **Reset Password Page**

#### `app/reset-password/page.tsx`
- **Line 36**: `// TODO: Implement reset password API call`
  - **Current State**: Simulates API call with setTimeout
  - **Impact**: Reset password functionality doesn't actually work
  - **Action Required**: Connect to backend `/v1/auth/reset-pass` endpoint

## 📊 **Summary by Category**

### **Error Handling (5 items)**
- Multiple places using generic `SUCCESS_STORY_NOT_EXIST` error instead of specific RFQ-related errors
- **Priority**: Medium - Affects debugging and user experience

### **RFQ Features (4 items)**
- Missing: Auto-reject other proposals when RFQ is awarded
- Missing: Auto-create project when RFQ is awarded
- Missing: Media attachment for RFQs
- Missing: Pagination for organization proposals
- **Priority**: High - Core RFQ functionality incomplete

### **Data Type Issues (1 item)**
- Consumer interests should be `long` (hashtag IDs) instead of `string`
- **Priority**: Medium - Data consistency issue

### **Code Cleanup (2 items)**
- Code commented out for production
- Code marked for deletion in production
- **Priority**: High - Must be addressed before production

### **API Implementation (1 item)**
- Reset password API not connected
- **Priority**: High - Security feature not working

### **Naming/Refactoring (1 item)**
- Endpoint naming inconsistency
- **Priority**: Low - Cosmetic issue

## 🎯 **Priority Ranking**

### **🔴 Critical (Must Fix Before Production)**
1. Reset password API implementation
2. Code cleanup (commented/deleted code)
3. RFQ proposal rejection when awarded
4. Better error messages for RFQ operations

### **🟡 High Priority (Should Fix Soon)**
1. RFQ media attachment feature
2. Auto-create project when RFQ awarded
3. Consumer interests data type change
4. RFQ proposal pagination by organization

### **🟢 Medium Priority (Nice to Have)**
1. Endpoint naming refactoring
2. Additional error message improvements

## 📝 **Recommended Actions**

1. **Create proper error codes** for RFQ operations:
   - `RFQ_NOT_FOUND`
   - `RFQ_NOT_OPEN`
   - `RFQ_ACCESS_DENIED`
   - `PROPOSAL_ALREADY_EXISTS`
   - `PROPOSAL_NOT_ALLOWED`

2. **Complete RFQ workflow**:
   - Implement proposal rejection on award
   - Implement project auto-creation
   - Implement RFQ media attachments

3. **Fix reset password**:
   - Connect frontend to backend API
   - Test the full flow

4. **Code cleanup**:
   - Review all commented code
   - Remove code marked for deletion
   - Uncomment production code

5. **Data type fixes**:
   - Update consumer registration to accept hashtag IDs (long) instead of strings
