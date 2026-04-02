# DevConnect — Product Requirements Document
**Developer Networking & Portfolio Platform**

> A full-stack web application for developers to showcase projects, connect with peers, and build their professional identity.

| Field | Details |
|---|---|
| Document Version | v1.0 — Initial Release |
| Status | DRAFT |
| Project | DevConnect |
| Type | Portfolio Project |
| Author | SY Student — Web Developer |
| Date | April 2026 |
| Target Stack | React · Node.js · Express · PostgreSQL / MySQL · Prisma · JWT |
| Estimated Build | 4–5 Weeks |

---

## Table of Contents

1. [Executive Summary & Product Vision](#1-executive-summary--product-vision)
2. [Problem Statement](#2-problem-statement)
3. [Proposed Solution](#3-proposed-solution)
4. [Target Users](#4-target-users)
5. [Product Goals & Success Metrics](#5-product-goals--success-metrics)
6. [Scope — In Scope](#6-scope--what-is-being-built)
7. [Scope — Out of Scope](#7-scope--what-is-not-being-built-v10)
8. [Feature Specifications](#8-feature-specifications)
9. [System Architecture](#9-system-architecture)
10. [Tech Stack](#10-tech-stack)
11. [Core Data Models](#11-core-data-models)
12. [API Surface](#12-api-surface-high-level)
13. [Non-Functional Requirements](#13-non-functional-requirements)
14. [Assumptions & Constraints](#14-assumptions--constraints)
15. [Risks & Mitigations](#15-risks--mitigations)

---

## 1. Executive Summary & Product Vision

DevConnect is a full-stack developer networking web application that allows software developers to create professional profiles, publish their projects, integrate their GitHub repositories, and build a community by following other developers. It is positioned as a lightweight, developer-focused alternative to LinkedIn — purpose-built for the way developers actually work and communicate.

The application is designed and built as a portfolio project by an undergraduate web development student targeting a paid internship. It demonstrates end-to-end engineering capability: relational database design, REST API development, third-party API integration, JWT-based authentication, and modern React frontend patterns.

> **Product Vision Statement**
>
> *"DevConnect is the platform where developers do not just list skills — they prove them."*
>
> Instead of text-heavy resumes and disconnected GitHub profiles, DevConnect gives every developer a living portfolio: projects with context, a community of peers, and a professional identity that grows with their work.

---

## 2. Problem Statement

Developers entering the job market — particularly students and early-career professionals — face a fragmented and inadequate toolset for showcasing their work and building a professional presence online.

### The Core Problems

- **GitHub is a code repository, not a portfolio.** It shows commits and files, not the story behind a project — the problem solved, the decisions made, the stack used. Recruiters cannot easily interpret a GitHub profile.

- **LinkedIn is built for corporate professionals, not builders.** It lacks native support for showcasing code, tech stacks, live demos, or peer reviews from fellow developers. It is optimized for text-based experience, not project-based credibility.

- **No single platform connects developers peer-to-peer.** There is no dedicated space where a React developer can discover a Node.js developer working on a similar domain, follow their work, or collaborate — without the noise of general social media.

- **Students have no structured way to gain visibility.** A computer science student with genuinely strong projects has no better option than hoping a recruiter finds their GitHub, or manually maintaining a personal portfolio that nobody discovers.

### The Gap

| Platform | What It Offers | What It Lacks |
|---|---|---|
| GitHub | Code storage | No narrative, no story |
| LinkedIn | Professional network | No technical depth |
| Personal Portfolio | Custom showcase | Isolated, no discovery, hard to maintain |
| **DevConnect** | Developer-native social + project portfolio + GitHub integration | — |

---

## 3. Proposed Solution

DevConnect solves this by creating a dedicated, developer-first social platform that sits at the intersection of portfolio, community, and discovery.

### What the Platform Does

1. Gives every developer a structured public profile — skills, bio, location, and a project portfolio, all in one place.
2. Integrates with the GitHub API to automatically surface a developer's top repositories, reducing manual effort and pulling in real proof-of-work.
3. Allows developers to publish project posts — richer than a GitHub README, with a description, tech stack tags, live demo link, and screenshots.
4. Enables peer discovery through a follow system and a searchable developer directory filterable by skill.
5. Creates a personalized feed of project updates from developers the user follows — encouraging ongoing engagement rather than static profiles.
6. Builds a lightweight social layer (likes, comments) for community validation of work.

The result is a platform where a developer's profile grows automatically with their GitHub activity, their posted projects tell a story, and other developers can discover and follow their progress — all in a single, purpose-built web application.

---

## 4. Target Users

| User Type | Description | Primary Use Case |
|---|---|---|
| Student Developer | Engineering / CS undergrad, 1st–4th year. Building first or second real projects. Targeting first internship or job. | Create profile, post projects, get discovered by recruiters and peers. |
| Early Career Developer | 0–2 years of professional experience. Building a public presence while employed or freelancing. | Showcase professional + side projects, follow peers, grow network. |
| Self-Taught Developer | No formal degree. Strong project portfolio but limited traditional credentials. | Use project posts + GitHub integration as primary credential. |
| Hiring Recruiter (Secondary) | Technical recruiter or engineering manager looking to source developer talent. | Browse profiles, search by skill tag, evaluate project portfolios. |

---

## 5. Product Goals & Success Metrics

| Goal | Definition of Success |
|---|---|
| G1 — Core Platform Completeness | All Phase 1–4 features shipped and functional before internship applications begin. |
| G2 — Deployable & Live | Application deployed on Vercel (frontend) + Railway (backend). Live URL shareable on resume. |
| G3 — Credible Demo State | Minimum 3 seed developer profiles with realistic projects, skills, and GitHub data for demos. |
| G4 — Resume-Ready | Project can be explained confidently in a 60-second interview answer covering stack, architecture, and one technical challenge. |
| G5 — Code Quality | Codebase structured with clear folder separation, consistent naming, and basic error handling throughout. |

---

## 6. Scope — What Is Being Built

The following capabilities are in scope for the v1.0 release of DevConnect.

### Core Authentication
- User registration with email, username, and password
- Secure login and logout
- Password hashing using bcrypt
- JWT-based stateless authentication
- Protected routes on both frontend and backend
- 'Remember me' session persistence via token storage

### Developer Profiles
- Profile creation: full name, bio, location, avatar upload
- Skills/tech stack tags (multi-select)
- GitHub username field with auto-sync of top repositories
- Public profile URL: `devconnect.app/@username`
- Follower count and following count displayed on profile
- Edit profile functionality

### Project Posts
- Create project posts: title, description, tech stack tags, GitHub URL, live URL
- Posts displayed in a card grid on user's profile and on the feed
- Delete own posts
- Tech stack displayed as visual tags on each card

### Social & Discovery
- Follow and unfollow other developers
- Home feed: project posts from followed developers, reverse-chronological
- Explore page: all developers, browsable and searchable
- Search developers by skill tag
- Like and unlike project posts
- Comment on project posts / delete own comments

### GitHub Integration
- Fetch top 6 repositories from GitHub REST API (unauthenticated)
- Display repo name, description, primary language, and star count
- Manual re-sync button to refresh repos
- Graceful fallback if GitHub username is not set or rate limited

---

## 7. Scope — What Is NOT Being Built (v1.0)

The following are explicitly out of scope for the initial release. They may be considered for v2.0 post-internship.

| Feature | Reason for Exclusion |
|---|---|
| Real-time notifications (Socket.io) | Adds significant architecture complexity. Not essential for core value. |
| Direct messaging / chat | Requires persistent connection management. Scope risk. |
| OAuth / Social login (GitHub OAuth) | Nice-to-have but JWT + email is sufficient for v1. |
| Full-text search (Elasticsearch) | Overkill for v1 dataset scale. Prisma filter-based search is adequate. |
| Mobile app (React Native) | Web-first. Responsive design covers mobile browsers. |
| Email verification / password reset | Simplifies auth flow for v1. Can be added as enhancement. |
| Paid plans / subscriptions | Not relevant for a portfolio project. |
| Admin dashboard / moderation tools | No moderation layer needed at portfolio scale. |
| Video / image uploads for posts | Cloudinary integration limited to avatar only in v1. |
| AI-powered features | Out of scope for current skill level and timeline. |

---

## 8. Feature Specifications

Each feature is classified by priority: **P0** (launch blocker), **P1** (core experience), **P2** (enhances value).

### Authentication

| Feature | Priority | Description & Acceptance Criteria |
|---|---|---|
| User Registration | **P0** | User provides email, username (unique), and password. Password is hashed with bcrypt (min 10 rounds). JWT is returned on success. Duplicate email / username returns 400 with clear error. |
| User Login | **P0** | Validate credentials, return signed JWT (exp: 7d). Invalid credentials return 401. Token stored client-side (localStorage). |
| Auth Middleware | **P0** | Every protected route verifies JWT. Invalid / expired token returns 401. User is attached to `req.user` for downstream use. |
| Protected Frontend Routes | **P0** | Unauthenticated users accessing /feed, /profile/edit, etc. are redirected to /login. Implemented via ProtectedRoute wrapper component. |

### Profiles

| Feature | Priority | Description & Acceptance Criteria |
|---|---|---|
| Create Profile | **P0** | On first login, user is prompted to complete profile: display name, bio (max 280 chars), location, GitHub username, avatar upload. |
| View Public Profile | **P0** | Any visitor (logged in or not) can view `/profile/:username`. Shows avatar, bio, skills, GitHub repos, posted projects, follower count. |
| Edit Profile | **P1** | Logged-in user can update their own profile fields. Changes persist immediately. Avatar upload handled via Multer + Cloudinary. |
| Skills Tags | **P1** | User selects from predefined skill options (React, Node.js, Python, etc.) + free-text entry. Displayed as colour-coded chips on profile. |
| GitHub Repo Sync | **P1** | Fetches top 6 repos sorted by last updated. Displays: name, description, language, stars. Manual re-sync button available. Graceful empty state if no GitHub username. |

### Project Posts

| Feature | Priority | Description & Acceptance Criteria |
|---|---|---|
| Create Post | **P0** | Title (required), description (required, max 500 chars), tech stack tags (multi-select), GitHub URL (optional), live URL (optional). Post appears on user's profile and in followers' feeds. |
| View Post | **P1** | Single post view at `/posts/:id`. Full description, tech tags, links, author card, like count, and comment thread. |
| Delete Post | **P1** | Only the post author sees a delete option. Deletion cascades to associated likes and comments. |
| Post Card Component | **P1** | Reusable card showing: title, truncated description, author avatar + name, tech stack tags, like count, comment count, time ago. |

### Social Features

| Feature | Priority | Description & Acceptance Criteria |
|---|---|---|
| Follow / Unfollow | **P0** | Logged-in user can follow any other developer. Cannot follow self. Toggle follow/unfollow from profile. Follower and following counts update in real-time (optimistic UI). |
| Home Feed | **P0** | Authenticated users see posts from developers they follow, sorted newest first. Empty state: 'Follow some developers to get started.' |
| Explore Page | **P1** | Paginated grid of all developers. Each card: avatar, name, top 3 skills, follower count, Follow button. |
| Search by Skill | **P1** | Text input + skill chip filters on Explore page. Backend: `WHERE skills CONTAINS query`. Frontend: debounced input (300ms). |
| Like / Unlike Posts | **P1** | Logged-in users can like posts. One like per user per post (enforced by DB unique constraint). Like count displayed. Optimistic UI toggle. |
| Comments | **P2** | Add text comment to any post. Comments show author avatar, name, time ago. User can delete only their own comments. |

### UX & Interface

| Feature | Priority | Description & Acceptance Criteria |
|---|---|---|
| Responsive Design | **P1** | All pages function correctly on desktop (1280px+), tablet (768px), and mobile (375px). Tailwind breakpoints used throughout. |
| Loading States | **P1** | Every async operation shows a loading indicator or skeleton screen. No raw spinner without context. |
| Error States | **P1** | API errors display human-readable messages. Network failures do not cause blank screens. React error boundary at root. |
| Empty States | **P2** | Purpose-written empty state UI for: no feed posts, no profile projects, no search results, no followers. |
| Toast Notifications | **P2** | Brief success / error toasts for: post created, profile updated, follow action, login errors. |

---

## 9. System Architecture

DevConnect follows a standard client-server architecture with a decoupled frontend and backend communicating over HTTP REST. The two services are deployed independently.

```
[ Browser ] ←→ React SPA (Vite) hosted on Vercel
                         ↕ HTTP / REST / JSON
              Node.js + Express API hosted on Railway
                         ↕ Prisma ORM ↕
              PostgreSQL / MySQL on Railway
                         ↕
    GitHub REST API ←→ Express ←→ Cloudinary CDN
```

### Architecture Layers

| Layer | Responsibility |
|---|---|
| Presentation Layer | React SPA. Handles routing, UI rendering, client-side state (auth token, user object), and API calls via Axios. |
| API Layer | Express.js server. Receives HTTP requests, validates input, applies auth middleware, calls service/controller functions, returns JSON. |
| Service Layer | Controller functions that contain business logic — e.g. checking if a user already follows another before creating a Follow record. |
| Data Layer | Prisma ORM executing type-safe queries against PostgreSQL/MySQL. One PrismaClient instance per server process. |
| External Services | GitHub REST API (repo data), Cloudinary (avatar image CDN), Railway (infrastructure hosting). |

### Data Flow — Authenticated Request Example: Create a Post

1. User submits CreatePost form in React.
2. React calls `POST /api/posts` via Axios with JWT in Authorization header.
3. Express auth middleware decodes JWT → attaches `req.user`.
4. `postController.createPost` validates request body using `express-validator`.
5. On validation pass: `prisma.post.create({ data: { ...body, userId: req.user.id } })`.
6. Prisma executes INSERT SQL, returns new post object.
7. Controller responds 201 with created post JSON.
8. React updates local state, shows new PostCard in feed optimistically.

---

## 10. Tech Stack

| Layer | Technology | Justification |
|---|---|---|
| Frontend Framework | React 18 + Vite | Industry standard. Hooks-first. Vite is faster than CRA for development. |
| Routing | React Router v6 | Declarative client-side routing. Protected route pattern built in. |
| Styling | Tailwind CSS | Utility-first. Fast responsive layout without custom CSS files. |
| HTTP Client | Axios | Interceptors for JWT auto-attach. Cleaner than native fetch. |
| Form Management | React Hook Form | Lightweight form validation. Minimal re-renders. |
| Global State | Zustand / Context API | Auth state management. Zustand if complexity warrants it. |
| Backend Runtime | Node.js v20 LTS | JavaScript throughout the stack. Largest ecosystem. |
| Backend Framework | Express.js | Minimal, flexible. Industry-standard for REST APIs in Node. |
| ORM | Prisma | Type-safe queries. Schema-first. Auto-migration. Prisma Studio GUI. |
| Database | PostgreSQL or MySQL | Relational — required for follow graph, likes, comments. Both work with Prisma. |
| Authentication | JWT + bcrypt | Stateless auth. JWT for tokens. bcrypt for password hashing. |
| File Uploads | Multer + Cloudinary | Multer parses multipart. Cloudinary handles CDN delivery. |
| External API | GitHub REST API v3 | Public repos — no OAuth needed. Fetch top repos by username. |
| Frontend Deploy | Vercel | Zero-config React deploy. Auto CI/CD from GitHub. Free tier. |
| Backend Deploy | Railway | Node.js + Database in one platform. Generous free tier. |
| Version Control | Git + GitHub | Branch per phase. Conventional commits. PRD, README in repo. |

---

## 11. Core Data Models

All models are defined in `schema.prisma` and managed by Prisma Migrate.

| Model | Key Fields | Relationships |
|---|---|---|
| User | id, email (unique), username (unique), password, createdAt | Has one Profile. Has many Posts, Likes, Comments. Many-to-many with User via Follow. |
| Profile | id, userId (unique FK), bio, avatarUrl, location, githubUser | Belongs to User. Has many UserSkills. |
| Post | id, userId (FK), title, description, githubUrl, liveUrl, createdAt | Belongs to User. Has many Likes, Comments, PostSkills. |
| Follow | followerId (FK), followingId (FK), composite PK | Self-referencing: User follows User. Enforces no self-follow at service layer. |
| Like | userId (FK), postId (FK), composite PK | Unique constraint prevents duplicate likes. Belongs to User and Post. |
| Comment | id, userId (FK), postId (FK), content, createdAt | Belongs to User and Post. |
| Skill | id, name (unique), category | Many-to-many with User via UserSkill, with Post via PostSkill. |
| UserSkill | userId (FK), skillId (FK), composite PK | Junction: User ↔ Skill. |
| PostSkill | postId (FK), skillId (FK), composite PK | Junction: Post ↔ Skill. |

---

## 12. API Surface (High Level)

All API routes are prefixed `/api`. Protected routes require `Authorization: Bearer <token>` header. All responses are JSON.

| Method + Endpoint | Auth? | Description |
|---|---|---|
| POST /api/auth/register | No | Register new user. Returns JWT. |
| POST /api/auth/login | No | Validate credentials. Returns JWT. |
| GET /api/auth/me | Yes | Returns current logged-in user object. |
| GET /api/users/:username | No | Public developer profile + repos + posts. |
| PUT /api/users/profile | Yes | Update own profile fields. |
| GET /api/users/search?skills= | No | Search developers by skill tag. |
| POST /api/users/:id/follow | Yes | Follow a developer. |
| DELETE /api/users/:id/follow | Yes | Unfollow a developer. |
| GET /api/users/:id/followers | No | Get follower list. |
| GET /api/users/:id/following | No | Get following list. |
| GET /api/posts/feed | Yes | Posts from followed users, paginated. |
| GET /api/posts/explore | No | All posts, paginated. |
| POST /api/posts | Yes | Create a new project post. |
| GET /api/posts/:id | No | Single post with comments and likes. |
| DELETE /api/posts/:id | Yes | Delete own post (owner only). |
| POST /api/posts/:id/like | Yes | Like a post. |
| DELETE /api/posts/:id/like | Yes | Unlike a post. |
| POST /api/posts/:id/comments | Yes | Add a comment. |
| DELETE /api/posts/:id/comments/:cid | Yes | Delete own comment. |
| GET /api/github/:username/repos | No | Fetch top repos from GitHub API. |
| POST /api/github/sync | Yes | Re-sync logged-in user's GitHub repos. |
| POST /api/upload/avatar | Yes | Upload avatar image. Returns Cloudinary URL. |

---

## 13. Non-Functional Requirements

| Requirement | Target |
|---|---|
| Performance | API response time < 500ms for standard CRUD under normal load. Frontend initial load < 3s on broadband. |
| Security | Passwords never stored in plaintext. JWT secret stored in .env. CORS restricted to known frontend origin. Input validated server-side on all write endpoints. |
| Reliability | Application does not crash on unhandled promise rejection. Global error handler in Express. Error boundary in React. |
| Scalability | Not a primary concern for v1 (portfolio scale). DB queries should use indexed columns (userId, email) for future scaling. |
| Maintainability | ESLint + Prettier enforced. Meaningful commit messages. README with setup instructions. Separation of routes / controllers / services. |
| Accessibility | Semantic HTML. All images have alt text. Form labels present. Basic keyboard navigation functional. |
| Mobile Responsiveness | Fully functional UI on screen widths from 375px (iPhone SE) to 1920px (desktop). |
| Browser Support | Chrome, Firefox, Edge (latest 2 versions). Safari desktop. |

---

## 14. Assumptions & Constraints

### Assumptions

- Users have a valid email address and can create a GitHub account.
- GitHub public API rate limit (60 req/hr unauthenticated) is sufficient for demo and low-traffic use.
- Railway and Vercel free tiers remain available throughout development and demo period.
- Target users access the platform on modern browsers with JavaScript enabled.
- No GDPR / data privacy compliance requirements for v1 (student portfolio project).

### Constraints

- Build timeline: approximately 4–5 weeks of part-time development by a single developer.
- Budget: $0. All infrastructure must use free tiers (Railway, Vercel, Cloudinary free tier: 25GB storage).
- Developer is simultaneously in academic coursework — available hours are limited.
- No team — no parallel development, no code review, no QA process beyond manual testing.
- GitHub API: unauthenticated calls limited to 60/hr. No GitHub OAuth in scope, so a personal access token may be used server-side as a workaround.

---

## 15. Risks & Mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| Scope creep — adding features mid-build | High | Strictly follow phase order. New ideas go to a 'v2 backlog' list, not the current sprint. |
| Underestimating database schema complexity | Medium | Design full schema before writing any route. Run migrations early, not after building routes. |
| Deployment issues eating time | Medium | Deploy backend to Railway at end of Phase 1 (not Phase 5). Catch env issues early. |
| GitHub API rate limiting during demos | Low | Cache last fetched repos in the DB. Only re-fetch on explicit sync button press. |
| JWT token management issues (logout, expiry) | Medium | Store token in localStorage. Clear on logout. Handle 401 responses with Axios interceptor redirect. |
| Time runs out before polish phase | Medium | P0 features are the non-negotiables. P2 features are cut first if timeline tightens. |
| Prisma migration conflicts | Low | Never manually edit migration files. Always use `prisma migrate dev`. Commit schema changes separately. |

---

*DevConnect PRD — v1.0*

*This document is a living specification. Update it as scope is confirmed or adjusted during development.*
