# SkillMatch - Platform Upskilling & Lowongan Kerja untuk TKI

> **International Web Technology Competition (IWTC) 2026 Entry**
> Theme: "Innovating for a Sustainable Future: Empowering Communities through Web Technology"

## 🎯 Project Overview

SkillMatch adalah platform terintegrasi yang memberdayakan TKI (Tenaga Kerja Indonesia) dan PMI (Pekerja Migran Indonesia) melalui:

1. **Upskilling Berbasis Kompetensi** - Kurikulum terstruktur dengan asesmen praktik & sertifikasi resmi (BNSP/Kemenaker)
2. **Job Matching AI** - Algoritma pencocokan transparan berbasis skill, gaji, lokasi, bahasa, sertifikasi
3. **Verifiable Credentials (W3C VC)** - Sertifikat blockchain tamper-proof, verifiable instan via QR code
4. **Migration Checklist** - Panduan lengkap migrasi per negara: paspor, visa, medis, kontrak, asuransi, KBRI
5. **Financial Literacy** - Kalkulator remittance, simulasi investasi, target tabungan, edukasi anti-penipuan

## 🎯 SDGs Alignment

| SDG | Target | SkillMatch Contribution |
|-----|--------|------------------------|
| **8.5** | Decent work & equal pay | Job matching transparan, verifikasi skill objektif |
| **8.8** | Protect labor rights | Migration checklist, legal aid, contract review |
| **1.2** | Reduce poverty | Financial literacy, remittance optimization |
| **5.1** | Gender equality | Khusus PMI: perlindungan, kesehatan reproduksi |
| **10.7** | Safe migration | Checklist lengkap, embassy contacts, safe channels |
| **4.4** | Skills for employment | Upskilling terstruktur, sertifikasi nasional |

## 🚀 Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 14 (App Router) + React 18 + TypeScript |
| **Styling** | TailwindCSS + shadcn/ui (Radix UI) |
| **Database** | PostgreSQL (Supabase/Neon) + Prisma ORM |
| **Auth** | NextAuth.js v5 (Credentials, Google, WhatsApp OTP) |
| **Cache/Queue** | Redis (Upstash) |
| **VC/Crypto** | @digitalbazaar/vc, Ed25519, IPFS (Pinata) |
| **Matching** | Custom TypeScript Algorithm (Explainable) |
| **Deployment** | Vercel (Frontend + API) |
| **Monitoring** | Sentry + Vercel Analytics |
| **Testing** | Vitest (Unit) + Playwright (E2E) |
| **PWA** | Workbox (Offline-first, Installable) |

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT (PWA)                           │
│  Next.js 14 + React 18 + Tailwind + TypeScript             │
│  • Service Worker (Workbox) untuk Offline-First            │
│  • Web Speech API (Voice Input untuk low-literacy users)   │
│  • IndexedDB (Dexie.js) untuk cache offline                │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTPS / WebSocket
┌──────────────────────────▼──────────────────────────────────┐
│                   API GATEWAY (Next.js API Routes)          │
│  • NextAuth.js (Email, Google, WhatsApp OTP)               │
│  • Rate Limiting, Validation (Zod), Error Handling         │
└──────────────────────────┬──────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│  POSTGRESQL   │  │   REDIS       │  │   IPFS/       │
│  (Supabase)   │  │   (Upstash)   │  │   ARWEAVE     │
│               │  │               │  │   (VC Storage)│
│ • Users       │  │ • Session     │  │               │
│ • Skills      │  │ • Queue       │  │ • Verifiable  │
│ • Jobs        │  │ • Cache       │  │   Credentials │
│ • Assessments │  │ • Rate Limit  │  │ • Certificates│
│ • Companies   │  │ • Real-time   │  │ • Proofs      │
└───────────────┘  └───────────────┘  └───────────────┘
```

## 🔐 Verifiable Credentials (Innovation Highlight)

SkillMatch menerbitkan **W3C Verifiable Credentials** berbasis **Ed25519Signature2020**:

```typescript
// Contoh VC yang diterbitkan
{
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://w3id.org/security/suites/ed25519-2020/v1"
  ],
  "type": ["VerifiableCredential", "SkillCertificate"],
  "issuer": "did:web:skillmatch.id",
  "credentialSubject": {
    "id": "did:web:skillmatch.id:user:abc123",
    "skill": {
      "id": "CAREGIVING_ELDERLY",
      "name": "Perawatan Lansia",
      "level": "ADVANCED"
    },
    "assessment": { "score": 85, "passingScore": 70 },
    "evidence": [{ "type": "AssessmentResult", "answersHash": "sha256..." }]
  },
  "proof": { /* Ed25519 cryptographic proof */ }
}
```

**Keunggulan:**
- ✅ Tamper-proof (kriptografis)
- ✅ Verifiable offline (tidak butuh server pusat)
- ✅ Privacy-preserving (selective disclosure)
- ✅ Interoperable (standar W3C)
- ✅ Revocable (status check real-time)

## 🎯 Matching Algorithm (Transparent & Explainable)

```
Overall Score (100%) = 
  Skill Match (40%)      // Level + verified + certification bonus
+ Salary Match (20%)     // Overlap range USD-normalized
+ Location Match (15%)   // Preferred country match
+ Language Match (10%)   // Bahasa requirement match
+ Cert Bonus (10%)       // VC ownership for required skills
+ Availability (5%)      // Start date proximity
```

Output: `STRONG_MATCH` (≥85) | `GOOD_MATCH` (≥70) | `POTENTIAL_MATCH` (≥50) | `LOW_MATCH` (<50)

## 📦 Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL (local atau Supabase/Neon)
- Redis (local atau Upstash)
- Pinata account (IPFS)

### Installation

```bash
# Clone & install
git clone https://github.com/yourusername/skillmatch.git
cd skillmatch
npm install

# Environment setup
cp .env.example .env
# Edit .env dengan credentials Anda

# Database setup
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed

# Development
npm run dev
```

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/skillmatch"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-32-char-secret"

# Email (Resend)
EMAIL_SERVER_HOST="smtp.resend.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="resend"
EMAIL_SERVER_PASSWORD="re_xxx"
EMAIL_FROM="SkillMatch <noreply@skillmatch.id>"

# WhatsApp OTP (Twilio)
TWILIO_ACCOUNT_SID="ACxxx"
TWILIO_AUTH_TOKEN="xxx"
TWILIO_PHONE_NUMBER="+15551234567"

# Google OAuth
GOOGLE_CLIENT_ID="xxx.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-xxx"

# Redis (Upstash)
UPSTASH_REDIS_REST_URL="https://xxx.upstash.io"
UPSTASH_REDIS_REST_TOKEN="xxx"

# IPFS (Pinata)
PINATA_JWT="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
PINATA_GATEWAY="https://gateway.pinata.cloud/ipfs/"

# VC Keys (generate with: npx tsx scripts/generate-vc-keys.ts)
VC_ISSUER_DID="did:web:skillmatch.id"
VC_ISSUER_PRIVATE_KEY="base58-encoded-private-key"
VC_ISSUER_PUBLIC_KEY="base58-encoded-public-key"
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Type check
npm run type-check

# Lint
npm run lint
```

## 📱 PWA Features

- **Offline-first**: Service Worker cache static assets & API responses
- **Installable**: Add to home screen (Android/iOS)
- **Background Sync**: Queue assessments/applications when offline
- **Push Notifications**: Job matches, application updates, visa expiry

## ♿ Accessibility (WCAG 2.1 AA)

- Semantic HTML5
- ARIA labels & roles
- Keyboard navigation
- Screen reader support (NVDA, JAWS, VoiceOver)
- High contrast mode
- Voice input (Web Speech API) for low-literacy users
- Reduced motion support

## 🌍 Internationalization

- Bahasa Indonesia (default)
- English
- Arabic (RTL support ready)
- Malaysian
- Chinese (Simplified)
- Japanese
- Korean

## 📊 Project Structure

```
skillmatch/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed data (skills, assessments)
├── public/
│   ├── manifest.json          # PWA manifest
│   ├── sw.js                  # Service Worker
│   └── icons/                 # PWA icons
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── api/               # API Routes
│   │   ├── auth/              # Auth pages
│   │   ├── dashboard/         # Protected dashboard
│   │   └── page.tsx           # Landing page
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   ├── dashboard/         # Dashboard components
│   │   └── providers.tsx      # Theme, Toaster providers
│   ├── lib/
│   │   ├── prisma.ts          # Prisma client
│   │   ├── auth.ts            # NextAuth config
│   │   ├── matching.ts        # Matching algorithm
│   │   ├── vc.ts              # Verifiable Credentials
│   │   ├── ipfs.ts            # IPFS client
│   │   └── utils.ts           # Helper functions
│   ├── hooks/                 # Custom React hooks
│   ├── types/                 # TypeScript types
│   └── styles/                # Global styles
├── .github/workflows/         # CI/CD
└── tests/                     # Test files
```

## 🚀 Deployment

### Vercel (Recommended)

1. Connect GitHub repo to Vercel
2. Add environment variables
3. Deploy!

```bash
# Manual deploy
vercel --prod
```

### Docker

```dockerfile
# Dockerfile included in repo
docker build -t skillmatch .
docker run -p 3000:3000 skillmatch
```

## 📈 Roadmap (Post-Competition)

- [ ] Mobile App (React Native / Expo)
- [ ] AI Career Coach (LLM-powered)
- [ ] Employer API for HRIS integration
- [ ] Government portal integration (BNP2TKI, Kemenaker)
- [ ] Blockchain anchoring (Polygon/Arbitrum)
- [ ] Offline desktop app (Tauri)
- [ ] Multi-language voice assistant

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 👥 Team

- **Project Lead**: [Your Name]
- **Backend**: [Team Member]
- **Frontend**: [Team Member]
- **VC/Crypto**: [Team Member]
- **UI/UX**: [Team Member]
- **Advisor**: [Dosen Pembimbing]

## 📞 Contact

- **Email**: team@skillmatch.id
- **Website**: https://skillmatch.id
- **GitHub**: https://github.com/yourusername/skillmatch

---

**Built with ❤️ for IWTC 2026 - Empowering Indonesian Migrant Workers through Technology**