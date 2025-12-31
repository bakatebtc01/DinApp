# 🚀 DinApp - Complete APK Deployment & Setup Guide

## Overview

This guide covers **everything** you need to:

1. ✅ Generate a signing keystore (ONE TIME)
2. ✅ Build APK correctly (signed, versioned)
3. ✅ Deploy to Cloudflare (R2 + Pages)
4. ✅ Distribute to users
5. ✅ Manage updates without Play Store

---

## 📋 Table of Contents

1. [Quick Start (5 min)](#quick-start-5-min)
2. [Complete Setup (30 min)](#complete-setup-30-min)
3. [Build APK Locally](#build-apk-locally)
4. [Deploy to Cloudflare](#deploy-to-cloudflare)
5. [Share with Users](#share-with-users)
6. [Updates & Versioning](#updates--versioning)
7. [Troubleshooting](#troubleshooting)

---

## Quick Start (5 min)

### 1. Generate Keystore

**Windows (PowerShell):**

```powershell
cd c:\Users\ADMIN\Documents\GitHub\DinApp
.\scripts\generate-keystore.ps1
```

**macOS/Linux (Bash):**

```bash
cd ~/GitHub/DinApp
bash scripts/generate-keystore.sh
```

📌 **BACKUP IMMEDIATELY:**

- Save `dinapp.keystore` to encrypted drive
- Save password in password manager
- Add `.keystore` to `.gitignore` ✅ Already done

---

### 2. Add GitHub Secrets

Go to: **GitHub Repo → Settings → Secrets and variables → Actions**

Click "New repository secret" and add:

| Secret Name             | Value             | Where From                        |
| ----------------------- | ----------------- | --------------------------------- |
| `CLOUDFLARE_ACCOUNT_ID` | `abc123xyz...`    | Cloudflare Dashboard → Settings   |
| `CLOUDFLARE_API_TOKEN`  | `v1.0_abc123...`  | Cloudflare → Account → API Tokens |
| `KEYSTORE_PASSWORD`     | `YourPassword123` | From keystore generation          |
| `KEY_ALIAS`             | `dinapp`          | From keystore generation          |
| `KEY_PASSWORD`          | `YourPassword123` | From keystore generation          |

---

### 3. Deploy to Cloudflare

Push to main and GitHub Actions automatically:

1. Builds APK
2. Signs with keystore
3. Uploads to Cloudflare R2
4. Deploys web page to Cloudflare Pages

```bash
git add .
git commit -m "Deploy APK v0.1"
git push origin main
```

✅ APK available at: `https://dinapp-apk.pages.dev`

---

## Complete Setup (30 min)

### Prerequisites

- Cloudflare account (free: [https://dash.cloudflare.com/sign-up](https://dash.cloudflare.com/sign-up))
- GitHub account (you have this ✅)
- Java 11+ installed (check: `java -version`)
- Android SDK (optional, for local builds)

### Step 1: Create Cloudflare R2 Bucket

1. Go to **Cloudflare Dashboard** → R2
2. Click "Create bucket"
3. Name: `dinapp-apk`
4. Region: Auto
5. Click "Create bucket"

### Step 2: Create Cloudflare API Token

1. Go to **Cloudflare Dashboard** → Account → API Tokens
2. Click "Create Token"
3. Select template: "Edit Cloudflare Workers"
4. Permissions:
   - `Account.R2`: Edit
   - `Account.Cloudflare Pages`: Edit
5. Click "Continue to summary" → "Create Token"
6. Copy token (save to password manager)

### Step 3: Get Cloudflare Account ID

1. Go to **Cloudflare Dashboard** → Settings
2. Look for "Account ID"
3. Copy it (looks like: `abc123def456`)

### Step 4: Generate Keystore

```powershell
.\scripts\generate-keystore.ps1 `
  -KeystorePath "dinapp.keystore" `
  -KeystorePassword "SecurePass123!" `
  -KeyPassword "SecurePass123!"
```

✅ File created: `dinapp.keystore`
✅ Safe: Not in git (check `.gitignore`)

### Step 5: Add GitHub Secrets

1. Go to GitHub repo → **Settings → Secrets and variables → Actions**
2. Create 5 secrets from Step 2-4
3. Names must match exactly (case-sensitive)

### Step 6: Trigger Build

```bash
git add .
git commit -m "Release v0.1"
git push origin main
```

GitHub Actions workflow automatically:

- ✅ Builds APK with Android SDK
- ✅ Signs with keystore
- ✅ Calculates SHA-256
- ✅ Uploads to R2
- ✅ Deploys web page
- ✅ Creates GitHub Release

---

## Build APK Locally

### Requirements

- Android SDK installed
- Keystore file: `dinapp.keystore`
- Java 11+

### Build Steps

```bash
cd mobile

# Build release APK (signed)
./gradlew assembleRelease

# Build debug APK (for testing)
./gradlew assembleDebug
```

**Output:**

- Release: `mobile/app/build/outputs/apk/release/app-release.apk`
- Debug: `mobile/app/build/outputs/apk/debug/app-debug.apk`

### With Environment Variables

```bash
export KEYSTORE_PASSWORD="YourPassword123"
export KEY_ALIAS="dinapp"
export KEY_PASSWORD="YourPassword123"

./gradlew assembleRelease
```

### Test on Device

```bash
# Install on connected Android device
./gradlew installDebug

# Run app
./gradlew runDebug
```

---

## Deploy to Cloudflare

### What Gets Deployed

1. **APK file** → Cloudflare R2 bucket
2. **Download page** → Cloudflare Pages
3. **Release info** → GitHub Releases

### Deployment Flow

```text
GitHub push to main
        ↓
GitHub Actions triggered
        ↓
Android SDK builds APK
        ↓
Gradle signs with keystore
        ↓
Action uploads to R2
        ↓
Action deploys web page
        ↓
Users can download!
```

### Manual Trigger (Optional)

1. Go to **GitHub → Actions**
2. Select **"Build & Deploy APK to Cloudflare"**
3. Click **"Run workflow"**
4. Select branch: `main`
5. Click **"Run workflow"**

---

## Share with Users

### Download URLs

**Public Page:**

```text
https://dinapp-apk.pages.dev
```

**Direct APK Link:**

```text
https://r2.dinapp.io/dinapp-apk/dinapp-v0.1.apk
```

### Installation Instructions for Users

**Send this to users:**

```text
📱 DinApp Installation Guide

1️⃣ Download APK
   → Visit: https://dinapp-apk.pages.dev
   → Click "Download APK"

2️⃣ Allow Unknown Apps
   → Open Settings
   → Go to: Apps & notifications → Special app access
   → Select "Install unknown apps"
   → Find your browser
   → Enable "Allow from this source"

3️⃣ Install
   → Open file manager
   → Find "dinapp-v0.1.apk"
   → Tap it
   → Click "Install"

4️⃣ Launch
   → Click "Open" after install
   → Or find "DinApp" in your apps
   → Enter phone number to start

⏱️ Takes ~30 seconds total

Need help?
📧 support@dinapp.io
📞 WhatsApp: +254 700 000 000
```

### WhatsApp Message Template

```text
🚀 Excited to share DinApp v0.1!

📱 Direct Download Link:
https://dinapp-apk.pages.dev

🔐 Secure: Signed APK, SHA-256 verified

📖 Installation Steps:
1. Download APK
2. Allow "Unknown apps"
3. Install
4. Enter phone number

Questions? Reply here or email support@dinapp.io
```

### Share via Telegram

1. Create a Telegram bot
2. Post download link
3. Pin message
4. Share group invite

---

## Updates & Versioning

### Releasing Version 0.2

#### 1. Update Version Numbers

Edit [mobile/app/build.gradle](mobile/app/build.gradle):

```gradle
versionCode 2      // Changed from 1
versionName "0.2"  // Changed from "0.1"
```

#### 2. Update Release Notes

Edit `CHANGELOG.md`:

```text
## v0.2 (Jan 10, 2026)
- ✅ Fixed OTP timeout issue
- ✅ Improved wallet UI
- ✅ Faster transaction confirmation
```

#### 3. Commit & Tag

```bash
git add .
git commit -m "Release v0.2"
git tag -a v0.2 -m "DinApp v0.2"
git push origin main --tags
```

✅ GitHub Actions automatically triggers
✅ New APK built and deployed
✅ Available at: `dinapp-apk-v0.2.apk`

### Version History

Keep in `CHANGELOG.md`:

```text
## v0.1 (Jan 9, 2026)
- Initial MVP release
- Phone OTP authentication
- Wallet creation
- PIN protection
- SHA-256: A3F2...9E2
- Download: 45 MB

## v0.2 (Jan 10, 2026)
- Bug fixes
- UI improvements
- SHA-256: B4G3...0F3
- Download: 46 MB
```

---

## Troubleshooting

### Build Fails: "Keystore not found"

```bash
# Check if file exists
ls -la dinapp.keystore

# If missing, regenerate (need original password)
.\scripts\generate-keystore.ps1

# Or if you have backup
copy C:\Backup\dinapp.keystore ./
```

### Build Fails: "Permission denied"

```bash
# On macOS/Linux, make script executable
chmod +x scripts/generate-keystore.sh
chmod +x mobile/gradlew
```

### Cloudflare Upload Fails

Check GitHub Actions logs:

1. Go to **GitHub → Actions → Build & Deploy APK**
2. Click last run
3. Expand "Deploy to Cloudflare R2"
4. Look for error message

Common issues:

- ❌ Invalid API token (copy/paste error)
- ❌ Account ID wrong
- ❌ R2 bucket doesn't exist
- ❌ API token expired

Solution:

1. Verify Cloudflare credentials
2. Update GitHub Secrets
3. Re-run workflow

### APK Won't Install on Android Device

#### Error: "Parsing error"

- File corrupted during download
- Try downloading again

#### Error: "App not installed"

- Device is incompatible (needs Android 7.0+)
- Try another device

#### Error: "Install blocked"

- Settings → Apps & notifications → Special app access
- Toggle "Install unknown apps" for browser
- Try again

### Can't Find Download Page

```text
Expected: https://dinapp-apk.pages.dev
Not working?

Try:
1. Clear browser cache (Ctrl+Shift+Del)
2. Wait 2-3 minutes for Pages deployment
3. Check GitHub Actions for deployment status
4. Verify Cloudflare Pages enabled
```

---

## Security Checklist

Before releasing to users:

- [ ] Keystore generated and backed up
- [ ] Keystore NOT in git repository
- [ ] GitHub Secrets configured (5 secrets)
- [ ] Cloudflare R2 bucket created
- [ ] Cloudflare API token has R2 permissions
- [ ] GitHub Actions workflow passes
- [ ] APK file signed correctly
- [ ] SHA-256 checksum published
- [ ] Download page accessible via HTTPS
- [ ] Installation instructions clear
- [ ] Support contact info updated

---

## File Structure

```text
DinApp/
├── mobile/
│   ├── app/
│   │   ├── build.gradle        ← Update versionCode/versionName here
│   │   ├── src/
│   │   │   └── main/
│   │   │       ├── AndroidManifest.xml
│   │   │       ├── java/io/dinapp/app/
│   │   │       │   └── MainActivity.kt
│   │   │       └── res/
│   │   └── proguard-rules.pro
│   ├── build.gradle.kts
│   ├── gradle.properties
│   ├── settings.gradle
│   └── BUILD.md
├── .github/
│   └── workflows/
│       └── build-deploy-apk.yml  ← The magic happens here
├── scripts/
│   ├── generate-keystore.ps1    ← Windows keystore generation
│   └── generate-keystore.sh     ← macOS/Linux keystore generation
├── wrangler.toml                ← Cloudflare R2 config
├── DEPLOYMENT_GUIDE.md          ← (this file)
├── RELEASE_CHECKLIST.md
└── dinapp.keystore              ← KEEP SAFE (not in git)
```

---

## Key Takeaways

✅ **Keystore is critical** - Back it up, never lose it
✅ **Signing is automatic** - GitHub Actions handles it
✅ **Cloudflare is free** - R2 storage + Pages deployment
✅ **Updates are easy** - Just increment versionCode
✅ **Users don't need Play Store** - Direct APK download
✅ **No auto-updates** - User manually downloads new version
✅ **Trust matters** - Always publish SHA-256 checksum

---

## Support

- 📧 Email: [support@dinapp.io](mailto:support@dinapp.io)
- 💬 WhatsApp: +254 700 000 000
- 🐛 Issues: GitHub Issues
- 📚 Docs: See RELEASE_CHECKLIST.md

---

**Last Updated:** January 9, 2026  
**Version:** 1.0  
**Status:** Ready for MVP Pilot Testing
