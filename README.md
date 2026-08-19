# 🚀 OSS Contributor

An AI-powered assistant that helps developers contribute to open source projects. It analyzes your GitHub profile, identifies your strengths, finds matching contribution opportunities, and generates production-ready code with AI assistance.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Python](https://img.shields.io/badge/Python-3.11+-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Features

- **🧠 Smart Skill Analysis** - AI analyzes your GitHub repositories to build a comprehensive skill profile
- **🎯 Perfect Issue Matching** - Find open source issues that match your expertise level
- **💻 AI Code Generation** - Generate production-ready code following project conventions
- **🔄 Full Contribution Workflow** - From discovery to pull request, all in one place
- **👥 Adaptive Difficulty** - Works for beginners to advanced developers
- **🔒 Multi-Provider AI** - Choose between OpenAI, Anthropic, or custom providers

## 🏗️ Architecture

```
oss-contributor/
├── src/                          # Next.js application
│   ├── app/                      # App Router pages
│   │   ├── (auth)/               # Authentication pages
│   │   ├── (dashboard)/          # Dashboard pages
│   │   └── api/                  # API routes
│   ├── components/               # React components
│   ├── lib/                      # Utilities
│   │   ├── ai/                   # AI provider abstraction
│   │   ├── auth/                 # Authentication
│   │   ├── db/                   # Database client
│   │   └── github/               # GitHub API integration
│   └── ...
├── prisma/                       # Database schema
├── python/                       # Python microservice
│   ├── agents/                   # AI agents
│   ├── analyzers/                # Analysis engines
│   └── main.py                   # FastAPI app
└── ...
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Python 3.11+
- PostgreSQL database
- GitHub OAuth App
- OpenAI or Anthropic API key

### 1. Clone & Install

```bash
git clone https://github.com/your-username/oss-contributor.git
cd oss-contributor

# Install Next.js dependencies
npm install

# Install Python dependencies
cd python
pip install -r requirements.txt
cd ..
```

### 2. Environment Setup

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/oss_contributor"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"

# GitHub OAuth (create at https://github.com/settings/developers)
GITHUB_CLIENT_ID="your-client-id"
GITHUB_CLIENT_SECRET="your-client-secret"

# AI Provider (at least one)
OPENAI_API_KEY="sk-..."
ANTHROPIC_API_KEY="sk-ant-..."
```

### 3. Database Setup

```bash
npx prisma generate
npx prisma db push
```

### 4. Run Development Servers

```bash
# Terminal 1: Next.js
npm run dev

# Terminal 2: Python service
cd python
python main.py
```

Open [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### GitHub OAuth Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in:
   - Application name: `OSS Contributor`
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Copy Client ID and Client Secret to `.env`

### AI Provider Setup

**OpenAI:**
1. Go to [OpenAI API](https://platform.openai.com/api-keys)
2. Create an API key
3. Add to `.env` as `OPENAI_API_KEY`

**Anthropic:**
1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Create an API key
3. Add to `.env` as `ANTHROPIC_API_KEY`

## 📖 How It Works

### 1. Connect GitHub
Sign in with your GitHub account. We only request access to your public profile and repositories.

### 2. AI Analysis
Our AI scans your repositories to understand:
- Programming languages and proficiency
- Frameworks and libraries
- Code patterns and conventions
- Strengths and areas for improvement

### 3. Discover Projects
Get personalized recommendations for open source projects that match your:
- Technical skills
- Experience level
- Interests and learning goals

### 4. Generate & Submit
Select an issue, let AI generate a solution, review the code, and submit your pull request — all with your oversight.

## 🛠️ Tech Stack

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes, Prisma ORM
- **Database:** PostgreSQL
- **AI:** OpenAI GPT-4o, Anthropic Claude (via Vercel AI SDK)
- **Auth:** NextAuth.js with GitHub Provider
- **Python Service:** FastAPI for heavy AI/ML tasks
- **GitHub API:** Octokit for repository operations

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
# Fork and clone
git clone https://github.com/your-username/oss-contributor.git
cd oss-contributor

# Create a branch
git checkout -b feature/amazing-feature

# Make changes and test
npm run dev

# Commit and push
git commit -m "feat: amazing feature"
git push origin feature/amazing-feature

# Open a Pull Request
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [OpenAI](https://openai.com/) - AI Models
- [GitHub](https://github.com/) - Developer Platform
- All open source contributors who inspire this project

---

Built with ❤️ for the open source community
