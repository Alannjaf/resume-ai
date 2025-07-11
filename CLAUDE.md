# Claude Code Instructions for ResumeAI Project

## 🎯 Project Context
This is an AI-powered resume builder web application with multilingual support for Kurdish Sorani, Arabic, and English. Built with Next.js, TypeScript, Tailwind CSS, and Clerk authentication.

## 📍 Current Status
- ✅ **Landing page complete** - Responsive design with header, hero, features, pricing, footer
- ✅ **Authentication working** - Clerk integration with sign-in/sign-up pages and dashboard
- ✅ **UI foundation ready** - Tailwind CSS, components, responsive design
- 🔄 **Next priority:** Database setup with Neon.tech and Prisma ORM

## 🚀 When Starting a New Session



### Step 1: Verify Environment
```bash
# Check if the app runs correctly
npm run dev
# Should start on http://localhost:3000
# Test: Sign up/in should work, dashboard should be accessible
```

### Step 2: Continue From Where We Left Off
**Current next task:** Set up database (Neon.tech + Prisma)

## 🛠️ Development Commands
```bash
# Start development server
npm run dev

# Install new dependencies
npm install [package-name]

# Check project structure
ls -la src/

# View environment variables (if needed)
cat .env.local
```

## 📋 Key Project Details

### Tech Stack
- **Framework:** Next.js 15 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Authentication:** Clerk
- **Database:** Neon.tech (PostgreSQL) + Prisma ORM (to be set up)
- **AI:** Google Gemini 2.5 Flash Preview (to be integrated)
- **Payments:** FIB and Nasspay (to be integrated)

### Important Files
- `PROJECT_STATUS.md` - Complete project status and todo list
- `src/app/page.tsx` - Landing page
- `src/app/dashboard/page.tsx` - User dashboard
- `src/components/landing/` - Landing page components
- `.env.local` - Environment variables (Clerk keys configured)

### User Flow
1. User visits landing page
2. Clicks "Get Started" → Sign up with Clerk
3. Redirected to dashboard
4. Can create/manage resumes (to be built)

## 🎯 Next Development Priorities

### 1. Database Setup (IMMEDIATE)
- Configure Neon.tech PostgreSQL database
- Install Prisma ORM
- Create schema for users, resumes, subscriptions
- Connect to Clerk user management

### 2. Resume Builder (HIGH PRIORITY)
- Create form wizard for resume creation
- Real-time preview component
- Save/load functionality
- Template selection

### 3. AI Integration (HIGH PRIORITY)
- Google Gemini API integration
- Content generation and enhancement
- Multi-language support

## ⚠️ Important Notes
- Port forwarding is configured for WSL: `netsh interface portproxy add v4tov4 listenport=3000 listenaddress=0.0.0.0 connectport=3000 connectaddress=172.29.255.32`
- Clerk authentication is fully working
- Language switcher is UI-only (actual i18n to be implemented later)
- All environment variables for Clerk are configured

## 🔍 Debugging Tips
- If 404 errors occur, check if middleware.ts is working
- For styling issues, verify Tailwind CSS is compiling correctly
- For auth issues, check .env.local has correct Clerk keys
- Always restart dev server after environment changes

## 💡 Development Workflow Memories
- I always run the server and run the build in my windows cmd
- I always run npm run dev and npm run build on my windows cmd

---

## IMPORTANT
- Make sure each file should not be more than 100 lines of code
- After adding each debug log or comment, make sure to remove it before committing
- when i provide images the path should be in wsl path not in windows path

## 💡 Development Best Practices
- When creating/editing/deleting files always check for lint errors and type errors

## 💡 Advanced Development Strategies
- Always use multiple parallel agents/tasks for complex works or searchs and make sure each of the agents are working on different files so they will not overlap each other
- To test database you have access to NEON MCP which you can use it
- If you didn't know an issue reason try to add debug for the user to test the app and show you the debug result and then fix the code. after the code fixed and user confirmed then remove the debug logs
- If you create scripts for testing the app and the test passes then you need to remove the scripts
- After each fix or edit or feature added you have to run command to check for lint errors and type errors and make sure npm run build are totally clean without any errors and warnings