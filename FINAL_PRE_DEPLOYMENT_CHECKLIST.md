# ✅ PRE-DEPLOYMENT CHECKLIST - DO THIS FIRST

**Read this top-to-bottom. Check off each item. Only deploy when ALL are checked.**

**Time Required:** ~30 minutes  
**Difficulty:** Easy (all copy-paste)

---

## 🎯 PART 1: KEYSTORE GENERATION (10 minutes)

**This creates your APK signing key. MOST IMPORTANT.**

### Step 1.1: Open PowerShell as Admin

```powershell
# Windows: Right-click Start → Windows PowerShell (Admin)
# Or: Win + R → powershell → Ctrl+Shift+Enter
```

### Step 1.2: Navigate to Project

```powershell
cd C:\Users\ADMIN\Documents\GitHub\DinApp
```

### Step 1.3: Run Keystore Script

```powershell
.\scripts\generate-keystore.ps1
```

**You'll be prompted:**

```
Enter keystore password (min 8 chars):
[Type a STRONG password, e.g.: MyDinApp2026!secure]

Re-enter password:
[Type same password again]

Keystore generated successfully!
Location: C:\Users\ADMIN\Documents\GitHub\DinApp\dinapp.keystore
```

**✅ Checklist for Step 1:**

```
☐ Script runs without error
☐ You see "Keystore generated successfully!"
☐ File dinapp.keystore exists in project root
☐ You wrote down the password (CRITICAL!)
```

### Step 1.4: Verify Keystore File

```powershell
# In same PowerShell window:
ls dinapp.keystore

# Should see:
# -a----  1/9/2026  12:34 PM      2560 dinapp.keystore
```

**✅ Checklist for Step 1.4:**

```
☐ File dinapp.keystore exists
☐ File size is ~2-3 KB
```

### Step 1.5: BACKUP KEYSTORE IMMEDIATELY

**THIS IS YOUR MOST IMPORTANT FILE.**

**Backup Location 1: USB Drive**

```
1. Insert USB drive
2. Copy dinapp.keystore to USB
3. Label USB: "DinApp Keystore Backup"
4. Unplug and store safely
```

**Backup Location 2: Cloud (Encrypted)**

```
1. Go to: Google Drive / OneDrive / Dropbox
2. Create folder: "DinApp Backups"
3. Upload dinapp.keystore
4. Note the backup location
```

**Backup Location 3: Password Manager**

```
1. Open password manager (LastPass, 1Password, Bitwarden)
2. Create entry: "DinApp Keystore"
3. Store:
   - Password (from Step 1.3)
   - Keystore file path
   - Backup locations
```

**✅ Checklist for Step 1.5:**

```
☐ Keystore copied to USB drive
☐ USB drive labeled and stored safely
☐ Keystore backed up to cloud
☐ Password saved in password manager
☐ You can remember: THIS FILE = YOUR SIGNING KEY
  (Lose it = Cannot update app ever)
```

**🚨 CRITICAL:** Do NOT commit dinapp.keystore to GitHub!

- File: `.gitignore` already has this
- Check: `git status` should not show dinapp.keystore
- If it does, run: `git rm --cached dinapp.keystore`

---

## 🌐 PART 2: CLOUDFLARE SETUP (5 minutes)

### Step 2.1: Create Free Cloudflare Account

**Go to:** https://dash.cloudflare.com/sign-up

```
Email: [Your email]
Password: [Strong password - save in password manager!]
```

Click "Create Account" and verify email.

**✅ Checklist for Step 2.1:**

```
☐ Account created
☐ Email verified
☐ Can log in to dashboard
```

### Step 2.2: Create R2 Bucket

```
1. In Cloudflare Dashboard, click: R2 (left sidebar)
2. Click: Create bucket
3. Bucket name: dinapp-apk
   (MUST be exactly this name!)
4. Region: Auto (recommended)
5. Click: Create bucket
```

**You should see:**

```
✅ dinapp-apk bucket created
✅ Bucket settings page opens
```

**✅ Checklist for Step 2.2:**

```
☐ R2 bucket "dinapp-apk" exists
☐ Can see bucket in dashboard
☐ Bucket is empty (first time)
```

### Step 2.3: Get Account ID

```
1. Cloudflare Dashboard → Settings (left sidebar)
2. Scroll to "Account Details"
3. Copy: "Account ID"
   (Looks like: abc123def456...)
4. Save to text file or password manager
```

**✅ Checklist for Step 2.3:**

```
☐ Account ID copied (20+ character string)
☐ Saved in safe location
☐ Can copy/paste without error
```

### Step 2.4: Create API Token

```
1. Cloudflare Dashboard → Settings (left sidebar)
2. Scroll down to "API Tokens"
3. Click: Create Token
4. Use template: "Create custom token"
5. Settings:
   - Token name: "DinApp Deploy"
   - Permissions: Account.R2 (Edit)
   - Permissions: Account.Cloudflare Pages (Edit)
   - Account Resources: All accounts
   - TTL: 1 year
6. Click: Create Token
7. Copy the token (you won't see it again!)
```

**Token looks like:**

```
v1.0_aAbBcCdDeEfFgGhHiIjJkKlMmNnOoPpQqRr
```

**✅ Checklist for Step 2.4:**

```
☐ API token created
☐ Token copied (long string starting with v1.0_)
☐ Saved in safe location
☐ Permissions include R2 and Pages
```

---

## 🔐 PART 3: GITHUB SECRETS (5 minutes)

**These let GitHub Actions build your APK.**

### Step 3.1: Go to GitHub Secrets Page

```
1. Go to: https://github.com/bakatebtc01/DinApp
2. Click: Settings (top right, might need ...)
3. Left sidebar: Secrets and variables → Actions
4. Click: New repository secret
```

### Step 3.2: Add Secret 1 - CLOUDFLARE_ACCOUNT_ID

```
Name: CLOUDFLARE_ACCOUNT_ID
Secret: [paste from Step 2.3]

Example:
Name: CLOUDFLARE_ACCOUNT_ID
Secret: 1234567890abcdefghij

Click: Add secret
```

**✅ Checklist:**

```
☐ Secret name is exactly: CLOUDFLARE_ACCOUNT_ID
☐ Value pasted correctly
☐ Can see in secrets list (shows as ••••)
```

### Step 3.3: Add Secret 2 - CLOUDFLARE_API_TOKEN

```
Name: CLOUDFLARE_API_TOKEN
Secret: [paste from Step 2.4]

Example:
Name: CLOUDFLARE_API_TOKEN
Secret: v1.0_aAbBcCdDeEfFgGhHiIjJkKlMmNnOoPpQqRr

Click: Add secret
```

**✅ Checklist:**

```
☐ Secret name is exactly: CLOUDFLARE_API_TOKEN
☐ Value starts with: v1.0_
☐ Can see in secrets list
```

### Step 3.4: Add Secret 3 - KEYSTORE_PASSWORD

```
Name: KEYSTORE_PASSWORD
Secret: [password from Step 1.3]

Example:
Name: KEYSTORE_PASSWORD
Secret: MyDinApp2026!secure

Click: Add secret
```

**✅ Checklist:**

```
☐ Secret name is exactly: KEYSTORE_PASSWORD
☐ Value is the password you created
☐ Can see in secrets list
```

### Step 3.5: Add Secret 4 - KEY_ALIAS

```
Name: KEY_ALIAS
Secret: dinapp

(This is literal "dinapp" - don't change it)

Click: Add secret
```

**✅ Checklist:**

```
☐ Secret name is exactly: KEY_ALIAS
☐ Value is exactly: dinapp
☐ Can see in secrets list
```

### Step 3.6: Add Secret 5 - KEY_PASSWORD

```
Name: KEY_PASSWORD
Secret: [same password as Step 3.4]

This should be IDENTICAL to KEYSTORE_PASSWORD

Click: Add secret
```

**✅ Checklist:**

```
☐ Secret name is exactly: KEY_PASSWORD
☐ Value is same as KEYSTORE_PASSWORD
☐ Can see in secrets list
```

### Step 3.7: Verify All 5 Secrets

```
GitHub Secrets page should show:

1. CLOUDFLARE_ACCOUNT_ID ••••••••••••
2. CLOUDFLARE_API_TOKEN ••••••••••••
3. KEYSTORE_PASSWORD ••••••••••••
4. KEY_ALIAS ••••••••••••
5. KEY_PASSWORD ••••••••••••
```

**✅ Checklist:**

```
☐ All 5 secrets visible
☐ Each shows as: [name] •••••••
☐ No spelling mistakes in names
☐ All exactly match the names above
```

---

## 📦 PART 4: CODE CHECK (5 minutes)

### Step 4.1: Verify APK Versions

**File:** `mobile/app/build.gradle`

**Look for these lines:**

```gradle
versionCode 1
versionName "0.1"
```

**✅ Checklist:**

```
☐ versionCode = 1 (or higher for updates)
☐ versionName = "0.1" (matches your release)
☐ Can see in build.gradle file
```

### Step 4.2: Check Manifest

**File:** `mobile/app/src/main/AndroidManifest.xml`

**Should include:**

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.RECEIVE_SMS" />
```

**✅ Checklist:**

```
☐ File exists and opens
☐ Has INTERNET permission
☐ Has SMS/PHONE permissions for OTP
```

### Step 4.3: Verify .gitignore

**File:** `mobile/.gitignore` (or root `.gitignore`)

**Should contain:**

```
dinapp.keystore
*.keystore
```

**Check:**

```powershell
cd C:\Users\ADMIN\Documents\GitHub\DinApp
git status

# Should NOT show dinapp.keystore in list
# If it does, run:
git rm --cached dinapp.keystore
git commit -m "Remove keystore from tracking"
git push
```

**✅ Checklist:**

```
☐ dinapp.keystore is in .gitignore
☐ git status does NOT show keystore file
☐ Keystore is not tracked by git
```

---

## 🚀 PART 5: READY TO DEPLOY (Final check)

### Step 5.1: Final Verification

```
☐ Keystore file created: dinapp.keystore
☐ Keystore backed up (USB + Cloud)
☐ Keystore password saved
☐ Cloudflare Account created
☐ R2 bucket "dinapp-apk" created
☐ Cloudflare Account ID saved
☐ Cloudflare API token created
☐ GitHub Secret 1: CLOUDFLARE_ACCOUNT_ID ✅
☐ GitHub Secret 2: CLOUDFLARE_API_TOKEN ✅
☐ GitHub Secret 3: KEYSTORE_PASSWORD ✅
☐ GitHub Secret 4: KEY_ALIAS ✅
☐ GitHub Secret 5: KEY_PASSWORD ✅
☐ APK version code/name correct
☐ Keystore NOT tracked in git
☐ All files saved
```

### Step 5.2: Ready Message

If you checked ALL boxes above, you're ready! 🎉

---

## 🎯 NEXT STEP: DEPLOY

Once you've completed this checklist:

```powershell
cd C:\Users\ADMIN\Documents\GitHub\DinApp
git add .
git commit -m "Deploy DinApp v0.1 MVP - Early Access"
git push origin main
```

**Then:**

1. Go to: GitHub Repo → Actions
2. Watch the build run (15-20 minutes)
3. All steps should turn green ✅
4. Download page: https://dinapp-apk.pages.dev

---

## 📋 TROUBLESHOOTING PRE-DEPLOYMENT

**Problem:** Keystore script fails

```
Solution:
1. Run PowerShell as Administrator
2. Check Windows path is correct
3. Try again with different password
```

**Problem:** Cloudflare account creation fails

```
Solution:
1. Use different email
2. Check internet connection
3. Clear browser cache
```

**Problem:** GitHub Secrets not saving

```
Solution:
1. Try different browser (Chrome vs Edge)
2. Copy/paste again (avoid typos)
3. Check all 5 secrets are added
```

**Problem:** Can't find git or PowerShell

```
Solution:
1. Install Git for Windows
2. Restart computer
3. Open PowerShell again
```

---

## ✅ YOU'RE READY!

Everything is prepared. Your deployment is ready.

**Next Action:**

1. ☐ Complete this checklist (all items)
2. ☐ Run: `git push origin main`
3. ☐ Watch GitHub Actions build
4. ☐ Test APK on Android device
5. ☐ Send to pilot users
6. ☐ Collect feedback
7. ☐ Plan v0.2

---

**Status:** Ready to deploy  
**Version:** 0.1 MVP  
**Created:** January 9, 2026  
**Time to Live:** 15-20 minutes after git push
