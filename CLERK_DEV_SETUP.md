# Clerk Development Instance Setup Guide

## Step 1: Create Development Application in Clerk

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Click **"Create application"** button
3. Configure your development app:
   - **Application name**: `ResumeAI Development`
   - **Sign-in options**: Enable same as production (Email, Google, etc.)
   - Click **"Create application"**

## Step 2: Get Your Development Keys

After creating the app, you'll see:
- **Publishable key**: `pk_test_...` (starts with pk_test)
- **Secret key**: `sk_test_...` (starts with sk_test)

## Step 3: Configure Webhooks (Optional)

If you need webhooks for local testing:
1. Go to **Webhooks** in left sidebar
2. Click **"Add endpoint"**
3. URL: `https://YOUR_NGROK_URL.ngrok.io/api/webhooks/clerk` (we'll set up ngrok later)
4. Select events: `user.created`, `user.updated`, `user.deleted`
5. Copy the **Signing secret**

## Step 4: Update Your .env.local

Replace the content with your development keys:

```env
# Clerk Configuration - DEVELOPMENT KEYS
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
CLERK_SECRET_KEY=sk_test_YOUR_SECRET_HERE

# Clerk Redirect URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/dashboard

# Clerk Webhook Secret (if using webhooks)
CLERK_WEBHOOK_SECRET=whsec_YOUR_DEV_WEBHOOK_SECRET

# OpenRouter AI Configuration
OPENROUTER_API_KEY=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
```

## Step 5: Create .env.production for Netlify

Create a new file `.env.production` for your production keys:

```env
# Clerk Configuration - PRODUCTION KEYS
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_Y2xlcmsud29yay5rcmQk
CLERK_SECRET_KEY=sk_live_qHZJI5b47aMosWRbmobJDHYve55xjV0VCugzS1N860

# Clerk Redirect URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/dashboard

# Clerk Webhook Secret
CLERK_WEBHOOK_SECRET=whsec_wesR515OBRNkZldDKqBQsHP3bL0fg37p

# OpenRouter AI Configuration
OPENROUTER_API_KEY=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
```

## Step 6: Update .gitignore

Make sure both env files are ignored:
```
.env.local
.env.production
```

## Step 7: Configure Netlify

In Netlify dashboard, set these environment variables:
- All the variables from `.env.production`
- This ensures production uses production keys

## Step 8: Test Locally

```bash
npm run dev
```

Visit `http://localhost:3000` - everything should work!

## Summary

- **Local development**: Uses `.env.local` with development keys
- **Production (Netlify)**: Uses environment variables set in Netlify dashboard
- **No domain restrictions**: Development keys work on localhost
- **Separate data**: Development and production users are separate

## Optional: Webhook Testing with ngrok

If you need webhooks locally:
```bash
# Install ngrok
npm install -g ngrok

# Terminal 1
npm run dev

# Terminal 2
ngrok http 3000

# Add the ngrok URL to your Clerk dev webhooks
```