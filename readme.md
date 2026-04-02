# CareSync — NGO Management System

CareSync is a full-stack web application built for NGOs to manage children, staff, health records, attendance, donations, inventory, and expenses from a single dashboard.

---

## Project Documents

- [Product Requirements Document](./prd.md)
- [Technical Requirements Document](./trd.md)

---

## Tech Stack

### Frontend
- React + Vite
- Tailwind CSS + shadcn/ui
- Zustand (auth state)
- Axios (with JWT interceptor)

### Backend
- Node.js + Express.js
- Prisma ORM
- PostgreSQL (Neon.tech)
- JWT + bcrypt

---

## Project Structure
```
caresync/
├── client/                 # React frontend (already complete)
├── server/                 # Express backend (in progress)
├── PRD.md
├── TRD.md
└── README.md
```

---

## Modules

| Module | Frontend | Backend |
|--------|----------|---------|
| Auth | ✅ Done | 🔧 In Progress |
| Children | ✅ Done | 🔧 In Progress |
| Staff | ✅ Done | 🔧 In Progress |
| Health Desk | ✅ Done | 🔧 In Progress |
| Staff Attendance | ✅ Done | 🔧 In Progress |
| Donations | ✅ Done | 🔧 In Progress |
| Inventory | ✅ Done | 🔧 In Progress |
| Expenses | ✅ Done | 🔧 In Progress |
| Dashboard | ✅ Done | 🔧 In Progress |

---

## Environment Variables

### Server (`server/.env`)
```
DATABASE_URL=
JWT_SECRET=
PORT=5000
```

### Client (`client/.env`)
```
VITE_API_URL=http://localhost:5000/api
```

---

## Getting Started

### Server
```bash
cd server
npm install
npx prisma migrate dev
npm run dev
```

### Client
```bash
cd client
npm install
npm run dev
```

---

## API Base URL

All backend routes are prefixed with `/api`

| Route Prefix | Module |
|---|---|
| /api/auth | Authentication |
| /api/children | Children Management |
| /api/staff | Staff Management |
| /api/health | Health Records |
| /api/attendance | Staff Attendance |
| /api/donations | Donations |
| /api/inventory | Inventory |
| /api/expenses | Expense Tracker |
| /api/dashboard | Dashboard Stats |

---

## Notes

- Frontend is fully built. Backend is being implemented module by module.
- `/api/donations/public` is the only unprotected GET route besides auth.
- All tokens are stored in Zustand memory only — no localStorage.