# Dev Mode Auto-Login Feature

## Overview

A unified auto-login helper that allows you to quickly login as either **Admin** or **Company** (Organization) in development mode. This makes testing much faster by eliminating the need to manually enter credentials.

## ✨ Features

### Dual Login Options
- **Login as Admin** - Auto-login as admin user (redirects to `/admin/dashboard`)
- **Login as Company** - Auto-login as test organization (redirects to `/dashboard`)

### Smart Visibility
- Only appears when:
  - Dev mode is enabled (`NEXT_PUBLIC_DEV_MODE=true`)
  - User is not already logged in
  - On any page (not just admin pages)

### User-Friendly Interface
- Clean, modern design with gradient buttons
- Expandable options (click to see Admin/Company choices)
- Loading states during login
- Easy to dismiss

## 🚀 Usage

### Enable Dev Mode

1. Create or edit `frontend/.env.local`:
   ```env
   NEXT_PUBLIC_DEV_MODE=true
   ```

2. Restart the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```

3. Navigate to any page (e.g., `/`, `/login`, `/admin/login`)

4. Look for the yellow notification at the bottom-right corner

5. Click "Choose Login Type" to see options

6. Select either:
   - **Login as Admin** (purple button) - For admin dashboard testing
   - **Login as Company** (blue button) - For organization features testing

### What Happens

**When you click "Login as Admin":**
- Sets admin credentials in dev mode
- Redirects to `/admin/dashboard`
- You can now test admin features

**When you click "Login as Company":**
- Sets organization credentials in dev mode
- Redirects to `/dashboard`
- You can now test organization features

## 📁 Files Created/Modified

### New Files

1. **`frontend/components/dev-auto-login-helper.tsx`**
   - Unified auto-login helper component
   - Shows both Admin and Company options
   - Appears on all pages when not logged in

### Modified Files

1. **`frontend/app/layout.tsx`**
   - Added `DevAutoLoginHelper` component
   - Now shows on all pages globally

2. **`frontend/app/admin/dashboard/page.tsx`**
   - Replaced `AdminAutoLoginHelper` with `DevAutoLoginHelper`
   - Uses the unified component

## 🎨 UI Design

### Helper Notification
- **Location**: Bottom-right corner
- **Color**: Yellow gradient (yellow-400 to yellow-500)
- **Border**: Yellow-600
- **Shadow**: Large shadow for visibility

### Buttons

**"Choose Login Type" Button:**
- Black background
- White text
- Shows chevron down icon

**"Login as Admin" Button:**
- Purple gradient (purple-600 to purple-700)
- White text
- Shield icon
- Hover effect

**"Login as Company" Button:**
- Blue gradient (blue-600 to blue-700)
- White text
- Building icon
- Hover effect

## 🔒 Security

- **Only works in dev mode** (`NEXT_PUBLIC_DEV_MODE=true`)
- **Disabled in production** (checks for VERCEL_ENV)
- **Uses mock tokens** (not real authentication)
- **Safe for development** - never use in production

## 🧪 Testing

### Test Admin Login

1. Enable dev mode
2. Visit any page
3. Click "Choose Login Type"
4. Click "Login as Admin"
5. Should redirect to `/admin/dashboard`
6. Should see admin dashboard with stats

### Test Company Login

1. Enable dev mode
2. Visit any page
3. Click "Choose Login Type"
4. Click "Login as Company"
5. Should redirect to `/dashboard`
6. Should see organization dashboard

### Test Visibility

1. **When logged in**: Helper should not appear
2. **When not logged in**: Helper should appear
3. **In production**: Helper should not appear (even if dev mode is set)

## 💡 Tips

1. **Quick Testing**: Use this to quickly switch between admin and company views
2. **No Credentials Needed**: No need to remember passwords in dev mode
3. **Easy Dismissal**: Click the X button to hide the helper
4. **Persistent**: Helper reappears on page refresh if not logged in

## 🔄 How It Works

1. Component checks if dev mode is enabled
2. Checks if user is authenticated
3. If not authenticated, shows helper
4. When user clicks a login option:
   - Calls `initDevAuth(userType)`
   - Sets mock tokens and user data
   - Redirects to appropriate dashboard
   - Updates auth state

## 📝 Notes

- Uses mock authentication (not real API calls)
- Mock tokens are set in `dev-auth.ts`
- Admin email: `admin@comstag.com`
- Company email: `dev@test.com` (from DEV_MOCK_PROFILE)
- All data is mock data for development

## 🐛 Troubleshooting

### Helper Not Appearing

1. Check `NEXT_PUBLIC_DEV_MODE=true` in `.env.local`
2. Restart frontend server
3. Clear browser cache
4. Check browser console for errors
5. Ensure you're not already logged in

### Login Not Working

1. Check browser console for errors
2. Verify dev mode is enabled
3. Check that `dev-auth.ts` is properly imported
4. Try refreshing the page

### Wrong Redirect

1. Admin login should go to `/admin/dashboard`
2. Company login should go to `/dashboard`
3. Check router configuration
4. Verify user type is set correctly

## 🎯 Next Steps

1. **Rebuild Frontend:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Test Both Login Types:**
   - Test admin features
   - Test company features
   - Verify redirects work correctly

3. **Use for Development:**
   - Quick testing of features
   - Switching between user types
   - No need for manual login
