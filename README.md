<<<<<<< HEAD
# DinApp - Digital Financial Marketplace

DinApp is a digital financial services platform for Papua New Guinea, providing wallets, payments, and creator monetization.

## Project Structure
- **backend**: Node.js/Express API with TypeScript. Handles Ledger, Auth, and Transactions.
- **frontend**: Next.js Web Application. Serves as the Admin Dashboard and PWA.
- **docker-compose.yml**: Orchestrates the API, Web, and PostgreSQL database.

## Prerequisites
- Docker & Docker Compose
- Node.js (for local development outside Docker)

## Getting Started

### 1. Start Infrastructure
Run the following command to spin up the database, backend, and frontend:
```bash
docker-compose up --build
```

### 2. Services
- **Web App**: [http://localhost:3000](http://localhost:3000)
- **API Health Check**: [http://localhost:3001/health](http://localhost:3001/health)
- **Database**: Port 5432 (User: `dinapp_admin`, DB: `dinapp_ledger`)

## Future Work (Sprint 1+)
- **Mobile App**: A Flutter application will be integrated in future sprints for native mobile support.
- **Auth**: OTP and PIN logic will be implemented in the Backend.
=======
# DinApp
DinApp
>>>>>>> 1bb36638f316f66c14f7eee80d096803e4f4655f
