# 🔐 DinApp APK Deployment Guide

## Quick Setup (5 minutes)

### 1️⃣ Generate Keystore (ONE TIME ONLY)

**Windows:**

```powershell
.\scripts\generate-keystore.ps1 `
  -KeystorePath "dinapp.keystore" `
  -KeystorePassword "YOUR_SECURE_PASSWORD" `
  -KeyPassword "YOUR_SECURE_PASSWORD"
```

**macOS/Linux:**

```bash
bash scripts/generate-keystore.sh
# When prompted, enter passwords and organization details
```

⚠️ **CRITICAL:** Save `dinapp.keystore` in a secure, backed-up location. Losing it means you cannot sign future updates.

---

### 2️⃣ Store Secrets in GitHub

Go to: `Settings > Secrets and variables > Actions`

Add these secrets:

```bash
CLOUDFLARE_ACCOUNT_ID     → Your Cloudflare Account ID
CLOUDFLARE_API_TOKEN      → Your Cloudflare API Token
KEYSTORE_PASSWORD         → Password from step 1
KEY_ALIAS                 → "dinapp"
KEY_PASSWORD              → Password from step 1
```

**How to get Cloudflare credentials:**

1. Login to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Right corner → Account → API Tokens
3. Create token with `Account.R2:Edit` permissions
4. Also get Account ID from Settings

---

### 3️⃣ Build APK Locally (Optional)

```bash
cd mobile
./gradlew assembleRelease
```

APK location: `mobile/app/build/outputs/apk/release/app-release.apk`

---

### 4️⃣ Deploy to Cloudflare

#### Option A: Automatic (Push to main)

```bash
git push origin main
# Workflow triggers automatically
```

#### Option B: Manual Trigger

1. Go to GitHub → Actions → "Build & Deploy APK to Cloudflare"
2. Click "Run workflow"
3. Select branch `main`
4. Click "Run workflow"

---

### 5️⃣ Download & Share APK

**Public URL:** `https://dinapp-apk.pages.dev`

**Direct APK Link:** `https://r2.dinapp.io/dinapp-apk/dinapp-v0.1.apk`

---

## 📱 For Users: Install Instructions

**Step 1:** Download the APK

- Visit: [https://dinapp-apk.pages.dev](https://dinapp-apk.pages.dev)
- Click "Download APK"

**Step 2:** Allow Installation

- Open Settings → Apps & notifications → Special app access
- Select "Install unknown apps"
- Find your browser and enable it

**Step 3:** Install

- Open file manager
- Find downloaded `dinapp-v0.1.apk`
- Tap it
- Click "Install"

**Step 4:** Launch

- Wait for installation to complete
- Click "Open" or find DinApp in your apps
- Enter phone number to start

---

## 🔒 Security Checklist

- ✅ Keystore created and backed up
- ✅ Keystore NOT in git repo (add to .gitignore)
- ✅ GitHub Secrets configured
- ✅ APK signed with production keystore
- ✅ Checksums published with release
- ✅ HTTPS distribution only

---

## 📊 Version Management

| Version | Code | APK Name        | Status |
| ------- | ---- | --------------- | ------ |
| 0.1     | 1    | dinapp-v0.1.apk | MVP    |
| 0.2     | 2    | dinapp-v0.2.apk | Next   |

**For Next Version:**

- Update `versionCode` → 2
- Update `versionName` → "0.2"
- Push to main
- Same keystore used automatically

---

## 🚀 Deployment Workflow

```text
You push to main
    ↓
GitHub Actions triggered
    ↓
Build APK (signed with keystore)
    ↓
Calculate SHA-256 checksum
    ↓
Upload to Cloudflare R2 bucket
    ↓
Deploy web page to Cloudflare Pages
    ↓
Create GitHub Release
    ↓
Users can download from dinapp-apk.pages.dev
```

---

## 🆘 Troubleshooting

### "Keystore not found"

```bash
# Check keystore location
ls -la dinapp.keystore

# If missing, regenerate (but you'll need original password)
.\scripts\generate-keystore.ps1
```

### "Cloudflare deployment failed"

- Check `CLOUDFLARE_API_TOKEN` is valid (not expired)
- Check `CLOUDFLARE_ACCOUNT_ID` is correct
- Verify R2 bucket exists: `dinapp-apk`

### "APK installation fails on device"

- Minimum Android 7.0+ required
- Check "Install unknown apps" permission
- Try downloading again (file may be corrupted)

### "versionCode conflict"

- Always increment `versionCode` for each release

- Users can only install if new code > old code
- Check [build.gradle](../mobile/build.gradle)

---

## 📞 Support & Contact

- Email: [support@dinapp.io](mailto:support@dinapp.io)
- WhatsApp: +254 700 000 000
- GitHub Issues: [https://github.com/bakatebtc01/DinApp/issues](https://github.com/bakatebtc01/DinApp/issues)

---

## 🎯 Next Steps

1. ✅ Generate keystore
2. ✅ Add GitHub Secrets
3. ✅ Create Cloudflare account + R2 bucket
4. ✅ Push to main (triggers build)
5. ✅ Share download link with pilot users
6. ✅ Collect feedback
7. ✅ Plan v0.2 with improvements
