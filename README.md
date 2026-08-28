# 🌏 AI GO Community English Learning

> **English Learning Circle** — an AI-enhanced social learning environment for practical English practice, community interaction, and lifelong learning.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-English%20Learning%20Circle-orange?style=for-the-badge)](https://english-learning-circle.vercel.app/) [![GitHub](https://img.shields.io/badge/GitHub-Source%20Code-181717?style=for-the-badge&logo=github)](https://github.com/ALLENYEUNG365/AI-GO-Community-English-Learning) [![Demo Video](https://img.shields.io/badge/Demo%20Video-Google%20Drive-4285F4?style=for-the-badge&logo=google-drive)](https://drive.google.com/file/d/1RdD4iRmQR85VftlRqbCIK5RDnHvn5iI4/view?usp=sharing)

---

## ✨ Overview

**AI GO Community English Learning** is a community-oriented English learning platform built around one simple idea: language development becomes stronger when **practice, feedback, motivation, and social interaction** happen in the same learning ecosystem.

The project grows from the **English Learning Circle** concept and is designed for vocational education students, international learners, English teachers, and lifelong learners.

## 🚀 Try the Live Prototype

**Live website:** [english-learning-circle.vercel.app](https://english-learning-circle.vercel.app/)

Open the deployed prototype in a modern browser to explore the current experience.

> The live prototype is the current deployed product experience; this repository is the source and documentation hub.

---

## 🎯 The Problem

Language-learning tools often separate **content**, **practice**, **motivation**, and **community** into different experiences. AI GO Community English Learning proposes a connected model:

```text
LEARN
  ↓
PRACTICE
  ↓
GET AI / COMMUNITY FEEDBACK
  ↓
SHARE & REFLECT
  ↓
EARN PROGRESS / REINFORCEMENT
  ↓
RETURN TO LEARN
```
<img width="1536" height="1024" alt="image" src="https://github.com/user-attachments/assets/8916c7eb-9dea-40f0-a3a9-6c881ec2516a" />

The goal is not simply to add AI to a language app, but to create a **repeatable learning loop** that makes English practice more accessible, social, and sustainable.

---

## 🧠 Educational Logic

**Access → Practice → Feedback → Social Reinforcement → Continued Learning**

![Educational Logic](docs/education-logic.svg)

The model connects easy access, habit-building, structured learning, AI assistance, community reinforcement, and continued progress.

---

## 🏗️ Product / Technology Architecture
<img width="1536" height="1024" alt="image" src="https://github.com/user-attachments/assets/ef71da48-3a57-440b-abe5-06e20f43d5d7" />

The documented stack includes:

- **Framework:** Next.js 15.5.24
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL via Supabase
- **ORM:** Prisma 5.x
- **Authentication:** NextAuth.js / Google OAuth
- **File storage:** Cloudinary
- **Theme:** next-themes

---

## 🧩 Core Features

- ✅ Google OAuth Login
- ✅ Daily Check-in System
- ✅ Points & Rewards
- ✅ Share Text, Images, Videos
- ✅ AI Chat Assistant (current prototype experience)
- ✅ Learning Hub
- ✅ Dark / Light Theme
- ✅ Responsive Design

Advanced AI functions are presented separately as a roadmap rather than as completed features.

---

## 🔐 Security & Engineering Controls

The project has completed a focused security-hardening pass covering application code, dependency management, CI/CD, and repository governance.

### Application security

- Authenticated API routes reviewed for authorization boundaries.
- Daily check-in logic hardened against duplicate submissions and request tampering.
- File-upload controls reviewed for authentication, rate limiting, media type validation, size limits, and Cloudinary signing.
- Community-posting controls reviewed for validation and abuse resistance.
- Environment-variable usage audited to keep credentials out of source control.

### GitHub security

- **CodeQL:** enabled and verified with no open findings during the current security baseline review.
- **Secret Scanning:** enabled/checked with no open findings.
- **Dependabot:** enabled with dependency alerts verified.
- **CodeQL Action:** upgraded to v4.
- **Main branch ruleset:** active; changes to `main` require a pull request and successful required checks.
- **Required checks:** `build` and `Analyze`.
- **Repository protection:** force pushes and deletion of `main` are blocked.

### CI/CD security checks

The Security Build workflow validates:

```text
Install dependencies
        ↓
npm audit
        ↓
Prisma schema validation
        ↓
Production build
```

The repository also uses CodeQL analysis as a required security check for changes targeting `main`.

### Dependency update policy

Prisma dependencies are grouped in Dependabot so `prisma` and `@prisma/client` are updated together. This prevents incomplete Prisma major-version updates from being proposed independently and repeating the earlier build mismatch.

For the current production baseline, the project intentionally retains its stable Prisma 5.x version rather than forcing a Prisma 7 major upgrade that previously failed during `prisma generate`.

See [CHANGELOG.md](CHANGELOG.md) for the detailed 2026-08-28 security-hardening record and [SECURITY.md](SECURITY.md) for vulnerability reporting guidance.

---

## 🖼️ Product Preview

### Product concept / learning space

<img width="1280" height="719" alt="image" src="https://github.com/user-attachments/assets/e2a7130b-ba14-4b32-9488-fe6893dad954" />

### Home dashboard

<img width="2048" height="1039" alt="image" src="https://github.com/user-attachments/assets/6e03f3ea-c54f-4715-bf22-3c3bfcc69b77" />

### Daily Check-in / community engagement

<img width="1686" height="933" alt="image" src="https://github.com/user-attachments/assets/754f665f-e19b-4bb3-9e34-94c615aef68c" />

### Community-Based Learning / onboarding logic
<img width="1718" height="916" alt="image" src="https://github.com/user-attachments/assets/cd8f1bbc-8abb-46c7-89cd-d0b192599cce" />
<img width="1897" height="829" alt="image" src="https://github.com/user-attachments/assets/df9440cd-ffcb-47a4-92cd-b09d4b45cae9" />

### Learning Hub / progress tracking

<img width="1691" height="930" alt="image" src="https://github.com/user-attachments/assets/08e919d5-e826-4759-9592-57cc66e3b075" />

### AI English learning assistant

<img width="1708" height="921" alt="image" src="https://github.com/user-attachments/assets/ee276618-c854-4064-bf2c-127b8c4281b2" />

---

## 🎬 Demo Video

[▶ Watch the AI GO Community English Learning demo](https://drive.google.com/file/d/1RdD4iRmQR85VftlRqbCIK5RDnHvn5iI4/view)

Keep the Google Drive permission set to **Anyone with the link can view** so reviewers can access the video without signing in.

---

## 📚 Educational Use Cases

### Vocational Education
Support practical English communication for study, work, and career-oriented contexts.

### International Learners
Support learners preparing for academic, professional, and cross-cultural communication.

### Educators
Provide a community-oriented space for learning resources, participation, and future AI-assisted teaching support.

### Lifelong Learning
Encourage consistent, low-friction practice through habit-building and community reinforcement.

---

## 🤖 Responsible AI Roadmap

Future exploration includes:

- AI Grammar Correction and Writing Feedback
- AI Vocabulary Coach and Personalized Learning Paths
- AI Conversation Practice
- AI-generated Learning Exercises and Assessments
- AI-powered Learning Recommendations
- AI-assisted Teaching Resources for Educators
- Learning Analytics and Progress Tracking
- Multilingual Learning Support

---

## 🌱 Vision

> **Make English learning more accessible, social, personalized, and sustainable through responsible AI and community-driven learning.**

---

## 👤 Project Story

AI GO Community English Learning grows from the **English Learning Circle** concept: learning English is not only about completing lessons, but also about building confidence, practicing consistently, exchanging ideas, and learning with other people.

🔗 [English Learning Circle: AI-Powered Community English Learning for Vocational Education](https://www.linkedin.com/pulse/english-learning-circle-ai-powered-community-vocational-xinlin-yang-96imc/)

---

## 💻 Quick Start

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

---

## 📁 Repository Structure

```text
AI-GO-Community-English-Learning/
├── app/
├── components/
├── prisma/
├── docs/
│   ├── education-logic.svg
│   ├── learning-loop.svg
│   ├── architecture.svg
│   └── screenshots/
├── README.md
├── CHANGELOG.md
├── SECURITY.md
└── package.json
```

---

## 📄 License

MIT
