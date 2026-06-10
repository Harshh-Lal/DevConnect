<div align="center">

<img src="https://img.shields.io/badge/DevConnect-000000?style=for-the-badge&logoColor=F59E0B" alt="DevConnect" />

# DevConnect

### A developer networking platform to showcase projects, follow peers, and discover talent.

[![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=flat-square&logo=cloudinary&logoColor=white)](https://cloudinary.com/)

**[Live Demo](https://devconnect.vercel.app)** &nbsp;·&nbsp; **[Report a Bug](https://github.com/harshh-lal/devconnect/issues)** &nbsp;·&nbsp; **[Request Feature](https://github.com/harshh-lal/devconnect/issues)**

</div>

---

## What is DevConnect?

DevConnect is a full-stack social platform built for developers. Instead of a static resume or a disconnected GitHub profile, DevConnect gives every developer a living portfolio — projects with context, a community of peers, and a feed that grows with the people they follow.

Think LinkedIn meets GitHub, built specifically for developers who want to show what they've actually built.

---

## Screenshots

<table>
  <tr>
    <td><img src="./screenshots/landing.png" alt="Landing Page" /></td>
    <td><img src="./screenshots/explore.png" alt="Explore Page" /></td>
  </tr>
  <tr>
    <td align="center"><b>Landing Page</b></td>
    <td align="center"><b>Explore Developers</b></td>
  </tr>
  <tr>
    <td><img src="./screenshots/profile.png" alt="Profile Page" /></td>
    <td><img src="./screenshots/feed.png" alt="Feed Page" /></td>
  </tr>
  <tr>
    <td align="center"><b>Developer Profile</b></td>
    <td align="center"><b>Personalized Feed</b></td>
  </tr>
</table>

---

## Features

- **Authentication** — Secure register/login with JWT and bcrypt password hashing
- **Developer Profiles** — Bio, skills, location, avatar upload via Cloudinary
- **GitHub Integration** — Auto-sync top 6 public repositories from GitHub API
- **Project Posts** — Create posts with title, description, tech stack tags, GitHub and live links
- **Follow System** — Follow developers, get a personalized feed of their posts
- **Explore & Search** — Browse all developers, filter by skill tags
- **Likes & Comments** — Engage with posts from the community
- **Responsive UI** — Works across desktop, tablet, and mobile

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS v4, Framer Motion |
| Routing | React Router v7 |
| Forms | React Hook Form + Zod |
| State | Zustand |
| HTTP | Axios |
| Backend | Node.js, Express.js |
| ORM | Prisma |
| Database | PostgreSQL (Neon) |
| Auth | JWT + bcrypt |
| File Uploads | Multer + Cloudinary |
| External API | GitHub REST API v3 |
| Deployment | Vercel (frontend) · Railway (backend) · Neon (database) |

---

## Project Structure

```
devconnect/
├── client/                   # React frontend (Vite)
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Route-level page components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── lib/              # Axios instance, API helpers
│   │   ├── store/            # Zustand global state
│   │   └── App.jsx           # Routes + layout
│   └── index.html
│
└── server/                   # Node.js + Express backend
    ├── prisma/
    │   ├── schema.prisma     # Database schema
    │   └── seed.js           # Demo data seed script
    └── src/
        ├── controllers/      # Request/response handlers
        ├── routes/           # Express route definitions
        ├── services/         # Business logic
        ├── middleware/       # Auth, validation, upload
        └── app.js            # Express app setup
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- PostgreSQL database (local or [Neon](https://neon.tech) free tier)
- [Cloudinary](https://cloudinary.com) account (free tier)
- Git

### 1. Clone the repository

```bash
git clone https://github.com/harshh-lal/devconnect.git
cd devconnect
```

### 2. Set up the backend

```bash
cd server
npm install
```

Create a `.env` file in `/server` using `.env.example` as reference:

```env
DATABASE_URL="postgresql://user:password@host:5432/devconnect"
JWT_SECRET="your-secret-key-min-32-chars"
JWT_EXPIRES_IN="7d"
BCRYPT_SALT_ROUNDS=10
PORT=5000
NODE_ENV=development
CLIENT_URL="http://localhost:5173"
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
GITHUB_API_TOKEN=""        # Optional — raises rate limit to 5000/hr
```

Run migrations and seed the database:

```bash
npx prisma migrate dev
npx prisma db seed
```

Start the backend:

```bash
npm run dev
```

Server runs at `http://localhost:5000`

### 3. Set up the frontend

```bash
cd ../client
npm install
```

Create a `.env` file in `/client`:

```env
VITE_API_URL="http://localhost:5000"
```

Start the frontend:

```bash
npm run dev
```

App runs at `http://localhost:5173`

---

## Environment Variables

### Backend (`/server/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `JWT_SECRET` | ✅ | Secret key for signing JWT tokens |
| `JWT_EXPIRES_IN` | ✅ | Token expiry duration (e.g. `7d`) |
| `BCRYPT_SALT_ROUNDS` | ✅ | bcrypt hashing rounds (recommended: `10`) |
| `PORT` | ✅ | Port for Express server |
| `CLIENT_URL` | ✅ | Frontend URL for CORS whitelist |
| `CLOUDINARY_CLOUD_NAME` | ✅ | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | ✅ | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | ✅ | Cloudinary API secret |
| `GITHUB_API_TOKEN` | ❌ | Personal access token — optional but recommended |

### Frontend (`/client/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | ✅ | Backend API base URL |

---

## API Overview

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/register` | — | Register new user |
| `POST` | `/api/auth/login` | — | Login, returns JWT |
| `GET` | `/api/auth/me` | ✅ | Get current user |
| `GET` | `/api/users/:username` | Optional | Public developer profile |
| `PUT` | `/api/users/profile` | ✅ | Update own profile |
| `GET` | `/api/users/search?skills=` | — | Search by skill tags |
| `POST` | `/api/users/:id/follow` | ✅ | Follow a developer |
| `DELETE` | `/api/users/:id/follow` | ✅ | Unfollow a developer |
| `GET` | `/api/posts/feed` | ✅ | Personalized feed |
| `GET` | `/api/posts/explore` | — | All posts |
| `POST` | `/api/posts` | ✅ | Create a post |
| `DELETE` | `/api/posts/:id` | ✅ | Delete own post |
| `POST` | `/api/posts/:id/like` | ✅ | Like a post |
| `POST` | `/api/posts/:id/comments` | ✅ | Comment on a post |
| `GET` | `/api/github/:username/repos` | — | Fetch GitHub repos |
| `POST` | `/api/upload/avatar` | ✅ | Upload avatar image |

---

## Deployment

This project is deployed using:

- **Frontend** → [Vercel](https://vercel.com) — root directory: `/client`
- **Backend** → [Railway](https://railway.app) — root directory: `/server`
- **Database** → [Neon](https://neon.tech) — serverless PostgreSQL

For production deployment, set `NODE_ENV=production` and update `CLIENT_URL` to your Vercel domain in Railway environment variables.

---

## Roadmap

- [ ] Real-time notifications via Socket.io
- [ ] Direct messaging between developers
- [ ] GitHub OAuth login
- [ ] Dark / light mode toggle
- [ ] Post image uploads
- [ ] Bookmark / save posts

---

## Author

**Harsh Lal** — [@harsh_lal](https://github.com/harshh-lal)

SY B.Tech CSE (AI/ML) · PCCOE Pune

---

<div align="center">

If you found this project useful, consider giving it a ⭐

</div>
