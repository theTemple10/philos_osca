# OSS Contributor

An AI-powered assistant that helps developers contribute to open source projects. It analyzes your GitHub profile, identifies your strengths, finds matching contribution opportunities, and generates production-ready code with AI assistance.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Python](https://img.shields.io/badge/Python-3.11+-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

## Features

- **Smart Skill Analysis** - AI analyzes your GitHub repositories to build a comprehensive skill profile
- **Perfect Issue Matching** - Find open source issues that match your expertise level
- **AI Code Generation** - Generate production-ready code following project conventions
- **Full Contribution Workflow** - From discovery to pull request, all in one place
- **Adaptive Difficulty** - Works for beginners to advanced developers
- **Multi-Provider AI** - Choose between OpenAI or Anthropic

## Quick Start

### Prerequisites

- Node.js 18+
- Python 3.11+ (optional, for heavy AI tasks)
- PostgreSQL database
- GitHub OAuth App
- OpenAI or Anthropic API key

### 1. Clone & Install

```bash
git clone https://github.com/your-username/oss-contributor.git
cd oss-contributor
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/oss_contributor?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"
GITHUB_CLIENT_ID="your-client-id"
GITHUB_CLIENT_SECRET="your-client-secret"
OPENAI_API_KEY="sk-..."
ANTHROPIC_API_KEY="sk-ant-..."
```

### 3. Database Setup

```bash
npx prisma generate
npx prisma db push
```

### 4. Run Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript type checking
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
```

## Architecture

```
oss-contributor/
├── src/                          # Next.js application
│   ├── app/                      # App Router pages
│   │   ├── (auth)/               # Authentication pages
│   │   ├── (dashboard)/          # Dashboard pages
│   │   └── api/                  # API routes
│   ├── components/               # React components
│   │   ├── ui/                   # Base UI components
│   │   ├── dashboard/            # Dashboard components
│   │   └── contribution/         # Contribution components
│   └── lib/                      # Utilities
│       ├── ai/                   # AI provider abstraction
│       ├── auth/                 # Authentication
│       ├── db/                   # Database client
│       └── github/               # GitHub API integration
├── prisma/                       # Database schema
├── python/                       # Python microservice (optional)
│   ├── agents/                   # AI agents
│   ├── analyzers/                # Analysis engines
│   └── main.py                   # FastAPI app
└── tests/                        # Test files
```

## Tech Stack

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes, Prisma ORM
- **Database:** PostgreSQL
- **AI:** OpenAI GPT-4o, Anthropic Claude (via Vercel AI SDK)
- **Auth:** NextAuth.js with GitHub Provider
- **Python Service:** FastAPI for heavy AI/ML tasks (optional)
- **GitHub API:** Octokit for repository operations

## How It Works

1. **Connect GitHub** - Sign in with your GitHub account
2. **AI Analysis** - AI scans your repos to understand your skills
3. **Discover Projects** - Get personalized recommendations for open source projects
4. **Generate & Submit** - Select an issue, let AI generate a solution, review the code, and submit your pull request

## Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
