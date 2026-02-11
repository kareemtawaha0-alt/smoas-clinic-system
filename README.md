# SMOAS - Smart Medical Operations & Analytics System

Production-ready clinic management system built with React, Node.js and MongoDB.

ROLES

Admin:
- Create doctors and give them login accounts
- Manage patients
- Book and manage appointments
- Generate invoices and record payments
- View dashboards and audit logs

Doctor:
- View only his own appointments
- View assigned patients
- Cannot create appointments or invoices


SYSTEM STACK

Frontend:
- React + Vite
- CSS responsive UI
- Charts

Backend:
- Node.js + Express
- JWT Authentication
- Role based access control
- Socket.IO

Database:
- MongoDB


PROJECT STRUCTURE

backend/
  controllers
  routes
  models
  middleware
  services

frontend/
  pages
  services
  ui
  state
  routes


LOCAL SETUP

1. Backend

cd backend
npm install

copy .env.example to .env

Edit .env

PORT=5000
JWT_SECRET=your_secret
MONGO_URI=your_mongodb_url
CLIENT_ORIGIN=http://localhost:5173

Run backend

npm run dev


2. Frontend

cd frontend
npm install
npm run dev

Open browser

http://localhost:5173


BILLING FLOW

Admin creates appointment
Admin opens billing page
Admin generates invoice
Admin records payment


MAIN API

POST /api/auth/login
GET /api/patients
POST /api/patients
GET /api/appointments
POST /api/appointments
POST /api/invoices/generate
POST /api/invoices/{id}/pay


MULTI CLINIC USAGE

Recommended approach:
One database per clinic.

Each clinic has:
- its own database
- its own admin account
- completely isolated data

Example:
smoas_clinic_a
smoas_clinic_b
smoas_clinic_c


PRODUCTION

Frontend build:
npm run build

Backend run:
npm start


LICENSE

Commercial system
