# DinApp - Digital Financial Marketplace

DinApp is a digital financial services platform for East Africa, providing wallets, payments, and digital money services with native Android app support.

## 📱 Quick Links - MVP v0.1 READY TO DEPLOY

**🚀 START HERE:**

- **⚡ QUICK START (60-90 min)** → [QUICK_START_DEPLOY.md](QUICK_START_DEPLOY.md) ← START HERE!
- **📋 Pre-Deployment Checklist** → [FINAL_PRE_DEPLOYMENT_CHECKLIST.md](FINAL_PRE_DEPLOYMENT_CHECKLIST.md)
- **✅ Deployment Status Report** → [DEPLOYMENT_STATUS_REPORT.md](DEPLOYMENT_STATUS_REPORT.md)
- **🎯 MVP Early Access Plan** → [MVP_EARLY_ACCESS_DEPLOY.md](MVP_EARLY_ACCESS_DEPLOY.md)

**📚 Detailed Guides:**

- **🔧 Deployment Guide** → [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- **📖 Complete APK Guide** → [APK_DEPLOYMENT_COMPLETE_GUIDE.md](APK_DEPLOYMENT_COMPLETE_GUIDE.md)
- **🎬 GitHub Actions Monitor** → [GITHUB_ACTIONS_MONITOR.md](GITHUB_ACTIONS_MONITOR.md)
- **📋 Release Checklist** → [RELEASE_CHECKLIST.md](RELEASE_CHECKLIST.md)
- **🏗️ Architecture** → [ARCHITECTURE.md](ARCHITECTURE.md)

## Project Structure

```
DinApp/
├── mobile/                    ← Android APK Build (NEW!)
│   ├── app/                  ← APK source code
│   ├── build.gradle          ← Versioning (versionCode, versionName)
│   └── Dockerfile            ← Build in Docker
├── backend/                  ← Node.js/TypeScript API
│   ├── src/controllers/      ← Route handlers
│   ├── src/services/         ← Business logic
│   ├── src/db/               ← Database migrations
│   └── Dockerfile
├── frontend/                 ← Next.js Web App
│   └── Dockerfile
├── .github/workflows/        ← CI/CD Automation
│   └── build-deploy-apk.yml  ← Build & deploy APK to Cloudflare
└── docker-compose.yml        ← Local development setup
```

## 🎯 Core Features

- ✅ Phone number authentication (OTP)
- ✅ Digital wallet creation & management
- ✅ PIN-based security
- ✅ Transaction ledger
- ✅ QR code payments
- ✅ Subscription management
- ✅ Vendor reputation system
- ✅ Admin dashboard

## Prerequisites

- Docker & Docker Compose (for backend/frontend)
- Java 11+ (for APK builds)
- Cloudflare account (free tier for APK hosting)
- GitHub account (for Actions CI/CD)

## Getting Started

### Option 1: Backend + Frontend (Docker)

```bash
docker-compose up --build
```

Services will be available at:

- **Web App**: [http://localhost:3000](http://localhost:3000)
- **API**: [http://localhost:3001](http://localhost:3001)
- **Database**: postgres://dinapp_admin@localhost:5432/dinapp_ledger

### Option 2: Build Android APK

**5-minute setup:**

1. Generate keystore (one-time):

   ```powershell
   .\scripts\generate-keystore.ps1
   ```

2. Configure Cloudflare:
   - Create R2 bucket: `dinapp-apk`
   - Get API token + Account ID
   - Add to GitHub Secrets

3. Deploy:

   ```bash
   git push origin main
   ```

   ✅ APK builds automatically and deploys to Cloudflare

**For detailed instructions**, see [APK_DEPLOYMENT_COMPLETE_GUIDE.md](APK_DEPLOYMENT_COMPLETE_GUIDE.md)

## 📦 APK Distribution

### Download URL

```
https://dinapp-apk.pages.dev
```

### Current Version

- **Version**: 0.1 (MVP)
- **File Size**: ~45 MB
- **Min Android**: 7.0+
- **Signed**: Yes (production keystore)

### Installation Instructions for Users

1. Visit https://dinapp-apk.pages.dev
2. Download APK
3. Allow "Install unknown apps"
4. Tap APK to install
5. Open DinApp and enter phone number

## 🚀 Deployment Pipeline

```
Code Push → GitHub Actions → Build APK → Sign with Keystore
  → Upload to Cloudflare R2 → Deploy to Cloudflare Pages
  → Create GitHub Release → Users Download
```

All automated! ✅

## 📊 Environment Setup

### Local Environment

Create `.env` file in root:

```env
# Database
DB_USER=dinapp_admin
DB_PASSWORD=secure_password
DB_NAME=dinapp_ledger

# API
API_PORT=3001
NODE_ENV=development

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3001

# Keystore (for APK builds)
KEYSTORE_PASSWORD=your_secure_password
KEY_ALIAS=dinapp
KEY_PASSWORD=your_secure_password
```

### GitHub Secrets (for CI/CD)

Add these secrets to GitHub → Settings → Secrets:

```
CLOUDFLARE_ACCOUNT_ID      # From Cloudflare Dashboard
CLOUDFLARE_API_TOKEN       # From Cloudflare API Tokens
KEYSTORE_PASSWORD          # From keystore generation
KEY_ALIAS                  # dinapp
KEY_PASSWORD               # From keystore generation
```

## 📱 Development

### Backend Development

```bash
cd backend
npm install
npm run dev
```

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

### APK Build (Local)

```bash
cd mobile
./gradlew assembleRelease
# Output: mobile/app/build/outputs/apk/release/app-release.apk
```

## 🔐 Security

- ✅ All APKs signed with production keystore
- ✅ Keystore backed up and secure (not in git)
- ✅ HTTPS-only distribution (Cloudflare)
- ✅ SHA-256 checksums published with each release
- ✅ Version codes prevent downgrade attacks

## 📈 Version Management

Current version: **0.1 (MVP)**

To release 0.2:

1. Update `mobile/app/build.gradle`:
   - `versionCode: 2`
   - `versionName: "0.2"`
2. Commit and push to main
3. GitHub Actions builds automatically

See [RELEASE_CHECKLIST.md](RELEASE_CHECKLIST.md) for detailed process.

## 🆘 Support & Documentation

- **Deployment Guide**: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- **Complete APK Guide**: [APK_DEPLOYMENT_COMPLETE_GUIDE.md](APK_DEPLOYMENT_COMPLETE_GUIDE.md)
- **Quick Summary**: [APK_DEPLOYMENT_SUMMARY.md](APK_DEPLOYMENT_SUMMARY.md)
- **Release Process**: [RELEASE_CHECKLIST.md](RELEASE_CHECKLIST.md)
- **Technical Docs**: See individual `README.md` files in each folder

## 📞 Contact

- **Email**: support@dinapp.io
- **WhatsApp**: +254 700 000 000
- **GitHub Issues**: [DinApp Issues](https://github.com/bakatebtc01/DinApp/issues)

## 📄 License

See individual license files in respective directories.

## 🎯 Roadmap

| Version | Status     | Features                       |
| ------- | ---------- | ------------------------------ |
| 0.1     | ✅ MVP     | Auth, Wallet, PIN, Ledger      |
| 0.2     | 📋 Planned | Bug fixes, UI improvements     |
| 0.3     | 🔮 Future  | Subscription, Gifts, Streaming |
| 1.0     | 🔮 Future  | Full feature set, Play Store   |

---

**Last Updated**: January 9, 2026  
**Status**: MVP Ready for Pilot Testing 🚀
