# Vibe 🎨✨

> AI-Powered Full-Stack App Builder - Generate Production-Ready Applications from Simple Prompts

Vibe is an intelligent application builder that transforms natural language prompts into fully functional, production-ready web applications. Simply describe what you want to build, and Vibe's AI agents will generate complete applications with working code, styling, and functionality - all running in secure cloud sandboxes.

![Vibe Demo](./demo.gif) <!-- Add your demo gif here -->

## 🌟 Features

- **🤖 AI-Powered Code Generation**: Autonomous AI agents that write, test, and iterate on code
- **⚡ Real-Time Preview**: See your generated applications running live in secure sandboxes
- **💬 Conversational Development**: Chat with AI to refine and improve your applications
- **🔄 Agent Memory**: AI remembers your conversation context for intelligent iterations
- **📁 File Explorer**: Browse and edit generated code with syntax highlighting
- **🎨 Modern UI**: Beautiful, responsive interface with dark mode support
- **🔐 Authentication & Billing**: Built-in user management and credit-based usage system
- **📊 Project Management**: Organize multiple projects with auto-generated names
- **🚀 One-Click Templates**: Quick-start templates for common application types
- **☁️ Cloud Sandboxes**: Secure, isolated environments for running generated code

## 🛠️ Technology Stack

### Frontend
- **[Next.js 15.3.4](https://nextjs.org/)** - React framework with App Router and Server Components
- **[React 19](https://react.dev/)** - UI library with latest features
- **[Tailwind CSS v4](https://tailwindcss.com/)** - Utility-first styling
- **[Shadcn UI 2.7.0](https://ui.shadcn.com/)** - Beautiful, accessible component library
- **[Tanstack Query](https://tanstack.com/query)** - Powerful data fetching and caching

### Backend
- **[tRPC v11.4.2](https://trpc.io/)** - End-to-end type-safe APIs
- **[Prisma 6.10.1](https://www.prisma.io/)** - Next-generation ORM
- **[PostgreSQL](https://www.postgresql.org/)** - Robust relational database via [Neon](https://neon.tech/)
- **[SuperJSON](https://github.com/blitz-js/superjson)** - JSON serialization for complex data types

### AI & Automation
- **[Ingest](https://www.ingest.ai/)** - Background jobs and AI agent orchestration
- **[E2B](https://e2b.dev/)** - Secure cloud code execution sandboxes
- **[OpenAI](https://openai.com/)** - GPT models for code generation
- **[Anthropic Claude](https://www.anthropic.com/)** - Advanced reasoning and coding
- **[Grok](https://grok.x.ai/)** - Alternative AI model support

### Infrastructure
- **[Clerk](https://clerk.com/)** - Authentication and billing management
- **[Docker](https://www.docker.com/)** - Containerization for sandbox templates
- **[Vercel](https://vercel.com/)** - Deployment platform
- **[Code Rabbit](https://coderabbit.ai/)** - AI-powered code reviews

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **npm** / **yarn** / **pnpm** / **bun**
- **PostgreSQL** database (Neon recommended)
- **API Keys** for:
  - Clerk (authentication)
  - OpenAI / Anthropic / Grok (AI models)
  - E2B (code sandboxes)
  - Ingest (background jobs)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/shafi-rehaman/vibe.git
cd vibe
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:
```env
# Database
DATABASE_URL="postgresql://user:password@host/database"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# AI Models
OPENAI_API_KEY=sk-xxx
ANTHROPIC_API_KEY=sk-ant-xxx
GROK_API_KEY=xxx

# E2B Sandboxes
E2B_API_KEY=xxx

# Ingest
INGEST_API_KEY=xxx
INGEST_SIGNING_SECRET=xxx
```

4. **Set up the database**
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed initial data (optional)
npx prisma db seed
```

5. **Run the development server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

6. **Open [http://localhost:3000](http://localhost:3000)** in your browser

## 💡 Usage

### Creating Your First Project

1. **Sign up / Sign in** using Clerk authentication
2. **Choose a template** or start from scratch
3. **Enter a prompt** describing your application:
   - *"Build a Netflix-style homepage with hero section and movie carousels"*
   - *"Create a Kanban board for task management"*
   - *"Generate a dashboard with charts and statistics"*
4. **Watch the AI agent** write code in real-time
5. **Preview your app** in the live sandbox
6. **Iterate and refine** by chatting with the AI
7. **Download or deploy** your generated code

### Example Prompts

- `"Create a landing page for a SaaS product with pricing tiers"`
- `"Build a todo app with drag-and-drop functionality"`
- `"Generate a portfolio website with image gallery"`
- `"Make a weather dashboard with API integration"`
- `"Create a blog with markdown support"`

## 🏗️ Project Structure

```
vibe/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Authentication pages
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── (protected)/         # Protected routes
│   │   ├── projects/        # Project management
│   │   └── pricing/         # Billing page
│   ├── api/                 # API routes
│   │   ├── trpc/           # tRPC handler
│   │   └── ingest/         # Ingest webhook
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Homepage
├── components/              # React components
│   ├── ui/                 # Shadcn UI components
│   ├── message/            # Message components
│   ├── project/            # Project components
│   └── fragment/           # Code preview components
├── lib/                     # Utilities and configuration
│   ├── db.ts               # Prisma client
│   ├── trpc/               # tRPC setup
│   ├── ingest/             # Background jobs
│   └── agents/             # AI agent logic
├── prisma/                  # Database schema and migrations
│   ├── schema.prisma       # Prisma schema
│   └── seed.ts             # Database seeding
├── public/                  # Static assets
└── styles/                  # Global styles
```

## 🤖 AI Agent System

Vibe uses autonomous AI agents with custom tools and memory:

### Agent Capabilities
- **Code Generation**: Creates React components, API routes, and full applications
- **File Management**: Creates, updates, and reads files in the sandbox
- **Terminal Access**: Runs shell commands for package installation and builds
- **Memory**: Remembers conversation context for intelligent iterations
- **Error Recovery**: Automatically retries failed operations

### Agent Tools
1. **Terminal Tool**: Execute shell commands in sandbox
2. **File Writer**: Create or update files with proper syntax
3. **File Reader**: Read existing files to avoid hallucinations

### Agent Workflow
```
User Prompt → AI Agent → Code Generation → Sandbox Execution → Preview → User Feedback → Iterate
```

## 🔒 Authentication & Billing

### Authentication (Clerk)
- Email/password and OAuth providers
- Session management
- User profiles
- Protected routes via middleware

### Billing System
- Credit-based usage model
- Usage tracking with rate limiting
- Automatic credit deduction
- Stripe integration via Clerk
- Usage reset timers
- Upgrade prompts and pricing page

## 🗄️ Database Schema

### Core Models
- **User**: Authentication and profile data
- **Project**: Application containers with auto-generated names
- **Message**: Conversation history with user/assistant roles
- **Fragment**: Generated code snippets and previews
- **Usage**: Credit tracking with expiration

### Relationships
```
User → Projects → Messages → Fragments
User → Usage
```

## 🎨 UI Features

- **Resizable Panels**: Split view for messages and previews
- **Code Syntax Highlighting**: Prism.js integration
- **File Explorer**: Tree view with breadcrumb navigation
- **Dark Mode**: Beautiful theming with Tailwind
- **Toast Notifications**: Real-time feedback
- **Loading States**: Skeleton screens and spinners
- **Error Boundaries**: Graceful error handling

## 🚀 Deployment

### Deploy to Vercel

1. **Push to GitHub**
```bash
git push origin main
```

2. **Import to Vercel**
   - Connect your GitHub repository
   - Configure environment variables
   - Deploy!

3. **Configure Ingest Integration**
   - Set up Ingest webhook URL
   - Configure deployment protection bypass
   - Enable background jobs in production

### Environment Variables Checklist
- [ ] Database connection string
- [ ] Clerk keys
- [ ] AI model API keys
- [ ] E2B API key
- [ ] Ingest keys and webhook secret

## 🧪 Development Commands

```bash
# Development server with TurboPack
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Database commands
npx prisma generate          # Generate Prisma client
npx prisma migrate dev       # Run migrations
npx prisma db seed          # Seed database
npx prisma db push          # Push schema changes
npx prisma studio           # Database GUI

# Reset database (development only)
npx prisma migrate reset

# Build for production
npm run build

# Start production server
npm start
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Review
This project uses [Code Rabbit](https://coderabbit.ai/) for AI-powered code reviews on all pull requests.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/) and [React](https://react.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/) and [Shadcn UI](https://ui.shadcn.com/)
- Powered by [tRPC](https://trpc.io/) and [Prisma](https://www.prisma.io/)
- AI agents by [Ingest](https://www.ingest.ai/)
- Sandboxes by [E2B](https://e2b.dev/)
- Authentication by [Clerk](https://clerk.com/)
- Deployed on [Vercel](https://vercel.com/)

## 📧 Contact

**Shafi Rehaman**
- Email: mohammadshafiq.rahaman@gmail.com
- GitHub: [@shafi-rehaman](https://github.com/shafi-rehaman)
- Project: [https://github.com/shafi-rehaman/vibe](https://github.com/shafi-rehaman/vibe)

---

**Made with ❤️  by Mohammed Shafi Rehaman**

*Star ⭐ this repo if you find it helpful!*
