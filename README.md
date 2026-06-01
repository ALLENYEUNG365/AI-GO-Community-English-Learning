# English Learning Circle

An Open-Source AI-Enhanced English Learning Platform for Students, Educators, International Learners, and Lifelong Learners.
English Learning Circle is an open-source educational platform designed to make English learning more accessible, engaging, and personalized through social learning, gamification, and AI-assisted educational technologies.
The project combines social learning, gamification, and AI-powered educational tools to support:

- Vocational education students
- International learners
- English teachers
- Lifelong learners

Our mission is to make high-quality language learning accessible to everyone through technology and open-source collaboration. The platform aims to foster collaborative learning communities while exploring responsible and ethical applications of artificial intelligence in education.
## Educational Impact

English Learning Circle is designed to support a diverse global learning community through accessible and technology-enhanced language education.

### Target Communities

* Vocational education students seeking practical English communication skills
* International learners preparing for academic and professional opportunities
* English teachers looking for collaborative learning resources
* Lifelong learners pursuing continuous personal and professional development

### Educational Goals

* Improve access to quality English learning resources
* Encourage collaborative and community-driven learning
* Promote digital literacy and AI-assisted learning
* Support inclusive and lifelong education
* Explore responsible applications of artificial intelligence in education

## Features

- ✅ Google OAuth Login
- ✅ Daily Check-in System
- ✅ Points & Rewards
- ✅ Share Text, Images, Videos
- ✅ AI Chat Assistant
- ✅ Learning Hub
- ✅ Dark/Light Theme
- ✅ Responsive Design

## AI Roadmap

English Learning Circle is committed to exploring responsible and impactful applications of artificial intelligence in language education.

### Planned AI Features

* AI Grammar Correction and Writing Feedback
* AI Vocabulary Coach and Personalized Learning Paths
* AI Conversation Practice for English Learners
* AI-generated Learning Exercises and Assessments
* AI-powered Learning Recommendations
* AI-assisted Teaching Resources for Educators
* Learning Analytics and Progress Tracking
* Multilingual Learning Support

### Long-Term Vision

Our goal is to build an open and accessible AI-enhanced learning ecosystem that supports students, educators, and lifelong learners around the world.

## Quick Start

### 1. Installation

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```env
# Database
DATABASE_URL="your-supabase-database-url"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### 3. Setup Database

```bash
npx prisma generate
npx prisma migrate dev
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Documentation

See the `docs/` folder for detailed setup guides:

- `01-Google-OAuth-设置教程.md` - Google OAuth setup
- `02-Supabase-数据库设置教程.md` - Database setup
- `03-Cloudinary-设置教程.md` - File upload setup
- `04-使用教程.md` - User guide

## Tech Stack

- **Framework:** Next.js 14
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL (Supabase)
- **ORM:** Prisma
- **Authentication:** NextAuth.js
- **File Storage:** Cloudinary
- **Theme:** next-themes

## License

MIT
