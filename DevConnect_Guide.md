# DevConnect — Complete Developer Guide
**From Zero to Deployed · Your Internship-Winning Project**

| Audience | Build Time | Goal |
|---|---|---|
| SY / 4th Sem | ~4–5 Weeks | Internship Ready |

---

## Table of Contents

1. [What is DevConnect?](#1-what-is-devconnect)
2. [Tech Stack](#2-tech-stack)
3. [Features — What to Build](#3-features--what-to-build)
4. [Database Design](#4-database-design)
5. [API Routes Design](#5-api-routes-design)
6. [Development Phases](#6-development-phases)
7. [Folder Structure](#7-folder-structure)
8. [Key Concepts You'll Learn](#8-key-concepts-youll-learn)
9. [Environment & Tools Setup](#9-environment--tools-setup)
10. [Git & GitHub Workflow](#10-git--github-workflow)
11. [Deployment Guide](#11-deployment-guide)
12. [YouTube Learning References](#12-youtube-learning-references)
13. [Interview Prep](#13-interview-prep--questions-youll-get)
14. [Common Mistakes to Avoid](#14-common-mistakes-to-avoid)
15. [Realistic Timeline](#15-realistic-timeline)

---

## 1. What is DevConnect?

DevConnect is a full-stack developer networking platform — think mini LinkedIn fused with GitHub profile features. Developers can sign up, showcase their skills, post projects (pulled directly from their GitHub), follow other developers, and engage with the community through likes and comments.

For recruiters, this project signals you understand: relational database design, REST API architecture, third-party API integration, JWT authentication, and modern React patterns. It's a complete, explainable, real-world application.

### Why DevConnect is the Right Project for You

- ✓ Clear scope — you can ship a solid v1 in 3–4 weeks
- ✓ Covers every core full-stack concept recruiters look for
- ✓ GitHub API integration shows you can read third-party docs
- ✓ Easy to explain in interviews: 'a developer networking platform'
- ✓ Deployable and shareable as a live link on your resume
- ✓ Grows with you — add features after landing the internship

---

## 2. Tech Stack

Every technology choice below is deliberate. No fluff, no overkill.

### Frontend

| Technology | Why This Choice |
|---|---|
| React 18 | Industry standard. Hooks-first approach shows modern patterns. |
| React Router v6 | Client-side routing. Protected routes for auth flow. |
| Tailwind CSS | Fast, responsive UI without writing custom CSS files. |
| Axios | HTTP client. Cleaner than fetch, easy interceptors for JWT. |
| React Hook Form | Lightweight form management. Validation built-in. |
| Zustand or Context API | Global state for auth. Zustand is lighter than Redux. |

### Backend

| Technology | Why This Choice |
|---|---|
| Node.js + Express | Fast to set up. RESTful APIs. Most internship stacks use this. |
| Prisma ORM | Type-safe DB queries. Auto-generates schema. Great DX. |
| PostgreSQL | Relational DB — shows you understand joins, relations, constraints. |
| JWT + bcrypt | Industry-standard auth. JWT for stateless tokens, bcrypt for hashing. |
| Multer + Cloudinary | Profile picture uploads. Cloudinary handles CDN delivery. |
| GitHub API (REST) | Pull developer repos. Demonstrates third-party API integration. |

### DevOps & Deployment

| Tool | Purpose |
|---|---|
| Railway | Deploy backend + PostgreSQL database. Free tier available. |
| Vercel | Deploy React frontend. Automatic CI/CD from GitHub pushes. |
| GitHub Actions (optional) | Basic CI pipeline. Bonus points with recruiters. |
| dotenv | Environment variable management for local dev. |

---

## 3. Features — What to Build

Build in this exact priority order. Ship each feature, then move to the next. Don't jump ahead.

### Core Features (Must-Have)

| Feature | Description |
|---|---|
| JWT Authentication | Register, login, logout. Store JWT in httpOnly cookie or localStorage. Protect routes. |
| Developer Profiles | Name, bio, skills (tags), location, avatar, GitHub username. |
| GitHub Repo Pull | On profile setup, fetch and display top repos via GitHub API. |
| Post Projects | Create project cards with title, description, tech stack tags, GitHub link, live link. |
| Follow System | Follow/unfollow developers. Follower/following counts on profile. |
| Developer Feed | Home page showing posts from developers you follow. |
| Search by Skills | Search bar filtering developers by skills (React, Node, Python, etc.). |

### Secondary Features (Build After Core)

| Feature | Description |
|---|---|
| Like System | Like/unlike posts. Show like count. Toggle state in UI. |
| Comments | Add comments to project posts. Delete your own comments. |
| Notifications (basic) | Simple notification when someone follows you or likes your post. |
| Edit Profile | Update bio, skills, avatar. Re-sync GitHub repos. |
| Explore Page | Grid of all developers. Filterable by skill tags. |

### Bonus Features (After Internship)

- Real-time notifications with Socket.io
- Direct messaging between developers
- GitHub contribution graph embed
- Dark mode toggle
- Project bookmarks / saved posts

---

## 4. Database Design

This is the foundation. Get this right before writing a single API route.

### Tables Overview

| Table | Purpose |
|---|---|
| users | Auth data + profile info. Central table everything relates to. |
| profiles | Extended profile: bio, skills, location, avatar URL, GitHub username. |
| posts | Project posts created by users. |
| follows | Self-referencing many-to-many: who follows whom. |
| likes | Many-to-many between users and posts. |
| comments | User comments on posts. |
| skills | Skill tags that can be linked to users and posts. |
| user_skills | Junction table: user-to-skill many-to-many. |
| post_skills | Junction table: post-to-skill many-to-many. |

### Prisma Schema Skeleton

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  username  String   @unique
  createdAt DateTime @default(now())
  profile   Profile?
  posts     Post[]
  likes     Like[]
  comments  Comment[]
  following Follow[] @relation('following')
  followers Follow[] @relation('followers')
}

model Profile {
  id         String  @id @default(cuid())
  userId     String  @unique
  bio        String?
  avatarUrl  String?
  location   String?
  githubUser String?
  user       User    @relation(fields: [userId], references: [id])
  skills     UserSkill[]
}

model Post {
  id          String   @id @default(cuid())
  userId      String
  title       String
  description String
  githubUrl   String?
  liveUrl     String?
  createdAt   DateTime @default(now())
  user        User     @relation(fields: [userId], references: [id])
  likes       Like[]
  comments    Comment[]
  skills      PostSkill[]
}

model Follow {
  followerId  String
  followingId String
  follower    User @relation('following', fields: [followerId], references: [id])
  following   User @relation('followers', fields: [followingId], references: [id])
  @@id([followerId, followingId])
}
```

---

## 5. API Routes Design

Design your REST API with clean, predictable naming before writing any code.

### Auth Routes

| Method + Endpoint | Description |
|---|---|
| POST /api/auth/register | Register new user. Hash password, return JWT. |
| POST /api/auth/login | Login. Validate password, return JWT. |
| POST /api/auth/logout | Clear JWT cookie / blacklist token. |
| GET /api/auth/me | Get current logged-in user (protected). |

### User / Profile Routes

| Method + Endpoint | Description |
|---|---|
| GET /api/users/:username | Get public profile of a developer. |
| PUT /api/users/profile | Update own profile (protected). |
| GET /api/users/search?skills=React | Search developers by skill. |
| GET /api/users/:id/followers | Get follower list. |
| GET /api/users/:id/following | Get following list. |
| POST /api/users/:id/follow | Follow a developer (protected). |
| DELETE /api/users/:id/follow | Unfollow a developer (protected). |

### Posts Routes

| Method + Endpoint | Description |
|---|---|
| GET /api/posts/feed | Get posts from followed developers (protected). |
| GET /api/posts/explore | Get all posts, paginated. |
| POST /api/posts | Create a post (protected). |
| GET /api/posts/:id | Get single post with comments. |
| DELETE /api/posts/:id | Delete own post (protected). |
| POST /api/posts/:id/like | Like a post (protected). |
| DELETE /api/posts/:id/like | Unlike a post (protected). |
| POST /api/posts/:id/comments | Add comment (protected). |
| DELETE /api/posts/:id/comments/:cid | Delete own comment (protected). |

### GitHub Routes

| Method + Endpoint | Description |
|---|---|
| GET /api/github/:username/repos | Fetch top repos from GitHub API for a username. |
| POST /api/github/sync | Re-sync logged-in user's GitHub repos (protected). |

---

## 6. Development Phases

Treat each phase as a mini-sprint. Don't start Phase 2 until Phase 1 is fully working and committed to GitHub.

### Phase 0: Project Setup & Configuration *(Day 1–2)*

- Initialize Git repo with `.gitignore` (node_modules, .env)
- Create `/client` (Vite + React) and `/server` (Node + Express) folders
- Set up `package.json` for both, install all dependencies
- Configure ESLint + Prettier for both projects
- Set up PostgreSQL locally (or use Railway from day 1)
- Initialize Prisma: `npx prisma init`
- Configure `.env` with `DATABASE_URL`, `JWT_SECRET`, Cloudinary keys
- Set up basic Express server with health check route: `GET /api/health`
- Configure CORS between frontend (5173) and backend (3000/5000)
- Create GitHub repo, push initial commit, set up branch strategy

### Phase 1: Authentication System *(Day 3–5)*

- Write Prisma schema for User model, run first migration
- Build `POST /api/auth/register` — validate input, hash password with bcrypt
- Build `POST /api/auth/login` — compare password, generate JWT
- Write auth middleware: `verifyToken` — extracts user from JWT header
- Build `GET /api/auth/me` — protected route returning current user
- On frontend: build Register and Login pages with React Hook Form
- Set up Axios instance with `baseURL` and JWT interceptor (auto-attach token)
- Set up AuthContext (or Zustand store) with user state + login/logout actions
- Implement protected route wrapper component in React Router
- Test everything: register a user, log in, access `/me`, try bad token

### Phase 2: Profiles & GitHub Integration *(Day 6–9)*

- Add Profile model to Prisma schema, run migration
- Build `PUT /api/users/profile` — update bio, skills, location, avatar
- Integrate Multer + Cloudinary for avatar upload endpoint
- Build `GET /api/github/:username/repos` — call GitHub REST API v3
- Store GitHub username in profile, display top 6 repos as cards
- Frontend: build Profile page layout (avatar, bio, skills tags, repos grid)
- Build Edit Profile modal/page with form pre-populated from API
- Add skills multi-select input (create Skill model + UserSkill junction)
- Display follower/following counts on profile (placeholder for now)
- Test profile creation, GitHub repo sync, avatar upload

### Phase 3: Posts System *(Day 10–13)*

- Add Post, Like, Comment, PostSkill models to Prisma, migrate
- Build `POST /api/posts` — create post with title, desc, tech stack, links
- Build `GET /api/posts/explore` — paginated list of all posts
- Build `GET /api/posts/:id` — single post with nested comments and likes
- Build `DELETE /api/posts/:id` — only post owner can delete
- Build `POST/DELETE /api/posts/:id/like` — toggle like with unique constraint
- Build `POST/DELETE /api/posts/:id/comments`
- Frontend: build PostCard component (title, tech tags, author, like button)
- Build CreatePost modal/page with form
- Build Explore page: grid of PostCards with pagination or infinite scroll
- Test full CRUD cycle: create post, like it, comment, delete

### Phase 4: Follow System & Feed *(Day 14–16)*

- Add Follow model to Prisma (self-referencing), migrate
- Build `POST /api/users/:id/follow` — create Follow record
- Build `DELETE /api/users/:id/follow` — delete Follow record
- Update profile endpoint to return `isFollowing` boolean for current user
- Build `GET /api/posts/feed` — posts from users the current user follows
- Frontend: add Follow/Unfollow button to profile page
- Build Home/Feed page showing posts from followed developers
- Update follower/following counts dynamically on follow/unfollow
- Build `GET /api/users/search?skills=React` — filter by skill tags
- Frontend: build Search page with skill filter chips and developer cards

### Phase 5: Polish, Deploy & README *(Day 17–21)*

- Responsive design pass — ensure all pages work on mobile
- Error handling: add global error boundary in React
- Loading states: skeleton screens or spinners for all async operations
- Empty states: 'No posts yet', 'Follow some developers to see a feed'
- Set up Railway project: add PostgreSQL addon, deploy Express backend
- Set up Vercel project: connect GitHub repo, add env variables, deploy React
- Run final end-to-end test on production URLs
- Write a detailed README: project overview, screenshots, setup instructions
- Add live demo link and tech stack badges to README
- Create 2–3 seed users/posts for demo purposes

---

## 7. Folder Structure

### Backend (`/server`)

```
server/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── controllers/    # Route logic (authController, postController...)
│   ├── middleware/     # verifyToken, errorHandler, upload (multer)
│   ├── routes/         # auth.routes.js, user.routes.js, post.routes.js
│   ├── services/       # githubService.js, cloudinaryService.js
│   ├── utils/          # generateToken.js, validateInput.js
│   └── app.js          # Express app setup, middleware, route mounting
├── server.js           # Entry point: import app, listen on PORT
└── .env
```

### Frontend (`/client`)

```
client/
├── src/
│   ├── api/            # axios.js instance + api call functions
│   ├── components/
│   │   ├── auth/       # LoginForm, RegisterForm, ProtectedRoute
│   │   ├── layout/     # Navbar, Sidebar, Footer
│   │   ├── posts/      # PostCard, PostGrid, CreatePostModal
│   │   ├── profile/    # ProfileHeader, SkillBadge, RepoCard
│   │   └── ui/         # Button, Input, Avatar, Modal (reusables)
│   ├── hooks/          # useAuth.js, usePosts.js, useProfile.js
│   ├── pages/          # Home, Login, Register, Profile, Explore, Search
│   ├── store/          # authStore.js (Zustand) or AuthContext.jsx
│   ├── utils/          # formatDate.js, truncateText.js
│   ├── App.jsx         # Routes setup
│   └── main.jsx        # React entry point
└── index.html
```

---

## 8. Key Concepts You'll Learn

### JWT Authentication Flow

- User logs in → server validates password → server signs JWT with secret → returns JWT
- Client stores JWT (localStorage or httpOnly cookie)
- Every protected request: client sends JWT in Authorization header
- Server middleware decodes JWT, attaches user to `req.user`, proceeds
- JWT has expiry — refresh token pattern is a bonus concept to understand

### Relational Database Concepts

- **One-to-One:** User → Profile (each user has exactly one profile)
- **One-to-Many:** User → Posts (one user can have many posts)
- **Many-to-Many:** Users ↔ Skills via UserSkill junction table
- **Self-referencing Many-to-Many:** Users ↔ Users via Follow table
- Prisma handles joins for you — but understand what's happening under the hood

### GitHub REST API

- No OAuth needed for public repos — simple GET requests with optional token
- Endpoint: `GET https://api.github.com/users/{username}/repos`
- Rate limit: 60 req/hr unauthenticated, 5000/hr with personal access token
- Sort by: `?sort=updated&per_page=6` to get most recent repos
- Response gives: name, description, language, stargazers_count, html_url

### React Patterns Used

- **Custom hooks** (useAuth, usePosts) — separating data logic from UI
- **Protected routes** — redirect to login if no valid JWT
- **Optimistic UI updates** — update UI before server confirms (likes)
- **Debounced search input** — prevent API call on every keystroke
- **Infinite scroll or pagination** — don't load 1000 posts at once

---

## 9. Environment & Tools Setup

### Tools to Install

| Tool | Download / Notes |
|---|---|
| Node.js v20 LTS | nodejs.org — install the LTS version |
| PostgreSQL 16 | postgresql.org — or use Railway's cloud DB from day 1 |
| VS Code | code.visualstudio.com |
| Postman | postman.com — test all API routes before connecting frontend |
| Git | git-scm.com |
| TablePlus (optional) | tableplus.com — visual PostgreSQL browser. Free tier works. |

### Recommended VS Code Extensions

- **Prisma** — syntax highlighting for schema.prisma
- **ESLint + Prettier** — code quality and formatting
- **Thunder Client** — lightweight Postman alternative inside VS Code
- **Tailwind CSS IntelliSense** — autocomplete for Tailwind classes
- **GitLens** — see git blame and history inline
- **Auto Rename Tag** — renames closing JSX tags automatically

### Initial Commands to Run

```bash
# Create project structure
mkdir devconnect && cd devconnect
mkdir server client

# Backend setup
cd server
npm init -y
npm install express prisma @prisma/client bcryptjs jsonwebtoken \
  cors dotenv multer cloudinary express-validator
npm install -D nodemon
npx prisma init

# Frontend setup
cd ../client
npm create vite@latest . -- --template react
npm install axios react-router-dom react-hook-form zustand
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

---

## 10. Git & GitHub Workflow

Treat this project like a professional repo from day one. Recruiters will look at your commit history.

### Branch Strategy

| Branch | Purpose |
|---|---|
| `main` | Production-ready code only. Deploy from here. |
| `dev` | Active development branch. Merge features here first. |
| `feature/auth` | Feature-specific branch. Merge into dev when done. |
| `feature/profiles` | One branch per Phase. |
| `feature/posts` | Keep changes isolated and reviewable. |
| `hotfix/xxx` | Quick production fixes directly to main. |

### Commit Message Convention

```
feat: add JWT authentication middleware
fix: resolve CORS error on /api/posts route
refactor: extract post service from controller
style: update PostCard responsive layout
docs: add API routes to README
```

Use conventional commits — it shows professionalism and makes your history scannable.

---

## 11. Deployment Guide

### Backend → Railway

1. Go to railway.app and create a new project
2. Add a PostgreSQL service to your project
3. Add a Web Service — connect your GitHub repo
4. Set root directory to `/server`
5. Add environment variables: `DATABASE_URL` (from Railway), `JWT_SECRET`, `CLOUDINARY_URL`
6. Railway auto-detects Node.js and runs `npm start`
7. Copy your Railway backend URL — you'll need this for Vercel

### Frontend → Vercel

1. Go to vercel.com and import your GitHub repo
2. Set root directory to `/client`
3. Add environment variable: `VITE_API_URL` = your Railway backend URL
4. Vercel auto-runs `npm run build` and deploys the `dist/` folder
5. Every push to `main` triggers automatic redeploy — CI/CD for free

---

**Resume Line After Deployment:**

> **DevConnect — Full-Stack Developer Networking Platform**
> React, Node.js, Express, PostgreSQL (Prisma), JWT Auth, GitHub API
> Live: devconnect.vercel.app | GitHub: github.com/yourname/devconnect

---

## 12. YouTube Learning References

Watch these in order. Don't binge — watch, then immediately build what you learned.

### Phase 0–1: Setup & Auth

| Video / Channel | What You'll Learn |
|---|---|
| 'JWT Authentication Node.js' — Traversy Media | Complete JWT auth in Express. |
| 'Full Stack MERN Authentication' — Dave Gray | Register/login with React + Node, protected routes. |
| 'Prisma Crash Course' — Traversy Media | Schema design, migrations, CRUD with Prisma. |
| 'React Router v6 Tutorial' — Web Dev Simplified | Routes, nested routes, protected routes in React. |

### Phase 2: Profiles & File Upload

| Video / Channel | What You'll Learn |
|---|---|
| 'Image Upload Node.js Cloudinary' — Traversy Media | Multer + Cloudinary full setup. |
| 'GitHub API Tutorial' — any recent video | Fetching user repos, handling rate limits. |
| 'React Hook Form Tutorial' — Cosden Solutions | Form validation, controlled vs uncontrolled inputs. |

### Phase 3–4: Posts, Likes, Feed

| Video / Channel | What You'll Learn |
|---|---|
| 'Build a Social Media App' — JavaScript Mastery | Full project walkthrough. Skip what you've built. |
| 'Pagination in React + Node' — Laith Academy | Server-side pagination pattern. |
| 'React Optimistic UI' — Jack Herrington | Update UI before server confirms. For likes. |

### Phase 5: Deployment

| Video / Channel | What You'll Learn |
|---|---|
| 'Deploy Node.js to Railway' — any recent video | Full Railway deployment with PostgreSQL. |
| 'Deploy React to Vercel' — Traversy Media | Vercel deployment with env variables. |
| 'Full Stack App Deployment 2024' — Code With Antonio | End-to-end deployment walkthrough. |

### General Must-Watch

- 'REST API Design Best Practices' — Web Dev Simplified — Watch before writing routes
- 'PostgreSQL Tutorial for Beginners' — TechWorld with Nana — If DB is new to you
- 'Tailwind CSS Crash Course' — Traversy Media — 90 min, cover all utility classes
- 'React Custom Hooks' — Web Dev Simplified — Essential pattern used throughout

---

## 13. Interview Prep — Questions You'll Get

| Question | Talking Points |
|---|---|
| Walk me through your project. | What it does → tech stack → one interesting challenge you solved. |
| Why PostgreSQL over MongoDB? | Social graph = relationships. Relational DB handles joins/constraints better for follows, likes. |
| How does JWT authentication work? | User logs in → server signs token → client sends token in headers → middleware decodes. |
| How did you use the GitHub API? | Unauthenticated REST calls, rate limiting strategy, data transformation before storing. |
| What was the hardest part? | Prepare a real answer — database schema design, or the follow/feed query optimization. |
| How would you scale this? | Redis caching for feed, CDN for images, horizontal scaling, database indexing. |
| What would you add next? | Socket.io for real-time notifications, OAuth login with GitHub, full-text search. |
| What is Prisma? | ORM that maps TypeScript/JS objects to SQL. Generates type-safe query client from schema. |

---

## 14. Common Mistakes to Avoid

### Don't Do These

- ✗ Building all features at once — ship Phase by Phase
- ✗ Skipping error handling — every route needs try/catch
- ✗ Storing JWT in memory only — page refresh kills session
- ✗ Committing `.env` to GitHub — add it to `.gitignore` from day 1
- ✗ Not testing routes in Postman before building frontend
- ✗ Ignoring responsive design — recruiter will check on mobile
- ✗ No README — a project without documentation looks abandoned
- ✗ Not seeding demo data — live demo with empty database impresses no one

### Do These Instead

- ✓ Commit every feature with a meaningful commit message
- ✓ Write a `.env.example` file showing all required variables
- ✓ Test with Postman before connecting any frontend code
- ✓ Add database indexes on frequently queried columns (userId, email)
- ✓ Handle loading and error states in every React component
- ✓ Add input validation on both frontend AND backend
- ✓ Seed 3–4 demo profiles with real-looking data for your demo
- ✓ Record a short Loom demo video — attach to resume or LinkedIn

---

## 15. Realistic Timeline

| Week | Goal |
|---|---|
| Week 1 (Days 1–7) | Phase 0 (setup) + Phase 1 (auth). Working login/register by end of week. |
| Week 2 (Days 8–14) | Phase 2 (profiles + GitHub API) + Phase 3 (posts system). |
| Week 3 (Days 15–18) | Phase 4 (follow system + feed + search). |
| Week 4 (Days 19–23) | Phase 5 (polish + deploy). Live URL ready. Start applying. |
| Week 5+ | Start internship applications. Add likes/comments while applying. |

> Two hours a day of focused work is enough. Don't spend more time planning than building. Start with the simplest possible version of each feature, then improve it.

---

**You've got this.**

Start today. Ship Phase 1 this week. The internship follows the project.

---

## Phase 1 Completion Checklist

After completing Phase 1, you will have built a fully functioning, industry-standard authentication system. You will have successfully:

- Provisioned and connected a cloud PostgreSQL database
- Modeled data using Prisma
- Secured user passwords with bcryptjs
- Generated stateless session tokens with jsonwebtoken
- Built custom Express middleware to protect your private routes
