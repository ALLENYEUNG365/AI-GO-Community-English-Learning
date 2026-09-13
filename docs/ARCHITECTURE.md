# AI GO Community English Learning — Architecture Boundary

This repository is the canonical source for the **English Learning** product domain within the shared Adventure Academy ecosystem.

## Production ownership

```text
GitHub repository
ALLENYEUNG365/AI-GO-Community-English-Learning
        │
        ▼
Vercel
english-learning-circle.vercel.app
        │
        ▼
Supabase Free
ALLENYEUNG365's Project
```

- **GitHub:** canonical application source, Prisma schema, migrations, documentation and version history.
- **Vercel:** production web delivery for the English Learning application.
- **Supabase:** shared PostgreSQL/backend infrastructure.

## Shared Supabase rule

The English Learning application shares one Supabase project with Fruit Tank. This is intentional and is not a reason to reuse Fruit Tank business tables.

### English Learning-owned tables

- `users`
- `posts`
- `checkins`

The Prisma schema maps these models to the corresponding tables and uses `DATABASE_URL` for the PostgreSQL connection.

### Fruit Tank-owned tables

Fruit Tank owns its learning/game domain separately, including:

- `profiles`
- `classes`
- `class_memberships`
- `learning_sessions`
- `word_attempts`
- `word_progress`
- `learning_mastery`
- `daily_quests`

Do not introduce English Learning features into these tables unless the feature is explicitly designed as a shared platform capability.

## Security boundary

```text
User
 ↓
Application authentication / authorization
 ↓
Supabase Auth identity
 ↓
RLS / ownership validation
 ↓
English Learning tables
```

Server-side database credentials remain deployment secrets and are never committed to the repository.

The repository's `prisma/schema.prisma` is the source-level contract for the English Learning database models. Database changes must be represented in version-controlled migrations and validated before production deployment.

## Deployment boundary

```text
Feature change
    ↓
GitHub main
    ↓
Vercel production deployment
    ↓
English Learning application
    ↓
Shared Supabase project
```

Vercel deployment output is not a second source repository. If production behavior changes, the GitHub source must be updated first.

## Cross-product rule

The two products may share:

- Supabase Auth
- platform services such as Storage when intentionally shared
- infrastructure/security conventions
- monitoring/keepalive infrastructure

They should not casually share:

- business tables
- product-specific progress records
- game state
- classroom/game entities
- product-specific counters or scoring logic

**Principle:** one Supabase project, isolated business domains, one canonical GitHub repository per product, and Vercel as the production delivery layer.
