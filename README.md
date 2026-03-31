# 🎫 Full-Stack Helpdesk & Ticket Management System

A comprehensive, production-ready support system built with a modern tech stack. This project demonstrates a full lifecycle of ticket management, featuring a robust **Role-Based Access Control (RBAC)** system and a decoupled architecture.

---

## 🏗️ System Architecture Overview

The system is divided into two main specialized environments:

### 🖥️ [Client (Frontend)](helpdesk-client)
Built with **React 18** and **TypeScript**, focusing on a dynamic and secure user experience. 
* **Key Tech:** Vite, Material UI (MUI), Context API, JWT Auth.

### ⚙️ [Server (Backend)](helpdesk-api-main)
A high-performance API built with **Node.js** and **TypeScript**, following a clean, layered architecture.
* **Key Tech:** Express, SQLite, JWT, Swagger Documentation.

---

## ✨ Key Business Logic: RBAC
The system enforces strict permission layers across both Frontend and Backend:
* **Customer:** Create and track personal tickets.
* **Support Agent:** Manage assigned tickets and communicate with customers.
* **Administrator:** Global oversight, agent assignment, and user management.

---

## 🚀 Quick Start (Full System)

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/Hadasa-Fishel/Helpdesk-Project.git](https://github.com/Hadasa-Fishel/Helpdesk-Project.git)
Setup Server:

Bash
cd server && npm install && npm run dev
Setup Client:

Bash
cd client && npm install && npm run 
