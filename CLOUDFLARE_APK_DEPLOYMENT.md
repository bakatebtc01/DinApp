# CLOUDFLARE APK GLOBAL DEPLOYMENT GUIDE (v1.1 MVP)

**Project:** DinApp Early Access v1.1 MVP  
**Purpose:** Global distribution of Android APK via Cloudflare & GitHub  
# DinApp Master Launch Guide v1.4 (Early Access)

This guide outlines the final launch procedures for the DinApp Early Access Portal on Cloudflare and GitHub.

## Project Summary
- **Live Portal:** `https://dinapp-early-access.pages.dev`
- **Version:** v1.4 (Agent-Ready)
- **APK Target:** `DinApp-v1.4-agent-ready.apk`

## Production Launch Steps

### 1. Cloudflare Pages (Hosting)
The portal is hosted on Cloudflare Pages for global low-latency access.
- **Deployment Command:** `npx wrangler pages deploy public --project-name dinapp-early-access`
- **Region:** Global (Papua New Guinea optimized)

### 2. GitHub Source (Pipeline)
The codebase is pushed to the master repository for version control and collaborative development.
- **Repository:** `https://github.com/bakatebtc01/DinApp.git`
- **Branch:** `master`

### 3. Super Admin Access
- **Phone:** `+67573067659`
- **Password:** `Facebook2026!!`

## Features in Launch View
- **User Signup:** Restricted to BPNG Sandbox rules.
- **Transaction PIN:** Mandatory 4-digit security.
- **Service Fee:** Fixed K0.50 revenue model.
- **Agent Ecosystem:** SME onboarding and managed refills.
- **High-Value Control:** Deposits > K10,000 routed to Super Admin.

**Launch Status: LIVE**

---

## 3. CLOUDFLARE PAGES SETUP (CI/CD)
Instead of manual deployment, use the GitHub connection for automatic global delivery.

1. **Login to Cloudflare Dashboard.**
2. Go to **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**.
3. Select your GitHub repository `dinapp-early-access`.
4. **Build Settings:**
   - **Framework preset:** `None`
   - **Build command:** (Leave empty)
   - **Build output directory:** `public`
5. Click **Save and Deploy**.

Cloudflare will now automatically redeploy your site every time you push a change to GitHub.

---

## 4. GLOBAL OPTIMIZATIONS
### Custom Domains
1. In Cloudflare Pages, go to **Custom domains**.
2. Click **Set up a custom domain** (e.g., `download.dinapp.io`).
3. Cloudflare will automatically handle SSL and DNS.

### Global Caching & Security
We have included a `public/_headers` file. It ensures:
- **Security:** Anti-clickjacking and XSS protection.
- **Speed:** APK files are cached at the edge for faster global downloads.

---

## 5. RELEASING UPDATES
When you have a new APK (v1.2):
1. Replace the APK in `public/`.
2. Update the version number and link in `public/index.html`.
3. Commit and push:
   ```bash
   git add .
   git commit -m "Release v0.2"
   git push
   ```
Wait 1 minute, and the live site is updated globally.

## 6. SUPER ADMIN DASHBOARD
A hidden dashboard is integrated for system oversight.

1. **Access:** Perform a standard login with your admin credentials.
2. **Credentials:**
   - **Phone:** `+67573067659`
   - **Password:** `Facebook2026!!`
3. **v1.1 Features:** Monitor live stats, manage the **Super Admin Wallet** (Scan & Pay, P2P, Bank Portal), and control app security globally.

---

## ANDROID INSTALL NOTES
- **Language Toggle:** Users can switch between English and Tok Pisin for clarity.
- **Safety:** The page clearly explains how to enable "Unknown Sources" to reduce install friction.

---

## BENEFITS OF GITHUB + CLOUDFLARE
- **Versioning:** Track history of all APK releases via Git.
- **Zero Friction:** Push code, and it's live worldwide in seconds.
- **Professionalism:** High-speed downloads and premium UI build trust with testers.
