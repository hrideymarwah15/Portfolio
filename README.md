# Portfolio Website

A modern, brutalist-style portfolio website built with Next.js 16, Supabase, and TailwindCSS.

## Features

- 🎨 **Brutalist Design** - Bold, high-contrast UI with monospace fonts
- 📝 **CMS Dashboard** - Full content management for hero, about, contact, projects, and blog
- 📊 **Analytics** - Built-in page view and event tracking
- 🔐 **Supabase Auth** - GitHub OAuth with admin role-based access
- 📱 **Responsive** - Mobile-first design
- ⚡ **Fast** - Server-side rendering with Next.js App Router

## Tech Stack

- **Framework**: Next.js 16.1 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth with GitHub OAuth
- **Styling**: TailwindCSS
- **Language**: TypeScript

## Quick Start

### 1. Clone and Install

```bash
git clone <your-repo>
cd portfolio
npm install
```

### 2. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Go to **Project Settings > API** and copy your URL and anon key
3. Update your `.env` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Run Database Migration

Go to **SQL Editor** in your Supabase dashboard and run the migration file:

```bash
# Copy contents from:
supabase/migrations/20260113000000_init.sql
```

### 4. Enable GitHub OAuth

1. In Supabase, go to **Authentication > Providers**
2. Enable GitHub
3. Create a GitHub OAuth App at [github.com/settings/developers](https://github.com/settings/developers)
   - Set callback URL to: `https://your-project.supabase.co/auth/v1/callback`
4. Add your GitHub Client ID and Secret to Supabase

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your site.

## Project Structure

```
src/
├── app/
│   ├── page.tsx          # Homepage
│   ├── blog/             # Blog pages
│   ├── dashboard/        # Admin CMS
│   └── auth/             # Auth pages
├── components/
│   └── dashboard/        # CMS components
└── lib/
    ├── db.ts             # Database functions
    ├── analytics.ts      # Analytics tracking
    ├── actions.ts        # Server actions
    └── supabase/         # Supabase client
```

## Admin Access

The first user to sign in with the email `hrideymarwah2907@gmail.com` will automatically be assigned the `admin` role.

To change this, update the email in `supabase/migrations/20260113000000_init.sql`:

```sql
IF NEW.email = 'your-email@example.com' THEN
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
GITHUB_TOKEN=ghp_xxx (optional, for repo star sync)
```

## License

MIT

