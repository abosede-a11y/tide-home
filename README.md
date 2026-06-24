# 🌊 Tide Home — Care Management Platform

Full-stack care home management system built with **NestJS** (API) + **React** (frontend).

---

## Project structure

```
tidehome/
├── tidehome-api/          # NestJS backend (REST API + WebSocket)
│   ├── src/
│   │   ├── auth/          # JWT auth, login, forgot password
│   │   ├── users/         # User accounts, roles, credentials email
│   │   ├── residents/     # Resident records
│   │   ├── medications/   # Medication tracking, dose logging
│   │   ├── appointments/  # Hospital visit scheduling
│   │   ├── payments/      # Payment records, receipts
│   │   ├── blog/          # Blog posts (public + admin)
│   │   ├── faq/           # FAQ (public + admin)
│   │   ├── permissions/   # Feature access control per role
│   │   ├── chat/          # Socket.io live chat gateway
│   │   ├── common/        # Guards, decorators, mail service
│   │   └── database/      # Seed script
│   └── .env.example
│
└── tidehome-web/          # React + Vite + Tailwind CSS frontend
    └── src/
        ├── pages/
        │   ├── public/    # Landing page (public website)
        │   └── portal/    # Portal pages (dashboard, residents, etc.)
        ├── components/
        │   └── layout/    # Portal sidebar + topbar layout
        ├── context/       # AuthContext (JWT, permissions)
        └── services/      # Axios API client
```

---

## Quick start

### Prerequisites
- Node.js 18+
- PostgreSQL running locally
- A Gmail account (or any SMTP) for email

---

### 1. Clone & setup environment

```bash
cd tidehome-api
cp .env.example .env
```

Edit `.env` with your details:

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=tidehome

JWT_SECRET=change_this_to_something_long_and_random
JWT_EXPIRES_IN=7d

MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your@gmail.com
MAIL_PASS=your_gmail_app_password   # Not your regular password — use App Password
MAIL_FROM=noreply@tidehome.co.uk

PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

> **Gmail app password:** Go to your Google account → Security → 2-Step Verification → App passwords. Generate one for "Mail".

---

### 2. Create the PostgreSQL database

```bash
psql -U postgres -c "CREATE DATABASE tidehome;"
```

---

### 3. Install & run the API

```bash
cd tidehome-api
npm install
npm run start:dev
```

API runs at: `http://localhost:3001`  
Swagger docs: `http://localhost:3001/api/docs`

TypeORM will auto-create all tables on first run (`synchronize: true` in dev).

---

### 4. Seed the database

In a new terminal:

```bash
cd tidehome-api
npm run seed
```

This creates test accounts:

| Role        | Email                         | Password         |
|-------------|-------------------------------|------------------|
| Super Admin | superadmin@tidehome.co.uk     | TideHome@2025!   |
| Admin       | admin@tidehome.co.uk          | Admin@2025!      |
| Staff       | staff@tidehome.co.uk          | Staff@2025!      |
| Guardian    | guardian@tidehome.co.uk       | Guardian@2025!   |

---

### 5. Install & run the frontend

```bash
cd tidehome-web
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

API calls are proxied through Vite — no CORS issues in development.

---

### 6. Run both together (from root)

```bash
npm install          # installs concurrently at root
npm run dev          # starts both API and frontend
```

---

## Roles & permissions

| Feature         | Super Admin | Admin | Staff | Guardian |
|-----------------|:-----------:|:-----:|:-----:|:--------:|
| Dashboard       | ✅          | ✅    | ✅    | ✅       |
| Residents       | ✅          | ✅    | ✅    | ❌       |
| Medications     | ✅          | ✅    | ✅    | ❌       |
| Hospital visits | ✅          | ✅    | ✅    | ✅       |
| Payments        | ✅          | ✅    | ❌    | ✅       |
| My profile      | ✅          | ✅    | ✅    | ✅       |
| Live chat       | ✅          | ✅    | ✅    | ✅       |
| Blog manager    | ✅          | ✅    | ❌    | ❌       |
| FAQ manager     | ✅          | ✅    | ❌    | ❌       |
| User accounts   | ✅          | ✅    | ❌    | ❌       |
| Permissions     | ✅          | ❌    | ❌    | ❌       |

- **Super Admin** can toggle any permission for any role from the Permissions page.
- **Admin** can edit resident name, photo, and SSN — staff/guardians cannot.
- **Accounts** are created by admin only — no self-registration. Credentials are emailed via Nodemailer.
- **Guardian** accounts are linked to a specific resident via `linkedResidentId`.

---

## Key features

- 🔐 JWT auth with role-based access control
- 📧 Welcome email with auto-generated credentials on account creation
- 🔒 Locked nav items for restricted features (with 🔒 icon)
- 👁️ Show/hide toggle on all password fields
- 🏥 Hospital visit scheduling & status tracking
- 💊 Medication dose logging with staff attribution
- 💳 Payment records with printable receipts
- 💬 Real-time chat via Socket.io
- 📝 Blog & FAQ management (public + admin)
- ⚙️ Super admin feature toggle matrix

---

## API endpoints (summary)

```
POST   /api/auth/login
GET    /api/auth/me
POST   /api/auth/forgot-password
POST   /api/auth/reset-password

GET    /api/users                   (admin+)
POST   /api/users                   (admin+)
PATCH  /api/users/me
PATCH  /api/users/me/password
POST   /api/users/:id/resend-credentials

GET    /api/residents               (staff+)
GET    /api/residents/my-residents  (guardian)
POST   /api/residents               (admin+)

GET    /api/medications
POST   /api/medications/:id/log-dose

GET    /api/appointments
POST   /api/appointments
PATCH  /api/appointments/:id

GET    /api/payments
GET    /api/payments/summary
POST   /api/payments

GET    /api/blog/public             (no auth)
GET    /api/faq/public              (no auth)

GET    /api/permissions
GET    /api/permissions/my-access
PATCH  /api/permissions             (super admin only)
```

Full interactive docs at `/api/docs` (Swagger).

---

## Production checklist

- [ ] Set `NODE_ENV=production` (disables TypeORM synchronize)
- [ ] Run migrations instead of synchronize
- [ ] Use Redis for password reset tokens (replace in-memory Map)
- [ ] Set a strong `JWT_SECRET`
- [ ] Add rate limiting (`@nestjs/throttler`)
- [ ] Set up HTTPS / reverse proxy (nginx)
- [ ] Configure proper CORS origin
- [ ] Add file upload storage (S3 / Cloudinary) for photos
