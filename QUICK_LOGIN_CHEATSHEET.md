# 🚀 Quick Test Login - Cheat Sheet

## One-Line Summary
Quick login buttons that auto-fill test credentials for faster testing in development mode.

---

## 🎯 What You Get

| Feature | Company Login | Admin Login |
|---------|--------------|-------------|
| **Button Text** | "Quick Test Login (Test Company)" | "Quick Admin Login" |
| **Email** | testcompany@comstag.com | admin@comstag.com |
| **Password** | Test123! | Admin123! |
| **Location** | /login | /admin/login |
| **Color** | 🟨 Yellow | 🟨 Yellow |
| **Icon** | ⚡ Lightning | ⚡ Lightning |

---

## ⚡ Quick Setup (3 Steps)

### 1️⃣ Generate Password Hashes
Visit: https://bcrypt-generator.com/
- Hash "Test123!" (rounds: 10)
- Hash "Admin123!" (rounds: 10)

### 2️⃣ Update SQL Script
Edit: `comestag/setup-test-accounts.sql`
Replace: `$2a$10$placeholder.replace.with.actual.bcrypt.hash`

### 3️⃣ Run SQL Script
```bash
cd comestag
psql -U postgres -d comestag -f setup-test-accounts.sql
```

**Done!** 🎉

---

## 🏃 Quick Use

### Start Dev Server
```bash
cd comestag/frontend
npm run dev
```

### Click the Yellow Button!
- Company: http://localhost:3000/login
- Admin: http://localhost:3000/admin/login

---

## 🔧 Troubleshooting

| Problem | Solution |
|---------|----------|
| Button not showing | Add `NEXT_PUBLIC_DEV_MODE=true` to `.env.local` |
| Login fails | Run setup-test-accounts.ps1 |
| Backend error | Check backend is running on port 3000 |
| Wrong port | Update backend URL in .env files |

---

## 📁 Files

| File | Purpose |
|------|---------|
| `setup-test-accounts.ps1` | Setup helper (run this first) |
| `comestag/setup-test-accounts.sql` | Database script |
| `TEST_LOGIN_FEATURE.md` | Full docs |
| `TEST_LOGIN_SUMMARY.md` | Updated summary |

---

## 🔒 Security Checklist

Before Production:
- [ ] Remove test accounts from DB
- [ ] Set `NEXT_PUBLIC_DEV_MODE=false`
- [ ] Verify buttons don't appear
- [ ] Delete SQL files from server

---

## 💡 Pro Tips

1. **First Time?** Run `.\setup-test-accounts.ps1` - it guides you through everything
2. **Email Issues?** Check backend logs for verification codes
3. **Bypass Verification?** Consider adding a dev bypass code
4. **Need More Accounts?** Edit the SQL script and add more

---

## 📞 Need Help?

- **Setup Issues:** Run `.\setup-test-accounts.ps1`
- **Button Issues:** Check `TEST_LOGIN_FEATURE.md`
- **General:** See `TEST_LOGIN_SUMMARY.md`

---

**That's it! Simple, fast, secure.** ⚡🔐
