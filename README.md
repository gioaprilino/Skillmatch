# SkillMatch

SkillMatch is a full-stack workforce platform for Indonesian migrant workers and employers. It combines skills-based upskilling, verifiable credentials, job matching, migration guidance, and financial literacy in one application.

The app is built with Next.js, Prisma, PostgreSQL, and NextAuth, and is designed for real-world labor-market support for workers seeking overseas employment opportunities while staying informed, protected, and competitive.

## What the project does

SkillMatch helps workers and employers connect through a transparent, skill-first platform:

- Worker upskilling and assessment tracks across practical job skills, languages, digital literacy, and migration readiness
- Job matching based on skill level, salary expectations, location preferences, language requirements, certifications, and availability
- Verifiable credentials (W3C-style credential issuance and verification) for skills and certifications
- Migration checklist guidance for countries and work visa requirements
- Financial literacy and remittance planning support
- Employer tools for candidate review, job posting, and application management
- A responsive, installable PWA experience for mobile and desktop use

## Why it is useful

This project addresses several pain points in the migrant worker journey:

- It reduces information asymmetry between workers and employers
- It gives workers a clear path to prove skills with assessment results and credentials
- It supports safer migration decisions through structured checklists and legal/financial guidance
- It improves hiring transparency with explainable match scoring
- It creates a single platform for training, verification, hiring, and career support

## Core features

### Skills and assessments

- Skill catalog seeded for categories such as caregiving, construction, hospitality, manufacturing, language, financial literacy, and migration rights
- Assessment attempts with passing scores and result tracking
- Certification issuance based on verified outcomes

### Job matching

- Match scoring combines skill alignment, salary fit, location preference, language compatibility, certification bonus, and availability
- Results are explainable and returned as categories such as strong, good, potential, or low match

### Verifiable credentials

- Credential generation and verification logic for worker certifications
- QR/public verification flow for employers and agencies
- Integration points for DID and Ed25519-style cryptographic signing support

### Employer and dashboard workflows

- Job posting and candidate listing flows
- Application lifecycle tracking
- Worker verification workflows and dashboards
- Migration and finance dashboards for support tools

### PWA and product experience

- Service worker and installability support
- Offline-first front-end patterns
- Voice input and mobile-friendly UI components

## Tech stack

- Next.js 14 with App Router
- React 18 and TypeScript
- Tailwind CSS and Radix UI components
- Prisma ORM with PostgreSQL
- NextAuth.js for authentication
- PostgreSQL database via Prisma
- Vitest for unit tests and Playwright for E2E coverage
- IPFS and VC-related crypto libraries for certificate handling

## Repository structure

```text
.
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
├── public/
├── scripts/
├── src/
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   └── styles/
├── .env.example
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
├── README.md
└── README-backup.md
```

## Getting started

### Prerequisites

- Node.js 20+
- PostgreSQL database
- npm
- Optional: Redis / Upstash for future cache or queue features
- Optional: Google OAuth credentials and VC/IPFS secrets for full production functionality

### 1) Install dependencies

```bash
git clone https://github.com/gioaprilino/Skillmatch
cd Skillmatch
npm install
```

### 2) Configure environment variables

Copy the sample environment file and adjust the values:

```bash
cp .env.example .env
```

Then update the following values in `.env`:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/skillmatch?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-min-32-chars-change-in-production"
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-xxxxxxxxxxxxxxxxxxxxxxxx"
```

You can also configure the optional VC, OAuth, Redis, Pinata, and analytics variables defined in `.env.example`.

### 3) Prepare the database

```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

The seed script populates the skill catalog, demo users, and assessment data.

### 4) Start the app

```bash
npm run dev
```

Then open:

- http://localhost:3000

### Demo credentials

After seeding, the project includes demo accounts such as:

- `worker@skillmatch.id` / `password123`
- `employer@skillmatch.id` / `password123`
- `test@gmail.com` / `password123`

## Available scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run type-check
npm run db:push
npm run db:migrate
npm run db:studio
npm run db:seed
npm run test
npm run test:ui
npm run test:e2e
```

## Testing

Run the project checks locally:

```bash
npm run test
npm run type-check
npm run lint
```

This project uses Vitest for unit testing and Playwright for browser-level verification.

## Authentication and roles

The app supports multiple roles and entry points:

- `WORKER`
- `EMPLOYER`
- `ADMIN`
- `VERIFIER`

Authentication includes:

- Credentials login
- Google OAuth
- Custom session fallback handling

## Support and help

If you need help, start with the following:

- Review the app pages and API routes in `src/app/`
- Inspect the database model in `prisma/schema.prisma`
- Check the environment template in `.env.example`
- Use GitHub Issues for bug reports and feature discussions
- Use pull requests for code contributions

## Maintainers and contribution

This project is currently maintained through the repository itself. Contributions are welcome via pull requests and issue discussions.

For a contribution flow:

1. Fork or branch from the repository
2. Create a focused change
3. Run the relevant validation commands
4. Open a pull request with a clear summary

## Notes

This repository is actively shaped around a migrant-worker support use case and includes product features that are more ambitious than a basic starter app. The codebase is therefore best understood as a working prototype and a platform foundation rather than a minimal sample project.

## Summary

SkillMatch connects skills, credentials, jobs, and protection for migrant workers through a modern web platform. It aims to be practical, transparent, and useful for workers who need to improve their employability while staying secure and informed during migration and employment transitions.
