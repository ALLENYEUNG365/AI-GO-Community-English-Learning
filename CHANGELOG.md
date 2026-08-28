# Changelog

All notable project updates are documented here.

## 2026-08-28 — Security Hardening & Repository Protection

### Security hardening
- Strengthened authenticated API access and reviewed authorization boundaries for core API routes.
- Hardened the daily check-in flow against duplicate submissions and request tampering.
- Added/verified rate limiting and validation controls around file uploads and community posting.
- Reviewed Cloudinary upload signing, media type handling, upload size controls, and upload endpoint protection.
- Audited environment-variable usage and repository security configuration.
- Kept public-facing authentication on Google OAuth / NextAuth while preserving the platform's open-community direction.

### GitHub security
- Enabled Dependabot alerts and verified the dependency security state.
- Verified GitHub Secret Scanning status with no open findings.
- Verified CodeQL with no open findings and upgraded the CodeQL Action workflow from v3 to v4.
- Added required CI checks for the default branch: `build` and `Analyze`.
- Added an active `main` branch ruleset requiring pull requests and successful required checks.
- Blocked force pushes and branch deletion for `main`.

### CI/CD and dependency management
- Maintained a dedicated Security Build workflow covering dependency installation, `npm audit`, Prisma schema validation, and the production build.
- Resolved the Prisma dependency-update mismatch that caused the earlier Dependabot build failure.
- Added Dependabot grouping so `prisma` and `@prisma/client` are proposed together for both version and security updates.
- Verified the updated dependency-management configuration through GitHub checks.

### Production verification
- Re-verified the production deployment after the security and repository changes.
- Confirmed the current deployed application remains functional, including Google sign-in and daily check-in behavior.
- After documentation was merged through PR #14, re-ran the main-branch security validation: CodeQL and Security Build both passed, and the Vercel deployment completed successfully.

### Documentation
- Added this changelog and expanded the README with Security & Engineering Controls and an explicit distinction between current prototype functionality and the future roadmap.
- Corrected the README framework version to the current project version (Next.js 15.5.24).
- PR #14 (`docs: document security hardening and project updates`) was merged into `main` after the required checks passed.

### Engineering decision
- The Prisma 7 Dependabot upgrade that failed during `prisma generate` was not merged into `main`.
- Instead, dependency-update grouping was added to prevent future mismatched Prisma updates from being proposed as incomplete upgrade pairs.

## Roadmap

The current product roadmap continues to prioritize:

1. Real database-backed points, streaks, achievements, and profile data.
2. A real AI English Tutor with correction, explanation, better versions, and vocabulary support.
3. Community interactions including Like, Comment, Report, post deletion, and moderation.
4. A functional learning loop covering lessons, exercises, submission, scoring, points, streaks, and achievements.
