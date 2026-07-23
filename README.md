# Jobseeker

A full-stack MERN job portal connecting job seekers and recruiters — with resume analysis, an AI chatbot, bookmarking, and a recruiter analytics dashboard.

**Live App:** [jobseeker-nu.vercel.app](https://jobseeker-nu.vercel.app)
**API:** [jobseeker-jqt2.onrender.com](https://jobseeker-jqt2.onrender.com)

---

## Features

**Job Seekers**
- Register/login with email OTP verification and password reset
- Browse and filter jobs (location, industry, and more via server-side filtering)
- Apply to jobs and track application status
- Bookmark jobs for later
- AI resume analyzer — upload a resume and get instant feedback
- AI chatbot for platform Q&A and quick navigation
- Editable profile with resume/profile photo upload

**Recruiters**
- Company registration and profile management
- Post and manage job listings
- View and manage applicants per job, update application status
- Recruiter analytics dashboard (charts via Recharts) with stats on postings and applicants

**Platform**
- JWT-based authentication with protected routes
- Rate limiting on OTP and login endpoints to prevent abuse
- Cloudinary integration for resume/image uploads
- Email delivery via Resend

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Redux Toolkit, Redux Persist, React Router, Tailwind CSS, Vite |
| Backend | Node.js, Express 5 |
| Database | MongoDB (Mongoose) |
| Auth | JWT, bcrypt |
| AI | Groq SDK (chatbot + resume analysis) |
| File Storage | Cloudinary, Multer |
| Email | Resend, Nodemailer |
| Deployment | Vercel (client), Render (server) |

---

## Project Structure

```
Jobseeker/
├── client/                  # React frontend
│   └── src/
│       ├── components/      # Shared UI (Navbar, Job cards, Auth forms, etc.)
│       │   ├── Auth/        # Login, Signup, OTP, password reset
│       │   └── chatbot/     # Chatbot interface
│       ├── admin/           # Recruiter dashboard, job posting, applicants, company management
│       ├── redux/           # Redux slices and store
│       ├── hooks/           # Custom React hooks
│       └── utilis/          # API endpoint constants
│
└── server/                  # Express backend
    ├── controller/          # Route logic (user, job, company, application, chatbot, resume, bookmark)
    ├── routes/              # API route definitions
    ├── Model/               # Mongoose schemas (User, Job, Company, Application, Otp)
    ├── middleware/           # Auth guard, file upload, rate limiting
    ├── Service/              # Third-party AI service integration
    ├── utlis/                # DB connection, Cloudinary, email, OTP helpers
    └── index.js              # App entry point
```

---

## API Overview

Base URL: `/api/v1`

| Resource | Endpoints |
|---|---|
| `/user` | `register`, `login`, `logout`, `me`, `profile/update`, `send-otp`, `verify-otp`, `reset-password` |
| `/company` | `register`, `get`, `get/:id`, `update/:id` |
| `/job` | `post`, `get`, `getadminjobs`, `get/:id`, `stats`, `filter-options` |
| `/application` | `apply/:id`, `get`, `:id/applicants`, `status/:id/update` |
| `/bookmark` | `toggle/:id`, `all` |
| `/chatbot` | `getchatbot` |
| `/resume` | `analyze` |

Most routes are protected and require an authenticated session (JWT cookie).

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- A MongoDB database (local or Atlas)
- API keys/accounts: Cloudinary, Groq, Resend

### 1. Clone the repository
```bash
git clone https://github.com/Priya-123-debug/Jobseeker.git
cd Jobseeker
```

### 2. Set up the backend
```bash
cd server
npm install
```

Create a `.env` file inside `server/`:
```env
PORT=5000
MONGO_URL=your_mongodb_connection_string
JWT_KEY=your_jwt_secret
CLIENT_URL=http://localhost:5173

# Cloudinary
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret

# Groq (chatbot + resume analyzer)
GROQ_API_KEY=your_groq_api_key

# Resend (emails)
RESEND_API_KEY=your_resend_api_key
```

Run the backend:
```bash
npm run dev      # nodemon (development)
npm start        # production
```

### 3. Set up the frontend
```bash
cd ../client
npm install
```

Create a `.env` file inside `client/`:
```env
VITE_API_BASE_URL=http://localhost:5000
```

Run the frontend:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`, talking to the API at `http://localhost:5000`.

> **Note:** Vite inlines environment variables at build time — redeploy the frontend after changing `VITE_API_BASE_URL`.

---

## Deployment Notes

- **Backend (Render free tier):** cold starts occur after inactivity; a keep-alive ping (e.g. via cron-job.org) is recommended for demo purposes.
- **Cross-domain cookies:** since the frontend and backend live on different domains (Vercel + Render), cookie-based auth is subject to standard cross-site cookie restrictions — ensure `CLIENT_URL` and CORS origins are set correctly, and cookies use `SameSite=None; Secure` in production.
- **Case sensitivity:** Linux-based hosts (Render) are case-sensitive for file paths — keep folder/import casing consistent if developing on Windows/macOS.

---

## Roadmap
- [ ] Further security hardening (helmet, stricter rate limits across all routes)
- [ ] Expanded test coverage
- [ ] Job listing expiry

---



