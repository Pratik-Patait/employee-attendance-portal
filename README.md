# Employee Attendance Portal

A secure, web-based Employee Attendance and Leave Management Portal supporting Employee, Manager, and HR roles with server-side role-based access control (RBAC), daily attendance logging, and a maker-checker leave approval workflow.

---

## Tech Stack
* **Frontend:** React.js, React Router v6, Axios, Lucide Icons, Vite
* **Backend:** Node.js, Express.js, Sequelize ORM
* **Database:** PostgreSQL

---

## Key Features & Business Rules
* **15-Minute Inactivity Session Timeout:** Enforced at the database and middleware level. Sessions expire after 15 minutes of inactivity; expired tokens are rejected server-side and automatically redirect the frontend to login.
* **Attendance Constraints:** Employees and Managers can check in/out once per calendar day (guaranteed via a composite unique constraint). HR is restricted from checking in/out.
* **Maker-Checker Leave Workflow:** Employees and Managers apply for leave; managers approve or reject requests with mandatory remarks. Managers cannot approve their own leave requests.
* **HR Administration:** HR manages user accounts, assigns roles, configures reporting managers, deactivates accounts, and manages company leave types with annual quotas.

---

## Seed Accounts (Credentials)
All accounts are seeded with password: `Password@123`
* **HR Administrator:** `hr_admin`
* **Senior Manager:** `manager_one`
* **Team Manager:** `manager_two`
* **Employee:** `emp_one` (reports to `manager_two`)
* **Employee:** `emp_two` (reports to `manager_two`)

---

## Local Setup & Installation

### 1. Database Setup (PostgreSQL)
Ensure PostgreSQL is running locally on port `5432`. You can either:
* **Option A (Sequelize Migrations & Seeders):**
  ```bash
  cd backend
  npm install
  npx sequelize-cli db:create
  npx sequelize-cli db:migrate
  npx sequelize-cli db:seed:all