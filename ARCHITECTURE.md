# DinApp Architecture

This document provides an overview of the DinApp system architecture, including the backend gateway, the frontend application, and the deployment strategy.

## System Components

The DinApp system consists of three main components:

1. **Frontend:** A Next.js application that provides the user interface for the admin dashboard and the APK download page.
2. **Backend Gateway:** A Go-based server running on Cloudflare Workers that acts as a gateway to the backend services and the R2 bucket for APK storage.
3. **Cloudflare R2:** A Cloudflare R2 bucket used to store the DinApp APK files.

## Backend Gateway

The backend gateway is a Go application built to run on Cloudflare Workers. It provides a RESTful API for managing files and users.

### Features

* **File Management:** The gateway provides endpoints for listing, uploading, downloading, and deleting files from the Cloudflare R2 bucket.
* **User Management:** Placeholder endpoints for managing users.
* **Authentication and Logging:** Middleware for authentication and request logging.

### Technology Stack

* **Language:** Go
* **Framework:** Gorilla Mux (for routing)
* **Deployment:** Cloudflare Workers

### API Endpoints

* `GET /api/v1/ping`: Health check endpoint.
* `GET /api/v1/users`: Get a list of users.
* `GET /api/v1/users/{id}`: Get a specific user.
* `GET /api/v1/files`: List files in the R2 bucket.
* `POST /api/v1/files/upload`: Upload a file to the R2 bucket.
* `GET /api/v1/files/download/{filename}`: Download a file from the R2 bucket.
* `DELETE /api/v1/files/delete/{filename}`: Delete a file from the R2 bucket.

## Frontend

The frontend is a Next.js application that provides the following:

* **Admin Dashboard:** A dashboard for administrators to monitor the system, view statistics, and manage files.
* **APK Download Page:** A public page where users can download the DinApp APK.

## Deployment

The entire application is designed to be deployed on the Cloudflare ecosystem.

* **Backend Gateway:** Deployed as a Cloudflare Worker using `wrangler`. The `wrangler.toml` file in the root directory contains the configuration for the worker.
* **Frontend:** The Next.js frontend can be deployed as a Cloudflare Pages application.
* **APK Storage:** The APK files are stored in a Cloudflare R2 bucket.

This architecture provides a scalable, secure, and cost-effective solution for hosting the DinApp application.
