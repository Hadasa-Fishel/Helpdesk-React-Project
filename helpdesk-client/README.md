# 🎫 Helpdesk & Ticket Management System

`![Dashboard Screen]("helpdesk-client\צילום מסך 2026-03-18 171504.png")

A professional, full-stack oriented ticketing system built with **React 18** and **TypeScript**. This system manages the complete lifecycle of support tickets with a robust **Role-Based Access Control (RBAC)** architecture, ensuring secure and efficient communication between customers and support teams.

---

## 🚀 Project Overview

This project was developed as a comprehensive solution for technical support operations. It features a dynamic user interface that adapts in real-time based on the authenticated user's role, providing a tailored experience for Customers, Agents, and Administrators alike.

---

## ✨ Key Features

### 👥 Role-Based Access Control (RBAC)
The application implements strict permission layers for three distinct roles:
* **Customer:** Can create new tickets, define urgency levels, provide detailed descriptions, and track their personal ticket history.
* **Support Agent:** Can view assigned tickets, update statuses (Open, In Progress, Resolved), and communicate directly with customers via comments.
* **Administrator:** Full system oversight, including global ticket monitoring, agent assignment capabilities, and user management.

### 🛠️ Smart Ticket Lifecycle Management
* **Dynamic Dashboard:** Tailored views and action buttons that change according to the user's role to maximize workflow efficiency.
* **Advanced Filtering & Search:** Real-time search by subject and status-based filtering (logic unification for "In Progress" and "Under Review" states).
* **Integrated Communication:** A dedicated comment system within each ticket to facilitate seamless interaction between the customer and the assigned agent.

### 🔐 Security & State Management
* **JWT Authentication:** Secure login flow utilizing JSON Web Tokens for persistent sessions.
* **Context API & useReducer:** Global state management ensuring data consistency and synchronized user sessions across the entire app.
* **Centralized API Wrapper:** A robust axios-based service that automatically handles Bearer tokens, request headers, and global error management.

---

## 🛠️ Technology Stack

* **Frontend:** React 18, TypeScript, Vite.
* **UI Architecture:** Material UI (MUI).
* **Form Management:** React Hook Form.
* **Notifications & Feedback:** SweetAlert2 & MUI Snackbar for enhanced UX.
* **State Management:** Context API & useReducer.

---

## 📂 Folder Structure

```text
src/
 ├── components/    # Reusable UI elements (Comments, Layouts, Buttons)
 ├── context/       # Global State Management (AuthContext, TicketContext)
 ├── pages/         # Application Views (Dashboard, Login, CreateTicket)
 ├── services/      # Centralized API communication (apiRequest wrapper)
 ├── App.tsx        # Routing logic & Private Route protection
 └── main.tsx       # Application entry point

## 🏁 Getting Started
```

Prerequisites
Node.js (v16 or higher)

npm or yarn

Installation
Clone the repository:

Bash
git clone [https://github.com/your-username/helpdesk-system.git](https://github.com/your-username/helpdesk-system.git)
Install dependencies:

Bash
npm install
Run the development server:

Bash
npm run dev
👤 Author
Hadassah Fishel
Fullstack Developer
GitHub Profile | LinkedIn Profile