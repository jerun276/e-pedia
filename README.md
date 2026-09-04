# 🎓 E-Pedia — Sri Lanka's Knowledge Exchange Platform

> **Bridging the education access gap in Sri Lanka by connecting skilled mentors with eager learners.**

![E-Pedia](https://img.shields.io/badge/E--Pedia-Built%20for%20Sri%20Lanka%20🇱🇰-6C63FF?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite)
![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?style=flat-square&logo=firebase)

---

## 📌 The Problem

Sri Lanka has a wealth of skilled individuals — artisans, teachers, farmers, tech professionals — but **no centralized platform** to connect those who have knowledge with those who want to learn.

- **46%** of rural youth lack access to skill development programs
- **72%** of small-scale artisans have no digital presence
- **3.2 million** youth aged 15–29 are seeking vocational skills
- Traditional skills and cultural knowledge are being lost to time

The **education access gap** disproportionately affects rural communities, where mentors and learning opportunities are scarce.

## 💡 Our Solution

**E-Pedia** is a web-based skill-sharing platform where:

- **Skilled Sri Lankans** can register as mentors, listing their expertise, location, and availability
- **Learners** can browse, search, and filter mentors by skill category, district, and experience level
- **Communities** benefit from preserved traditional knowledge and accessible modern skills

## ✨ Main Features

1. **🏠 Landing Page** — Hero section with animated stats, problem statement, and clear CTAs
2. **🔍 Explore Mentors** — Search and filter 18+ mentors by category, district, and experience level
3. **📝 Mentor Registration** — Complete form with real-time validation and 9 input fields
4. **👤 Mentor Profiles** — Detailed view with ratings, student count, and contact info
5. **ℹ️ About Page** — Detailed problem explanation and impact demonstration
6. **📱 Responsive Design** — Works seamlessly on desktop, tablet, and mobile
7. **🎨 Premium Dark UI** — Glassmorphism design with smooth animations

## 🛠️ Technologies Used

| Technology             | Purpose                            |
| ---------------------- | ---------------------------------- |
| **React 18**           | Frontend UI framework              |
| **Vite 5**             | Build tool & dev server            |
| **React Router v6**    | Client-side routing (SPA)          |
| **Firebase Firestore** | Cloud database for mentor data     |
| **Lucide React**       | Modern icon library                |
| **Vanilla CSS**        | Custom glassmorphism design system |
| **Vercel**             | Deployment & hosting               |

## 🤖 AI Tools Used

<!-- UPDATE THIS SECTION with your actual AI usage -->

| Tool                            | Usage                                                                                                                                                   |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Google Antigravity (Gemini)** | Generated initial project scaffold, component structure, CSS design system, and sample data. All code reviewed, tested, and understood by team members. |
| _Add more tools here_           | _Description of usage_                                                                                                                                  |

## 👥 Team Members & Contributions

<!-- UPDATE THIS SECTION with actual names, IDs, and contributions -->

| Name     | Student ID | Role                      | Contributions                                                                |
| -------- | ---------- | ------------------------- | ---------------------------------------------------------------------------- |
| Member 1 | IT24100079 | Problem & Solution Design | Home page content, About page, sample data, README                           |
| Member 2 | IT24100181 | UI Development            | Components (Navbar, Footer, SkillCard), CSS, Profile page, responsive design |
| Member 3 | IT24102883 | Functional Implementation | Explore page, TeachForm, Firebase integration, routing, validation           |
| Member 4 | IT24103667 | Testing, Git & Deployment | Git management, Vercel deployment, testing, bug fixes, demo video            |

## 🚀 Installation & Execution

### Prerequisites

- Node.js 18+ installed
- npm 9+ installed

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/e-pedia.git

# 2. Navigate to the project
cd e-pedia

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev

# 5. Open in browser
# Visit http://localhost:5173
```

### Build for Production

```bash
npm run build
npm run preview
```

## 🌐 Deployed Application

<!-- UPDATE with your actual deployed link -->

🔗 **Live App:** [https://e-pedia.vercel.app](https://e-pedia.vercel.app)

## 🎬 Demonstration Video

<!-- UPDATE with your actual video link -->

🎥 **Demo Video:** [OneDrive Link](https://your-onedrive-link-here)

## 📁 Project Structure

```
e-pedia/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Navbar.jsx       # Responsive navigation
│   │   ├── Footer.jsx       # Footer with links
│   │   └── SkillCard.jsx    # Mentor card component
│   ├── pages/               # Page components
│   │   ├── Home.jsx         # Landing page
│   │   ├── Explore.jsx      # Search & filter mentors
│   │   ├── TeachForm.jsx    # Mentor registration form
│   │   ├── About.jsx        # Problem & solution
│   │   └── Profile.jsx      # Mentor profile view
│   ├── firebase/
│   │   └── config.js        # Firebase setup
│   ├── data/
│   │   └── sampleData.js    # Sample mentor data
│   ├── App.jsx              # Main app with routing
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── index.html
├── package.json
├── vite.config.js
├── vercel.json              # SPA routing config
├── AGENTS.md                # AI agent rules for team
└── README.md                # This file
```

## 📋 AI Declaration

<!-- UPDATE THIS with your actual declaration -->

**AI tools were used in this project.** Specifically:

- **Google Antigravity (Gemini)** — Generated the initial React component scaffold, CSS design system, and sample data. All generated code was reviewed, tested, modified, and is fully understood by all team members.

_Every team member can explain any section of the codebase and can make live modifications as requested._

---

> Built with ❤️ for Sri Lanka | SE3090 Mini Hackathon 2026
