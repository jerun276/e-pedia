# E-Pedia — Agent Rules & Team Ownership Guide

> **⚠️ IMPORTANT: Every team member MUST update this file after pulling the repo.**
> Set your `CURRENT_ROLE` below to match your assigned role before using any AI agent.

---

## 🔧 How to Use This File

1. **Pull the repo** from Git
2. **Find your name** in the Team Members table below
3. **Update your role** in the `CURRENT_ROLE` section
4. **Your AI agent** (Antigravity, Copilot, Cursor, ChatGPT, etc.) should read this file to know which files you own

---

## 👤 CURRENT_ROLE

> **Change this to YOUR assigned role before starting work.**

```
ROLE = "ROLE_3"
MEMBER_NAME = "Jegajeevan"
```

### Role Options:
- `ROLE_1_PROBLEM_SOLUTION` — Problem & Solution Design
- `ROLE_2_UI_DEVELOPMENT` — UI Development
- `ROLE_3_FUNCTIONAL_IMPLEMENTATION` — Functional Implementation
- `ROLE_4_TESTING_DEPLOYMENT` — Testing, Git & Deployment

---

## 👥 Team Members & Roles

| Member | Student ID | Role | Owned Files/Directories |
|--------|-----------|------|------------------------|
| Member 1 | IT________ | `ROLE_1_PROBLEM_SOLUTION` | `src/pages/Home.jsx`, `src/pages/About.jsx`, `src/data/sampleData.js`, `README.md` |
| Member 2 | IT________ | `ROLE_2_UI_DEVELOPMENT` | `src/components/*`, `src/index.css`, `src/pages/Profile.jsx`, `public/*` |
| Jegajeevan | IT24102883 | `ROLE_3_FUNCTIONAL_IMPLEMENTATION` | `src/pages/Auth.jsx`, `src/pages/Explore.jsx`, `src/pages/TeachForm.jsx`, `src/firebase/*`, `src/App.jsx` |
| Member 4 | IT________ | `ROLE_4_TESTING_DEPLOYMENT` | `vite.config.js`, `package.json`, `vercel.json`, `.gitignore`, deployment configs |

> **Update the table above** with actual names and student IDs after pulling.

---

## 🚨 CRITICAL RULES FOR AI AGENTS

### Rule 1: File Ownership — DO NOT touch files you don't own
- **ONLY modify files listed under YOUR role** in the table above.
- If you need a change in another member's file, **leave a comment** or create a TODO, do NOT edit it directly.
- Shared files (`src/main.jsx`, `index.html`) should only be modified by **ROLE_4** or with team consensus.

### Rule 2: Do NOT delete or overwrite other members' work
- Before editing any file, check if it has been modified by someone else (check `git log` for the file).
- **Never** do a full file overwrite on a file you didn't create.
- Use **additive changes only** — add new functions, components, or styles without removing existing ones.

### Rule 3: Follow the project structure
```
e-pedia/
├── public/                     # Static assets (ROLE_2)
│   └── favicon.svg
├── src/
│   ├── components/             # Reusable UI components (ROLE_2)
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── SkillCard.jsx
│   │   └── SearchBar.jsx
│   ├── pages/                  # Page components
│   │   ├── Home.jsx            # (ROLE_1)
│   │   ├── Explore.jsx         # (ROLE_3)
│   │   ├── TeachForm.jsx       # (ROLE_3)
│   │   ├── About.jsx           # (ROLE_1)
│   │   └── Profile.jsx         # (ROLE_2)
│   ├── firebase/               # Firebase config (ROLE_3)
│   │   └── config.js
│   ├── data/                   # Sample data (ROLE_1)
│   │   └── sampleData.js
│   ├── App.jsx                 # Main app routing (ROLE_3)
│   ├── main.jsx                # Entry point (DO NOT TOUCH)
│   └── index.css               # Global styles (ROLE_2)
├── index.html                  # HTML entry (ROLE_4)
├── package.json                # Dependencies (ROLE_4)
├── vite.config.js              # Build config (ROLE_4)
├── vercel.json                 # Deployment config (ROLE_4)
├── README.md                   # Documentation (ROLE_1 drafts, ROLE_4 finalizes)
└── AGENTS.md                   # This file (everyone reads, update your role only)
```

### Rule 4: CSS naming conventions
- All CSS lives in `src/index.css` (owned by ROLE_2).
- If you need a new style, **add it at the end** of the file with a clear comment section header.
- Use the existing CSS variables (e.g., `var(--primary)`, `var(--bg-glass)`) — don't create new colors inline.
- Prefix custom class names with your page name: e.g., `.explore-filter`, `.teach-form-row`.

### Rule 5: Component import/export pattern
- Every component uses **default export**: `export default ComponentName`
- Import paths are relative: `import Navbar from '../components/Navbar'`
- Don't install new npm packages without informing ROLE_4.

### Rule 6: Git workflow
- **Commit frequently** with meaningful messages: `feat: add search filter on Explore page`
- **Pull before you push** — always `git pull` first to avoid merge conflicts.
- **Never force push** (`git push --force`) to the main branch.
- Branch naming (if using branches): `feature/your-name/description`

### Rule 7: Firebase rules
- Firebase config is in `src/firebase/config.js` (ROLE_3 manages this).
- Collection names: `mentors` (for mentor listings).
- Don't create new collections without team agreement.

---

## 📋 Task Breakdown by Role

### ROLE_1: Problem & Solution Design
- [ ] Write the problem description content in `Home.jsx` (hero, problem section, stats)
- [ ] Create the `About.jsx` page with detailed problem explanation and solution value
- [ ] Populate `sampleData.js` with realistic Sri Lankan mentors
- [ ] Draft the `README.md` content (problem, solution, features, team details)
- [ ] Write in-app text content and copy

### ROLE_2: UI Development
- [ ] Build/refine `Navbar.jsx` (responsive, hamburger menu)
- [ ] Build/refine `Footer.jsx`
- [ ] Build `SkillCard.jsx` (mentor card with avatar, badges, description)
- [ ] Build `SearchBar.jsx` component
- [ ] Build `Profile.jsx` page (mentor detail view)
- [ ] Polish `index.css` (responsive design, animations, glassmorphism)
- [ ] Ensure responsive design works on mobile & desktop

### ROLE_3: Functional Implementation
- [ ] Implement Authentication & Registration (Email/Password with Firebase Auth & session persistence)
- [ ] Implement Dual User Types (Learner & Teacher/Mentor) and Role Management
- [ ] Implement User Profile & Verification Credentials (Student ID, Lecturer ID, Teaching Level: Beginner/Intermediate/Expert)
- [ ] Set up Firebase in `config.js` (Auth & Firestore)
- [ ] Build `Explore.jsx` (search, filter, display mentors)
- [ ] Build `TeachForm.jsx` (registration form with full validation & Firestore persistence)
- [ ] Set up routing in `App.jsx`
- [ ] Implement data persistence (Firestore CRUD & offline fallback)
- [ ] Input validation with friendly error messages

### ROLE_4: Testing, Git & Deployment
- [ ] Initialize Git repo and push initial scaffold
- [ ] Set up Vercel deployment
- [ ] Test all pages and features across devices
- [ ] Fix bugs and edge cases
- [ ] Create `vercel.json` for SPA routing
- [ ] Finalize `README.md` with deployed link and video link
- [ ] Record the 2-minute demo video
- [ ] Prepare submission PDF

---

## 🎨 Design System Quick Reference

| Token | Value | Usage |
|-------|-------|-------|
| `--primary` | `#6C63FF` | Buttons, links, active states |
| `--secondary` | `#00D4AA` | Accents, mentor skill text, badges |
| `--bg-dark` | `#0a0a1a` | Page background |
| `--bg-glass` | `rgba(255,255,255,0.06)` | Card backgrounds (glassmorphism) |
| `--border-glass` | `rgba(255,255,255,0.1)` | Card borders |
| `--text-primary` | `#ffffff` | Headings, important text |
| `--text-secondary` | `#a0a0b8` | Body text, descriptions |
| `--error` | `#ff4757` | Validation errors |
| `--success` | `#2ed573` | Success states |

**Font:** Inter (loaded from Google Fonts)
**Border radius:** `--radius-sm: 8px`, `--radius-md: 12px`, `--radius-lg: 16px`

---

## 🔒 Files That Should NOT Be Modified
- `node_modules/` — auto-generated, in `.gitignore`
- `dist/` — build output, in `.gitignore`
- `.gitignore` — only ROLE_4 modifies
- `package-lock.json` — auto-generated by npm

---

> **Remember:** You MUST be able to explain ANY code in the project during the demo.
> The evaluator may ask you to make a live modification. Understand what your AI generates!
