# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🎯 Project Overview
ResumeAI (Works.krd) is a production-ready AI-powered resume builder with multilingual support (Kurdish Sorani, Arabic, English). The application offers multiple professional templates, AI content enhancement, and subscription-based features.

## 🛠️ Development Commands

```bash
# Development
npm run dev        # Start development server on http://localhost:3000 (runs on 0.0.0.0)

# Production
npm run build      # Build for production
npm run start      # Start production server

# Code Quality
npm run lint       # Run Next.js linting

# Database
npx prisma generate         # Generate Prisma client
npx prisma db push         # Push schema changes to database
npx prisma studio          # Open Prisma Studio GUI
```

## 🏗️ Architecture Overview

### Tech Stack
- **Framework:** Next.js 15.3.3 with App Router
- **Language:** TypeScript
- **Database:** PostgreSQL (Neon.tech) with Prisma ORM
- **Authentication:** Clerk (@clerk/nextjs)
- **Styling:** Tailwind CSS with custom configuration
- **AI Integration:** OpenAI SDK (for content enhancement)
- **Internationalization:** next-intl
- **Document Import:** mammoth (DOCX parsing)
- **Payments:** FIB and Nasspay (Kurdish payment gateways)

### Project Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes (auth, resumes, admin, etc.)
│   ├── dashboard/         # User dashboard
│   ├── resume-builder/    # Resume creation/editing
│   ├── admin/            # Admin panel
│   └── (auth)/           # Authentication pages
├── components/            # React components
│   ├── landing/          # Landing page components
│   ├── dashboard/        # Dashboard components
│   └── ui/              # Reusable UI components
├── lib/                  # Utilities and configurations
└── contexts/            # React contexts (e.g., LanguageContext)
```

### Database Schema (Prisma)
- **User**: Linked to Clerk auth, includes role system (USER/ADMIN)
- **Resume**: Multi-template support, draft/published states, public sharing
- **ResumeSection**: Flexible JSON content for various section types
- **Subscription**: Free/Basic/Pro tiers with usage tracking
- **SystemSettings**: Configurable limits and pricing

### Key API Routes
- `/api/auth/*` - Authentication and user management
- `/api/resumes/*` - Resume CRUD operations
- `/api/admin/*` - Admin-only endpoints
- `/api/ai/*` - AI content generation
- `/api/subscriptions/*` - Subscription management

## 🔐 Authentication & Authorization

### Clerk Integration
- Authentication handled via Clerk with middleware protection
- Protected routes: `/dashboard`, `/resume-builder`, `/settings`, `/billing`, `/admin`
- User sync via webhooks at `/api/webhooks/clerk`
- Role-based access control (USER/ADMIN)

### Environment Variables Required
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
DATABASE_URL
```

## 🎨 UI Development

### Styling Approach
- Tailwind CSS with custom color variables
- Utility function `cn()` for conditional classes (lib/utils.ts)
- Custom fonts: Geist Sans and Geist Mono
- Responsive design with mobile-first approach

### Component Patterns
- Server Components by default
- Client Components marked with "use client"
- Consistent loading and error states
- Toast notifications via react-hot-toast

## 🚀 Deployment

### Netlify Configuration
- Automatic Prisma migrations on deploy
- Node.js 22 specified
- Custom build command includes database setup
- Production environment variables required

### Production Checklist
- Ensure all environment variables are set
- Database migrations are applied
- Clerk production keys configured
- Payment gateway credentials set

## ⚠️ Important Considerations

### Current Implementation Status
- ✅ Complete authentication system
- ✅ Database schema and models
- ✅ Admin panel with user management
- ✅ Multiple resume templates
- ✅ AI integration for content
- ✅ Subscription system
- ✅ Resume import/export
- ⏳ Full i18n implementation (UI-only currently)

### Development Notes
- Always use absolute imports from `@/`
- Follow existing code patterns for consistency
- Test authentication flow after environment changes
- Use Prisma Studio for database inspection
- Check browser console for client-side errors

### Common Issues & Solutions
- **WSL Port Forwarding**: Already configured for port 3000
- **Clerk Errors**: Verify environment variables and restart dev server
- **Database Errors**: Check DATABASE_URL and run `npx prisma generate`
- **Build Failures**: Ensure TypeScript errors are resolved

## 📋 Quick Reference

### Add New API Route
1. Create route file in `src/app/api/[route]/route.ts`
2. Use consistent error handling pattern
3. Add authentication check if needed
4. Update TypeScript types

### Add New Resume Template
1. Create template component in `src/components/templates/`
2. Add to template registry
3. Update template preview gallery
4. Test with sample data

### Modify Database Schema
1. Update `prisma/schema.prisma`
2. Run `npx prisma db push` (development)
3. Generate client: `npx prisma generate`
4. Update related API routes and types

## Memory Notes

- Don't run the server because I am running it in Windows CMD, you can tell me to run in Windows CMD