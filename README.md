# 🏥 SMOAS - Smart Medical Operations & Analytics System
A complete clinic operations platform for **Admin + Doctor** workflows: patients, appointments, billing, analytics, and audit logs.

Built with **React (Vite)** + **Node.js/Express** + **MongoDB (Mongoose)** + **JWT/RBAC**.

---

## 🚀 What SMOAS Does (Real Clinic Workflow)
### ✅ Admin (Clinic Desk)
- Register patients (create/update/search)
- Book/edit/cancel appointments (clinic-side booking)
- Assign appointments to doctors
- Generate invoices from appointments
- Record payments
- View analytics dashboards (KPIs + charts)
- View audit logs (who changed what)

### ✅ Doctor
- Login with doctor account
- View **only** their own appointments
- View assigned patient details (read-only)
- No booking, no billing permissions

---

## ✨ Features
### 📅 Appointments
- Create / edit / cancel
- Search + pagination
- Conflict-aware booking (doctor schedule)
- Real-time updates via Socket.IO

### 🧾 Billing & Payments
- Generate invoice from appointment
- Invoice items (name, price, qty)
- Tax + currency
- Record payment
- Search + pagination

### 📊 Analytics
- KPI cards
- Revenue trend
- Workload insights

### 📝 Audit Logs
- Tracks create/update/delete events
- Admin-only access

### 🔐 Security
- JWT authentication
- Role-based access control (Admin / Doctor)
- Protected frontend routes

---

## 🧱 Tech Stack
### Frontend
- React (hooks, functional components)
- Vite
- Responsive CSS UI components
- Toast notifications
- Charts (Recharts / Chart.js depending on build)

### Backend
- Node.js + Express.js
- REST API
- JWT auth + RBAC middleware
- Zod validation middleware
- Socket.IO for realtime events

### Database
- MongoDB Atlas or local MongoDB
- Mongoose schemas

---

## 📦 Installation

### Prerequisites
- Node.js 18+
- npm
- MongoDB Atlas connection string (recommended) or local MongoDB

---

## ⚡ Quick Start (Local)
### 1) Backend
```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_secret_key
MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>/<db_name>
CLIENT_ORIGIN=http://localhost:5173
```

Run backend:
```bash
npm run dev
```

(Optional) Seed demo users:
```bash
npm run seed
```

---

### 2) Frontend
```bash
cd ../frontend
npm install
npm run dev
```

Open:
- Frontend: http://localhost:5173
- Backend:  http://localhost:5000

---

## 🔑 Login & Accounts
### Admin adds doctors from the app
1. Login as **Admin**
2. Open **Doctors** page
3. Click **+ Add Doctor**
4. Enter: name, email, phone, temporary password
5. Doctor can login immediately

> Doctors have read-only access to their own schedule.

---

## 🧾 Billing Notes (Important)
The backend validation for invoice generation expects:
- `appointmentId` (string)
- `items[]` with `{ name, price, qty? }`
- optional `tax`, optional `currency`

Example payload:
```json
{
  "appointmentId": "xxxxxxxxxxxxxxxxxxxx",
  "items": [
    { "name": "Consultation", "price": 20, "qty": 1 }
  ],
  "tax": 1,
  "currency": "JOD"
}
```

---

## 🌐 API Endpoints (Core)

### Auth
- `POST /api/auth/login`

### Patients
- `GET /api/patients?q=&page=1&limit=10`
- `POST /api/patients`
- `PUT /api/patients/:id`
- `DELETE /api/patients/:id`

### Appointments
- `GET /api/appointments?q=&page=1&limit=10`
- `POST /api/appointments`
- `PUT /api/appointments/:id`
- `DELETE /api/appointments/:id`

### Billing
- `GET /api/invoices?q=&page=1&limit=10`
- `POST /api/invoices/generate`
- `POST /api/invoices/:id/pay`

### Doctors (Admin)
- `GET /api/users?role=doctor` *(if enabled)*
- `POST /api/admin/doctors` *(create doctor account)*

### Audit (Admin)
- `GET /api/audit?page=1&limit=10`

---

## 📁 Project Structure
```txt
SMOAS/
├─ backend/
│  ├─ src/
│  │  ├─ config/            # DB connection
│  │  ├─ controllers/       # route logic
│  │  ├─ middleware/        # auth, rbac, validate, errors
│  │  ├─ models/            # mongoose schemas
│  │  ├─ routes/            # express routers
│  │  ├─ services/          # business logic helpers
│  │  ├─ utils/             # helpers (logger, etc)
│  │  ├─ seed/              # seeding users
│  │  └─ server.js          # app bootstrap
│  ├─ package.json
│  └─ .env.example
│
└─ frontend/
   ├─ src/
   │  ├─ pages/             # dashboards + modules
   │  ├─ services/          # API calls
   │  ├─ routes/            # ProtectedRoute
   │  ├─ state/             # auth store/hooks
   │  └─ ui/                # reusable UI + layout + toast
   ├─ package.json
   └─ vite.config.*
```

---

## 🏢 Selling to Multiple Clinics (Multi-Tenant)
### ✅ Recommended (simple & safe): **Database per clinic**
Give each clinic a separate database name:
- `smoas_clinic_a`
- `smoas_clinic_b`
- `smoas_clinic_c`

Each clinic gets:
- its own Admin account
- isolated data (no mixing)
- same codebase

### Alternative (scale): **Single DB + clinicId**
Add `clinicId` to User/Patient/Appointment/Invoice and filter every query by `req.user.clinicId`.

---

## 🚀 Production
### Frontend build
```bash
cd frontend
npm run build
```

### Backend start
```bash
cd backend
npm start
```

Use **PM2** (recommended) in production.

---

## 🔒 Security Tips (Production)
- Enable HTTPS
- Use strong JWT secret
- Add rate limiting
- Add request sanitization/validation
- Protect Atlas IP whitelist

---

## 📄 License
Commercial / Proprietary (intended to be sold to clinics).

---
