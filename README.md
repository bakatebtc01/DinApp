<<<<<<<<< Temporary merge branch 1
# DinApp
DinApp
=========
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
- **API Health Check**: [http://localhost:3001/health](http://localhost:3001/health)
- **Database**: Port 5432 (User: `dinapp_admin`, DB: `dinapp_ledger`)

## Future Work (Sprint 1+)
- **Mobile App**: A Flutter application will be integrated in future sprints for native mobile support.
- **Auth**: OTP and PIN logic will be implemented in the Backend.
>>>>>>>>> Temporary merge branch 2
