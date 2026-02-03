# ✅ GitHub Actions Workflow Verification

**This document helps you monitor the automated build/deploy process.**

---

## 📊 WORKFLOW STATUS DASHBOARD

After you run `git push origin main`, your APK goes through this pipeline:

### Step 1: Trigger (Automatic)

```text
✅ Code pushed to main
✅ GitHub Actions workflow activated
⏱️ Starts within 30 seconds
```

### Step 2: Build APK (5-7 minutes)

```text
📦 Android SDK setup
📦 Dependencies download
📦 Gradle build
📦 Sign with keystore
📦 APK generated (~45 MB)
```

### Step 3: Upload to Cloudflare (2-3 minutes)

```text
☁️ Connect to R2 bucket
☁️ Upload dinapp-v0.1.apk
☁️ Set as downloadable
☁️ Create checksum file
```

### Step 4: Deploy Web Page (1-2 minutes)

```text
🌐 Deploy to Cloudflare Pages
🌐 URL: https://dinapp-apk.pages.dev
🌐 Page becomes live
```

### Step 5: Create Release (1 minute)

```text
🏷️ Create GitHub Release tag: v0.1
🏷️ Attach APK file
🏷️ Add release notes
🏷️ Publish
```

**Total Time:** ~15-20 minutes from git push to live

---

## 🔍 HOW TO MONITOR PROGRESS

### Method 1: GitHub Actions Tab (Easiest)

**In Browser:**

1. Go to: [https://github.com/bakatebtc01/DinApp](https://github.com/bakatebtc01/DinApp)
2. Click: **Actions** (top menu)
3. You'll see your workflow run
4. Each step has a status:
   - 🟡 **Yellow** = Running
   - 🟢 **Green** = Completed
   - 🔴 **Red** = Failed

**What You're Looking For:**

```text
Workflow: build-deploy-apk
├─ Build APK                 🟢 ~7 min
├─ Sign & Verify            🟢 ~2 min
├─ Upload to Cloudflare     🟢 ~3 min
├─ Deploy Pages             🟢 ~2 min
├─ Create Release           🟢 ~1 min
└─ Upload to Release        🟢 ~1 min
   = ALL GREEN ✅
```

---

## 📱 MANUAL VERIFICATION CHECKLIST

Once workflow is complete (15-20 min), verify manually:

### Check 1: APK File Exists in R2

```text
# In browser, go to:
https://dash.cloudflare.com/

1. Click R2
2. Click dinapp-apk bucket
3. You should see:
   ✅ dinapp-v0.1.apk (45-50 MB)
   ✅ dinapp-v0.1.apk.sha256 (checksum file)
```

### Check 2: Download Page Works

```text
Open in browser:
[https://dinapp-apk.pages.dev](https://dinapp-apk.pages.dev)

You should see:
✅ DinApp v0.1 download page
✅ Big "Download" button
✅ Version info displayed
✅ Installation instructions visible
```

### Check 3: GitHub Release Created

```text
Go to:
[https://github.com/bakatebtc01/DinApp/releases](https://github.com/bakatebtc01/DinApp/releases)

You should see:
✅ Tag: v0.1
✅ APK file attached
✅ Release notes
✅ Can download from here
```

### Check 4: Test Download Link

```text
Direct link test:
[https://r2.dinapp.io/dinapp-apk/dinapp-v0.1.apk](https://r2.dinapp.io/dinapp-apk/dinapp-v0.1.apk)

Should:
✅ Start downloading immediately
✅ File ~45-50 MB
✅ No 404 error
```

---

## 🧪 INSTALLATION TEST

Once file downloads, test on Android device:

**Before Installing:**

```text
Settings → Security → Unknown sources
☐ Enable "Allow installation from unknown sources"
```

**Installation Steps:**

```text
1. Tap downloaded dinapp-v0.1.apk file
2. Allow permissions
3. Wait for install (30-60 seconds)
4. See "App installed successfully" ✅
```

**First Launch:**

```text
1. Open DinApp app
2. See welcome screen ✅
3. Phone number input ✅
4. OTP button works ✅
5. Can enter PIN ✅
6. Wallet screen appears ✅
```

**If it crashes:** Note the error and create GitHub Issue

---

## ⚠️ TROUBLESHOOTING WORKFLOW FAILURES

### Scenario 1: Build Fails (Red X)

**Check:**

```text
GitHub Actions → Your workflow run → Build APK step
Click "Build APK" to see error
Common reasons:
- Gradle dependency not found (internet issue)
- SDK version mismatch
- Syntax error in code
```

**Fix:**

```text
# In VS Code terminal:
cd backend  # or mobile/
gradle clean  # Clear cache
gradle build  # Try building locally first
```

### Scenario 2: Signing Fails

**Check:**

```text
Error: "Cannot read KEYSTORE_PASSWORD"
Reason: GitHub Secret not set correctly

Fix:
1. Go to GitHub Repo Settings → Secrets
2. Verify ALL 5 secrets exist:
   ✅ CLOUDFLARE_ACCOUNT_ID
   ✅ CLOUDFLARE_API_TOKEN
   ✅ KEYSTORE_PASSWORD
   ✅ KEY_ALIAS (should be "dinapp")
   ✅ KEY_PASSWORD
3. Re-run workflow
```

### Scenario 3: Cloudflare Upload Fails

**Check:**

```text
Error: "401 Unauthorized"
Reason: API token expired or invalid

Fix:
1. Go to Cloudflare Dashboard
2. Settings → API Tokens
3. Generate NEW token
4. Copy token
5. Update GitHub Secret: CLOUDFLARE_API_TOKEN
6. Re-run workflow
```

### Scenario 4: Pages Deployment Fails

**Check:**

```text
Error: "Cannot deploy to Pages"
Reason: Project not configured for Pages

Fix:
1. Go to Cloudflare Dashboard
2. Pages → Create project
3. Connect GitHub repo
4. Select branch: main
5. Build command: (none, we upload directly)
6. Restart workflow
```

---

## 📋 GITHUB ACTIONS WORKFLOW FILE

If you need to edit the workflow manually:

**Location:** `.github/workflows/build-deploy-apk.yml`

**Don't Edit Unless:**

- Versions change
- Build commands change
- Cloudflare paths change

**If editing:**

```
1. Make changes
2. git commit -m "Update workflow"
3. git push origin main
4. GitHub Actions uses NEW workflow
```

---

## 🔐 SECRETS MANAGEMENT

Your workflow needs 5 GitHub Secrets to work:

**How to Add Secrets:**

1. Go to: GitHub Repo → Settings
2. Click: Secrets and variables → Actions
3. Click: New repository secret
4. Add each one:

| Name                  | Example Value        | Where From                |
| --------------------- | -------------------- | ------------------------- |
| CLOUDFLARE_ACCOUNT_ID | 1234567890abcdef     | Cloudflare Settings       |
| CLOUDFLARE_API_TOKEN  | v1.0_abc123xyz789    | Cloudflare API Token page |
| KEYSTORE_PASSWORD     | MySecurePassword123! | From keystore generation  |
| KEY_ALIAS             | dinapp               | (literal "dinapp")        |
| KEY_PASSWORD          | MySecurePassword123! | Same as KEYSTORE_PASSWORD |

**IMPORTANT:**

- ✅ Secrets are encrypted
- ✅ Not visible in logs
- ✅ Only accessible to workflow
- ✅ Safe to use in GitHub Actions

---

## 📊 MONITORING ONGOING BUILDS

After initial deploy, every time you push:

```bash
git add .
git commit -m "Your message"
git push origin main
```

The workflow runs automatically. To monitor:

1. **Quick check:** GitHub Actions → Latest run
2. **Quick status:** Look for green ✅ or red 🔴
3. **Detailed logs:** Click run → Click step → View logs

**If you push multiple times:**

- Each push triggers a new build
- Workflow runs in parallel (usually)
- Latest version is deployed
- Old versions overwritten in R2

---

## 🎯 SUCCESS INDICATORS

**Workflow is working if:**

```
✅ Each step completes in expected time
   - Build: 5-7 min
   - Sign: <1 min
   - Upload: 2-3 min
   - Deploy: 1-2 min
   - Total: 15-20 min

✅ Final step shows "success"
✅ All checks are green
✅ No error messages
✅ APK appears in R2 bucket
✅ Pages URL returns 200 OK
✅ GitHub Release created
```

**Workflow has issues if:**

```
🔴 Any red X mark
🔴 Step times out (>30 min)
🔴 Error message in logs
🔴 APK doesn't appear in R2
🔴 Pages URL returns 404
🔴 No GitHub Release created
```

---

## 📞 IF WORKFLOW FAILS

1. **Read the error message** (GitHub Actions logs)
2. **Identify which step failed**
3. **Check Troubleshooting section above**
4. **Fix the issue** (usually GitHub Secrets)
5. **Re-run workflow** (top right of Actions page)
6. **Monitor again**

**Still stuck?**

- Create GitHub Issue
- Describe error + screenshot
- Request help

---

## 🚀 NEXT TIME YOU DEPLOY

**Formula for quick deployment:**

```bash
# 1. Make code changes
# 2. Test locally
# 3. Ready to deploy?

cd C:\Users\ADMIN\Documents\GitHub\DinApp
git add .
git commit -m "v0.1.1 - Bug fixes"
git push origin main

# 4. Wait 15-20 minutes
# 5. Check GitHub Actions (should be green)
# 6. Verify:
#    - APK in R2 bucket
#    - Page loads at https://dinapp-apk.pages.dev
#    - GitHub Release created
# 7. Download and test on device
# 8. Done! New version is live
```

---

**Status:** ✅ Ready to deploy  
**Version:** 0.1  
**Created:** January 9, 2026
