# 🎯 E-Pedia — Complete Feature Specification & Architecture

> **A Comprehensive Guide to E-Pedia's System Features, User Roles, AI Capabilities, and Admin Moderation Tools.**

---

## 📌 Executive Summary

**E-Pedia** is Sri Lanka's premiere peer-to-peer knowledge exchange and interactive learning platform. It empowers **Learners** to master new skills and **Teachers/Mentors** to share their expertise, supported by **Universal AI Assistants**, **PDF Quiz Generators**, **Direct Messaging**, and **Admin Moderation**.

---

## 👥 1. User Roles & Authentication System

### 1.1 Authentication & Registration
- **Email & Password Authentication**: Secure sign-up, login, and session persistence (Firebase Auth ready).
- **Dual User Types**:
  - 🎓 **Learner**: Accesses courses, quizzes, AI study tools, direct mentor messaging, and ratings.
  - 👨‍🏫 **Teacher / Mentor**: Publishes teaching profiles, sets availability, uploads PDFs for quiz generation, and mentors students.

### 1.2 User Profile & Verification Credentials
- **ID Verification Upload**:
  - **Students**: Upload / enter Student ID number and institution document.
  - **Lecturers / Teachers**: Upload / enter Lecturer ID, University/Institute ID, or professional license.
- **Teaching Level Specification**:
  - `Beginner` (Foundational concepts & school levels)
  - `Intermediate` (Diploma, O/L & A/L, skill building)
  - `Expert` (University, professional, advanced industry level)

---

## 🔍 2. Topic Search & Discovery Engine

- **Real-Time Keyword Search**: Search mentors, topics, headings, and subjects instantly.
- **Multi-Filter System**:
  - **Category Filter**: Technology, Academics, Traditional Crafts, Languages, Agriculture, Music, Business.
  - **District Filter**: All 25 districts of Sri Lanka (Colombo, Kandy, Galle, Jaffna, Kurunegala, etc.).
  - **Expertise Level Filter**: Beginner, Intermediate, Expert.
- **Teacher Cards & Profiles**: Displays avatar, verified badge, rating, hourly rate/free, location, and bio.

---

## 🤖 3. AI & Interactive Learning System

### 3.1 Universal AI Quiz & Learning Assistant
- **Any-Topic Quiz Generator**: Users enter any topic (e.g. *React Hooks*, *Organic Chemistry*, *Sri Lankan History*), and the AI automatically creates customized multiple-choice quizzes.
- **Instant AI Score & Analysis**: Evaluates student responses, calculates exact scores, and provides question explanations.
- **"Areas to Master" Gap Analysis**: Identifies weak subtopics and provides actionable study recommendations.

### 3.2 PDF & Document Quiz Generator (Teacher Feature)
- **PDF Upload**: Teachers upload course notes, syllabus documents, or slides.
- **Automated Quiz Extraction**: AI extracts key concepts and generates interactive quizzes directly from the uploaded PDF.

### 3.3 Chat-Based Learning Interface
- **Interactive Learning Chat**: Learners can study via an intuitive chat interface with the Universal AI or assigned Teachers.
- **Step-by-Step Explanation**: Explains complex topics interactively through guided Q&A turns.

---

## 💬 4. Communication & Feedback Tools

### 4.1 Direct Messaging (Student ↔ Teacher)
- **Two-Way Messaging**: Real-time or async direct messaging between enrolled Learners and Teachers.
- **Inquiry & Mentorship Requests**: Students can ask questions, arrange session times, or request customized guidance.

### 4.2 Feedback & Rating System
- **Student Reviews**: Enrolled learners leave 1–5 star ratings and detailed written feedback for teachers.
- **Teacher Reputation Score**: Aggregated rating displayed publicly on mentor profile cards.

### 4.3 Availability & Time Scheduling
- **Available Time Slots**: Teachers set their weekly available days and hours (e.g., *Weekdays 6 PM - 8 PM*, *Weekends 10 AM - 2 PM*).
- **Session Booking**: Students view available time slots on teacher profiles before messaging.

---

## 🎖️ 5. Recognition & Badges (Visual Credibility)

- **Verified ID Badge (`VERIFIED`)**: Awarded once Admin approves Student ID / Lecturer ID verification.
- **Top Educator Badge (`TOP MENTOR`)**: High-rated mentors with 4.8+ stars and 20+ students.
- **Master Learner Badge**: Awarded to learners who achieve 80%+ on 5+ AI Quizzes.

---

## 🛡️ 6. Admin Panel & Moderation Tools

### 6.1 User ID Verification Management
- **Verification Queue**: Admins inspect pending Student IDs and Lecturer IDs.
- **One-Click Approval / Rejection**: Granting approval automatically attaches the official **Verified Blue Badge** to the user profile.

### 6.2 Platform CRUD Operations
- **User Management**: Create, Read, Update, and Delete user accounts, teacher listings, and reviews.
- **Listing Approval**: Review and edit published teaching offerings.

### 6.3 Security & Content Moderation
- **Banned User Management**: Ban/Unban malicious accounts or spam bots.
- **Bad Message & Inappropriate Language Restrictions**: Automated keyword filter detecting profanity, hate speech, or inappropriate messages in chat and reviews.

---

## ⏱️ 7. 2-Hour Hackathon Implementation Roadmap

| Priority | Feature Module | Scope for 2-Hour Sprint |
|---|---|---|
| 🔥 **P0 (Critical)** | **Feature Spec Documentation (`FEATURES.md`)** | ✅ **Completed** |
| 🔥 **P0 (Critical)** | **Login & Role Selection Modal/Page** | Email/Pass form + Learner/Teacher role toggle + ID input field |
| 🔥 **P0 (Critical)** | **Universal AI Quiz & Gap Analysis** | ✅ **Completed** (`/quiz`) |
| ⚡ **P1 (High)** | **Admin Verification & Badge Toggle** | Admin tab to review pending IDs and click "Approve Badge" |
| ⚡ **P1 (High)** | **Simple Direct Messaging Modal** | Quick Chat drawer between Learner and Teacher profile |
| 💡 **P2 (Nice to Have)** | **Teacher PDF Upload Simulation** | Simulated document analyzer generating sample quiz |
| 💡 **P2 (Nice to Have)** | **Student Feedback Form** | Star rating input on mentor profile page |

---

*Document compiled for E-Pedia Hackathon Repository — Updated September 2026.*
