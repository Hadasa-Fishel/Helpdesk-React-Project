# ⚙️ Helpdesk Server (Node.js + SQLite)

A professional Backend API built with a layered architecture, providing secure and scalable data management for the Helpdesk system.

## 🏗️ Layered Architecture
The server follows the **Separation of Concerns** principle:
* **Routes & Controllers:** Handling HTTP requests.
* **Services:** Core business logic and validation.
* **Repositories:** Data access layer with optimized SQL JOINs.
* **Middleware:** Centralized JWT authentication and Role-checking.

## 🔐 Backend Features
* **Database:** SQLite with non-destructive initialization and auto-seeding.
* **Security:** JWT-based authorization with three defined roles.
* **API Documentation:** Interactive Swagger UI available at `/docs`.
* **Type Safety:** 100% TypeScript with zero `any` types.

## 📚 API Summary
* `POST /auth/login`: Authentication & Token issuance.
* `GET /tickets`: Enriched ticket list with status and priority names.
* `POST /tickets/:id/comments`: Action-log and communication tracking.