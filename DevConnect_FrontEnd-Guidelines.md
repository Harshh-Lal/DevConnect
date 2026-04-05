# DevConnect — Frontend Design & UX Guidelines
**Complete Frontend Specification · Visual Language · Page Architecture · User Flow**

> Built for: React 18 + Tailwind CSS + React Router v6
> Theme: Minimal · Modern · Developer-Native · Black & White

---

## Table of Contents

1. [Visual Identity & Aesthetic Direction](#1-visual-identity--aesthetic-direction)
2. [Design Tokens — Colors, Typography, Spacing](#2-design-tokens--colors-typography-spacing)
3. [Component System](#3-component-system)
4. [Page Architecture — All Pages](#4-page-architecture--all-pages)
5. [User Flow Diagrams](#5-user-flow-diagrams)
6. [Layout Rules & Spacing System](#6-layout-rules--spacing-system)
7. [Responsive Breakpoints](#7-responsive-breakpoints)
8. [Micro-interactions & Animations](#8-micro-interactions--animations)
9. [Landing Page — Full Breakdown](#9-landing-page--full-breakdown)
10. [Auth Pages — Login & Register](#10-auth-pages--login--register)
11. [Navigation Design](#11-navigation-design)
12. [What to Build First — Recommended Order](#12-what-to-build-first--recommended-order)

---

## 1. Visual Identity & Aesthetic Direction

### The Vibe
DevConnect is built for developers — people who live in terminals, dark editors, and clean interfaces. The aesthetic should feel like a refined dark-mode IDE met a modern SaaS product. Think Vercel's website, Linear's app, or GitHub's new UI: serious, confident, and visually precise — not playful or colorful.

### Core Aesthetic Principles

| Principle | What It Means in Practice |
|---|---|
| **Minimal but not empty** | Every element earns its space. No decorative noise. But sections breathe with generous padding. |
| **Monochromatic with precision** | Black, white, and controlled grays only. Zero color except one accent (a cold electric blue or stark white glow). |
| **Sharp edges, no rounding** | Prefer `rounded-none` or `rounded-sm`. Avoid soft pill shapes. Cards have sharp or 1px corners. |
| **Grid-aware layouts** | Everything snaps to an invisible grid. Alignment is never accidental. |
| **Contrast is the hero** | White on pitch black. Black text on pure white. No mid-gray text on mid-gray background. |
| **Code/terminal influences** | Monospace font for usernames, skills tags, and code-adjacent elements. |

### Dark Mode (Default)
- Background: near-black `#0a0a0a` (not pure black — avoids harsh contrast)
- Surface: `#111111` (cards, panels)
- Border: `#222222` (1px dividers, card outlines)
- Primary text: `#f0f0f0`
- Secondary text: `#888888`
- Accent: `#e8e8e8` (or a cold `#c8d8ff` — subtle, not electric)

### Light Mode (Reverse)
- Background: `#fafafa`
- Surface: `#ffffff`
- Border: `#e4e4e4`
- Primary text: `#0a0a0a`
- Secondary text: `#666666`
- Accent: same, but rendered with shadow/depth instead of glow

---

## 2. Design Tokens — Colors, Typography, Spacing

### Tailwind Config Additions (`tailwind.config.js`)

```js
theme: {
  extend: {
    colors: {
      background: '#0a0a0a',
      surface: '#111111',
      'surface-hover': '#181818',
      border: '#222222',
      'text-primary': '#f0f0f0',
      'text-secondary': '#888888',
      accent: '#e8e8e8',
      'accent-dim': '#555555',
    },
    fontFamily: {
      sans: ['Geist', 'DM Sans', 'sans-serif'],       // UI text
      mono: ['Geist Mono', 'JetBrains Mono', 'monospace'],  // usernames, tags, code
    },
    borderRadius: {
      DEFAULT: '4px',
      sm: '2px',
      md: '6px',
      full: '9999px',
    }
  }
}
```

### Typography Scale

| Use Case | Style |
|---|---|
| **Page Headline (H1)** | `text-5xl md:text-7xl font-bold tracking-tight` — tight letter spacing |
| **Section Heading (H2)** | `text-3xl font-semibold tracking-tight` |
| **Card Title (H3)** | `text-lg font-semibold` |
| **Body Text** | `text-sm text-text-secondary leading-relaxed` |
| **Username / Handle** | `font-mono text-sm text-accent` — always monospace |
| **Skill Tag** | `font-mono text-xs uppercase tracking-widest` |
| **Nav Links** | `text-sm font-medium text-text-secondary hover:text-text-primary` |
| **Button Label** | `text-sm font-semibold tracking-wide` |
| **Timestamp / Meta** | `text-xs text-accent-dim font-mono` |

### Recommended Fonts (Google Fonts or CDN)
- **Primary UI Font**: `DM Sans` — clean, slightly humanist, technical feel
- **Mono / Code Font**: `JetBrains Mono` — universally loved by devs, very readable
- **Alternative**: `Inter` is safe if you want maximum compatibility (but DM Sans is more distinctive)

```html
<!-- In index.html head -->
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

---

## 3. Component System

### Core UI Components to Build (Reusable)

#### `<Button />`
```
Variants:
- primary   → bg-white text-black hover:bg-gray-100 (dark mode)
- secondary → border border-border text-text-primary hover:bg-surface-hover
- ghost     → text-text-secondary hover:text-text-primary
- danger    → border border-red-800 text-red-400 hover:bg-red-900/20

Sizes: sm | md | lg
Always: font-semibold tracking-wide, transition-colors duration-150
```

#### `<Card />`
```
Base: bg-surface border border-border
Hover (when interactive): hover:border-accent-dim transition-colors
Padding: p-5 or p-6
No shadow — use borders as separation in dark mode
```

#### `<SkillTag />`
```
bg-surface border border-border
font-mono text-xs uppercase tracking-widest text-text-secondary
px-2 py-1
```

#### `<Avatar />`
```
Rounded: rounded-sm (square-ish, not circle — developer/minimal feel)
Sizes: w-8 h-8 | w-10 h-10 | w-16 h-16 | w-24 h-24
Fallback: initials on dark background, monospace font
```

#### `<Input />`
```
bg-transparent border border-border text-text-primary
focus:border-accent outline-none
placeholder:text-accent-dim
font-mono for username/handle fields, sans for rest
```

#### `<Divider />`
```
<hr className="border-border" />
Used generously to separate sections. 1px, full width.
```

#### `<Badge />`
```
For follower counts, like counts, comment counts
text-xs font-mono text-text-secondary
```

---

## 4. Page Architecture — All Pages

### Complete Page Inventory

```
PUBLIC PAGES (no auth required)
├── / ...................... Landing Page
├── /explore .............. Explore Developers (browse without login)
├── /login ................ Login
├── /register ............. Register
└── /@:username ........... Public Developer Profile

PROTECTED PAGES (auth required)
├── /feed ................. Home Feed (posts from followed devs)
├── /profile/edit ......... Edit Own Profile
├── /post/new ............. Create Project Post
├── /post/:id ............. Single Post Detail (with comments)
└── /settings ............. Account Settings (basic, Phase 5)

404 PAGE
└── /404 or * ............. Minimal 404, redirect home button
```

### Page-by-Page Purpose

| Page | Who Sees It | Core Purpose |
|---|---|---|
| Landing `/` | Everyone (pre-login) | Convert visitor to sign up. Show value prop. |
| Explore `/explore` | Anyone | Browse all developers and projects. Discovery. |
| Login `/login` | Logged-out users | Auth entry point. |
| Register `/register` | New users | Onboarding. Collect name, email, username, password. |
| Profile `/@username` | Anyone | Public portfolio of a developer. |
| Feed `/feed` | Logged-in users | Stream of posts from followed developers. |
| Edit Profile | Logged-in (own profile only) | Update bio, skills, avatar, GitHub. |
| New Post | Logged-in users | Create a project post with stack, links, description. |
| Post Detail | Anyone | Read a full post + comments + likes. |

---

## 5. User Flow Diagrams

### Flow 1 — New Visitor → Registered User → First Post

```
[Landing Page]
    ↓ clicks "Get Started" / "Sign Up"
[Register Page]
    → fill: name, email, username, password
    ↓ on success → auto-login → JWT stored
[Profile Setup Prompt] ← (inline redirect or modal after register)
    → add bio, location, GitHub username
    → select skills (multi-select tag picker)
    ↓
[Feed Page] ← first time: empty feed → show "Explore Developers" CTA
    ↓ user clicks "Post a Project"
[New Post Page]
    → title, description, tech stack tags, github url, live url
    ↓ on submit
[Back to Feed or Post Detail]
```

### Flow 2 — Returning User

```
[Landing Page] → already has JWT → redirect to /feed
    OR
[Login Page] → success → /feed
[Feed Page]
    ├── scroll & browse posts
    ├── click a post → [Post Detail]
    │       ├── like / unlike
    │       └── add comment
    ├── click a developer name → [Public Profile @username]
    │       └── follow / unfollow
    └── click Explore → [Explore Page]
            ├── filter by skill
            └── click dev → [Public Profile]
```

### Flow 3 — Viewing Someone's Profile

```
[@username Profile]
├── Top: Avatar, name, @handle, bio, location, skills
├── GitHub Repos section (cards)
├── Projects Posted (PostCards)
└── Follow button (if not own profile)
        ↓ follow
    [Follower count updates]
```

---

## 6. Layout Rules & Spacing System

### Page Container

```
max-w-screen-xl mx-auto px-4 md:px-8 lg:px-12
```

This gives a centered container that doesn't stretch absurdly wide on large screens.

### Grid Systems by Page Type

| Page | Layout |
|---|---|
| Landing | Full-width sections, hero centered, features in 3-col grid |
| Feed | 2-col: left sidebar (profile summary) + main feed column |
| Explore | 3-col responsive grid of developer cards |
| Profile | Single column, constrained width (max-w-3xl), content-focused |
| Post Detail | Single column, max-w-2xl, editorial feel |
| Auth (Login/Register) | Centered card, max-w-sm, full-height vertically centered |

### Spacing Scale (stick to these)

| Token | Value | Use |
|---|---|---|
| `gap-2` | 8px | Between tags, small elements |
| `gap-4` | 16px | Between cards in a row |
| `gap-6` | 24px | Section sub-elements |
| `gap-8` | 32px | Between major sections within a card |
| `py-16 md:py-24` | 64–96px | Between full-page sections (landing) |
| `p-5` or `p-6` | 20–24px | Card internal padding |

### Visual Hierarchy Rule
Every page must have **one dominant focal point** — the first thing your eye goes to:
- Landing: the headline text
- Feed: the first post card
- Profile: the developer's name + avatar
- Post Detail: the post title

Everything else is secondary. Never fight for attention.

---

## 7. Responsive Breakpoints

Using Tailwind's defaults:

| Breakpoint | Width | Layout Change |
|---|---|---|
| Base (mobile) | < 640px | Single column everything. Nav collapses to hamburger. |
| `sm` | 640px | Form cards slightly wider. |
| `md` | 768px | Feed shows sidebar. Explore becomes 2-col. |
| `lg` | 1024px | Explore becomes 3-col. Nav shows all links. |
| `xl` | 1280px | Max container kicks in. No layout change after this. |

### Mobile Priority Rules
- Stack everything vertically first
- Feed sidebar (`/feed`) collapses below the feed on mobile — put it at the top as a compact card
- Navigation becomes a bottom tab bar on mobile (iOS-style): Feed, Explore, Post (+), Profile
- Post cards are full-width on mobile
- Skill tags wrap naturally (flex-wrap)

---

## 8. Micro-interactions & Animations

Keep it restrained. No flashy entrance animations. The interactions should feel fast and native.

### Transitions (CSS only, via Tailwind)

```
- All buttons: transition-colors duration-150
- All links: transition-colors duration-100
- Cards (interactive): transition-all duration-200
- Input focus: transition-colors on border
- Avatar hover: opacity-90 transition-opacity
- Like button: scale-110 on click (brief), color change
- Follow button: text swap (Follow → Following) + border change
```

### Like Button Animation
```css
/* When liking: heart gives a brief scale pulse */
.like-btn:active { transform: scale(1.2); }
/* Transition the heart icon fill from empty to filled */
```

### Loading States
- Skeleton loaders: `bg-surface animate-pulse rounded-sm` for card placeholders
- Never use a spinning circle loader for page content — use skeletons
- Button loading: replace label with `...` or a tiny inline spinner (not full-screen)

### Page Transitions
- No fancy route transitions — keep it instant/snappy. Dev tools feel fast.
- Fade-in on content load is acceptable: `animate-fadeIn` with a 200ms opacity transition

---

## 9. Landing Page — Full Breakdown

> **Answer to your question: YES, build a landing page. Here's exactly what goes on it.**

The landing page serves one job: **convert a visitor into a sign-up**. It's also what you link on your resume — recruiters will see it. Make it count.

### Section 1 — Navbar
```
Left: DevConnect logo (text logo: "devconnect" in font-mono, with a small grid/dot icon)
Right (desktop): Features | Explore | Login | [Sign Up →] (primary button)
Right (mobile): hamburger menu
Background: bg-background/80 backdrop-blur border-b border-border
Position: sticky top-0 z-50
```

### Section 2 — Hero (Above the fold)

```
Layout: Full-width, vertically centered, ~100vh or min-h-[90vh]
Background: pure bg-background

Content (centered):
  ┌─────────────────────────────────────────────────┐
  │  [small badge/pill]                             │
  │  "Developer Portfolio × Community"              │
  │                                                 │
  │  The platform where developers                  │
  │  don't just list skills —                       │
  │  they prove them.          ← massive H1, bold   │
  │                                                 │
  │  [one-liner subtext, max 1 sentence]            │
  │  "Showcase projects. Follow developers.         │
  │   Get discovered."                              │
  │                                                 │
  │  [Get Started →]  [Explore Developers]          │
  │   (primary btn)    (ghost btn)                  │
  └─────────────────────────────────────────────────┘

Background detail: subtle grid pattern (CSS background-image with tiny dots)
```

**CSS Grid Background (hero):**
```css
background-image: radial-gradient(circle, #222 1px, transparent 1px);
background-size: 32px 32px;
```
This creates a developer/terminal-inspired dot grid — subtle, invisible unless you look for it.

### Section 3 — What is DevConnect? (3 feature columns)

```
Headline: "Built the way developers actually work"
Subtext: one sentence

3-column grid (1-col on mobile):
  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
  │  [icon]      │  │  [icon]      │  │  [icon]      │
  │  Projects    │  │  GitHub      │  │  Community   │
  │  that tell   │  │  Integration │  │  Feed        │
  │  a story     │  │              │  │              │
  │              │  │              │  │              │
  │  Body copy   │  │  Body copy   │  │  Body copy   │
  │  2–3 lines   │  │  2–3 lines   │  │  2–3 lines   │
  └──────────────┘  └──────────────┘  └──────────────┘

Icons: use Lucide icons (Code2, Github, Users) — monochrome, 24px
```

### Section 4 — "The Gap" (Comparison Table)

This section directly references your PRD's problem statement. Visually it can be a 3-column "versus" section or a simple table styled with the dark theme.

```
Headline: "GitHub shows your code. LinkedIn shows your job titles."
Sub: "DevConnect shows your story."

Visual: simple comparison
  GitHub  |  LinkedIn  |  DevConnect
  --------+------------+------------
  ✓ code  |  ✓ network |  ✓ both
  ✗ story |  ✗ technical depth | ✓ project narrative
  ...     |  ...       |  ...
```

### Section 5 — Social Proof / Dev Profiles Preview

Show 3 fake "developer cards" (your seed data) to give the page life:
```
3 cards in a row (or horizontal scroll on mobile)
Each card: Avatar | @handle | skills tags | X projects | X followers | [View Profile]
```
This is the most impactful section visually — it shows the actual product.

### Section 6 — CTA (Bottom)

```
Full-width dark section, centered:

  "Ready to build your developer identity?"

  [Create Your Profile →]   ← primary button, large

  Already have an account? Log in
```

### Section 7 — Footer

```
Minimal:
Left: devconnect · 2026
Right: GitHub (icon link) | Made by [Your Name]

border-t border-border
py-6 text-xs text-text-secondary
```

---

## 10. Auth Pages — Login & Register

> **You have auth backend done — build these next. Absolutely start here before the full app.**

### Why Auth First (Before Feed/Profile)

1. Auth is the gate to everything else — you can't test feed or profile without being logged in
2. Login/Register are the simplest pages visually — good for warming up React patterns
3. Once JWT flows end-to-end (React ↔ Express), the rest of the app unlocks fast
4. It gives you a working demo much faster than building landing + full app simultaneously

### Login Page Layout

```
Full screen: flex items-center justify-center min-h-screen bg-background

Card: max-w-sm w-full mx-auto p-8 bg-surface border border-border

Content:
  ┌─────────────────────────────┐
  │  devconnect  ← mono logo    │
  │                             │
  │  Welcome back               │ ← H2, tight
  │  Sign in to your account    │ ← body, text-secondary
  │                             │
  │  [Email input]              │
  │  [Password input]           │
  │                             │
  │  [Sign In →]  (full width)  │
  │                             │
  │  ─────────────────────────  │
  │  Don't have an account?     │
  │  Register →                 │
  └─────────────────────────────┘
```

### Register Page Layout

Same card layout, but fields:
```
Full Name input
Username input (font-mono, @ prefix visual)
Email input
Password input
Confirm Password input

[Create Account →]

Already registered? Log in
```

**Small detail that elevates it:** Show a live username preview below the username field:
```
your profile will be at: devconnect.app/@john_doe
```
Render this dynamically as they type. Looks polished, costs you 2 lines of code.

### Auth UX Rules
- Show/hide password toggle (eye icon via Lucide)
- Inline field-level error messages (below each input, `text-xs text-red-400`)
- Button shows loading state while API call is in flight
- On success: store JWT → redirect to `/feed`
- On error: show server error message inline (not an alert/toast initially)
- "Remember me" checkbox for localStorage persistence

---

## 11. Navigation Design

### Desktop Navbar (Logged Out)

```
bg-background/80 backdrop-blur-md
border-b border-border
sticky top-0 z-50

Left: logo "devconnect" (font-mono, text-sm)
Center: Explore  (nav link)
Right: Log In (ghost button)  |  Sign Up → (primary button, small)
```

### Desktop Navbar (Logged In)

```
Left: logo
Center: Feed  |  Explore  |  + Post (icon + text)
Right: [notification bell]  [avatar dropdown]
         └── View Profile
         └── Edit Profile
         └── Settings
         └── ──────────
         └── Log Out
```

### Mobile Navigation (Logged In)
Bottom tab bar — fixed at bottom of screen:
```
[House/Feed]  [Compass/Explore]  [+ Post]  [User/Profile]
```
This is standard mobile UX. Feels native.

---

## 12. What to Build First — Recommended Order

Given your auth backend is done, here is the exact recommended build order:

### Phase A — Auth Frontend (Start Here, This Week)
```
1. /login page → connect to POST /api/auth/login → store JWT → redirect /feed
2. /register page → connect to POST /api/auth/register → auto-login → redirect /feed
3. Protected route wrapper component (checks JWT, redirects to /login if missing)
4. Auth context/Zustand store (hold user object + token globally)
5. Navbar with conditional rendering (logged in vs out)
```

### Phase B — Landing Page (Build alongside Auth, or right after)
```
6. Landing page (mostly static HTML/JSX + Tailwind)
   → Hero, Features, Developer Cards preview, CTA sections
   → No API calls needed except maybe "explore" link
```

### Phase C — Profile & Feed
```
7. Public profile page (GET /api/users/:username)
8. Edit profile page (PUT /api/users/profile)
9. Feed page (GET /api/posts/feed) — post cards
10. Explore page (GET /api/posts/explore + /api/users/search)
```

### Phase D — Posts & Social
```
11. New Post form (POST /api/posts)
12. Post detail page (GET /api/posts/:id)
13. Like button (POST/DELETE /api/posts/:id/like)
14. Comments (POST /api/posts/:id/comments)
15. Follow button (POST/DELETE /api/users/:id/follow)
```

---

## Quick Reference — The Non-Negotiables

| Rule | Never Break This |
|---|---|
| Font | DM Sans for UI, JetBrains Mono for usernames/tags/code |
| Colors | Stay within the token palette. No random colors. |
| Borders | 1px, `#222` in dark mode. No shadows — use borders for depth. |
| Spacing | Multiples of 4px only (Tailwind's default scale) |
| Rounding | `rounded-sm` max. No pill shapes except badges. |
| Typography | Tight tracking on headings. Relaxed leading on body. |
| Loading | Skeleton loaders, not spinners, for content |
| Mobile | Test every page at 375px before calling it done |
| Errors | Inline, below the input, never alert() or popup |
| Accessibility | Every input has a label. Every image has alt text. |

---

*DevConnect Frontend Guidelines — v1.0*
*Designed for: React 18 · Tailwind CSS · DM Sans + JetBrains Mono*
*Aesthetic: Minimal · Dark-first · Developer-native*
