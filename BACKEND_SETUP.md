# Backend Setup Guide

This document explains how to set up and run the backend infrastructure for your portfolio website.

## Overview

The portfolio has been upgraded with the following backend features:

- **PostgreSQL Database** via Prisma ORM
- **Authentication** via NextAuth with GitHub OAuth
- **Blog System** with Markdown support
- **Admin Dashboard** at `/dashboard`
- **Analytics** (self-hosted, no third-party services)
- **GitHub Integration** with webhook support
- **Content Management** for all site content

## Prerequisites

1. A PostgreSQL database (recommended: [Neon](https://neon.tech) or [Supabase](https://supabase.com))
2. A GitHub OAuth App for authentication

## Environment Variables

Create or update your `.env` file with the following:

```env
# Database - Use a Neon or Supabase PostgreSQL URL
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"  # Your domain in production
NEXTAUTH_SECRET="your-secret-key-generate-with-openssl-rand-base64-32"

# GitHub OAuth (create at https://github.com/settings/developers)
GITHUB_ID="your-github-oauth-client-id"
GITHUB_SECRET="your-github-oauth-client-secret"

# GitHub Integration (optional, for GitHub webhook and repo sync)
GITHUB_TOKEN="ghp_your_personal_access_token"
GITHUB_WEBHOOK_SECRET="your-webhook-secret"
GITHUB_USERNAME="hrideymarwah15"

# Admin Configuration
ADMIN_EMAIL="hrideymarwah2907@gmail.com"
```

## Database Setup

### Option 1: Using Neon (Recommended for Serverless)

1. Sign up at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string to `DATABASE_URL`
4. Run migrations:

```bash
npx prisma migrate dev --name init
```

### Option 2: Using Supabase

1. Sign up at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings > Database > Connection string
4. Copy the connection string (use "URI" format) to `DATABASE_URL`
5. Run migrations:

```bash
npx prisma migrate dev --name init
```

### Option 3: Local Development (Prisma Studio/Proxy)

For local development without a remote database:

```bash
npx prisma migrate dev --name init
```

This uses Prisma's local proxy (already configured in your current setup).

## GitHub OAuth Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in:
   - **Application name**: Your Portfolio
   - **Homepage URL**: `http://localhost:3000` (or your domain)
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
4. Copy the Client ID and Client Secret to your `.env`

## Running the Application

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm start
```

## Admin Dashboard

Access the admin dashboard at `/dashboard` after signing in with your GitHub account.

The dashboard includes:

- **Content Editor** (`/dashboard/content`) - Edit hero, about, contact, meta, and skills
- **Projects Manager** (`/dashboard/projects`) - Add, edit, delete projects
- **Blog Manager** (`/dashboard/blog`) - Write and publish blog posts
- **Analytics** (`/dashboard/analytics`) - View site analytics

## API Routes

| Route | Description |
|-------|-------------|
| `GET /api/site-data` | Public API for site content |
| `POST /api/analytics/track` | Track page views and events |
| `POST /api/webhooks/github` | GitHub webhook endpoint |
| `GET /api/cron/sync-github` | Sync GitHub repos (for cron) |
| `GET /api/github/repos` | Fetch GitHub repos for current user |

## Database Schema

The database includes the following models:

- **User/Account/Session** - NextAuth authentication
- **SiteContent** - Hero, About, Contact, Meta, Skills content
- **Project** - Portfolio projects
- **BlogPost** - Blog posts with markdown content
- **Availability** - Status and message
- **AnalyticsEvent** - Page views and events
- **GitHubWebhookEvent** - GitHub webhook payloads

## Seeding Initial Data

After running migrations, you can seed initial data in the dashboard or via Prisma Studio:

```bash
npx prisma studio
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

Ensure your platform supports:
- Node.js 18+
- PostgreSQL connection
- Environment variables

## Troubleshooting

### "DATABASE_URL environment variable is not set"

Make sure your `.env` file exists and contains `DATABASE_URL`.

### "fetch failed" / Connection errors

Check that your database is accessible and the connection string is correct.

### Authentication not working

1. Verify `NEXTAUTH_URL` matches your domain
2. Check GitHub OAuth callback URL matches
3. Ensure `NEXTAUTH_SECRET` is set

### Build fails with Prisma errors

Run `npx prisma generate` to regenerate the Prisma client.
