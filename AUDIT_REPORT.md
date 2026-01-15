# Portfolio Project Audit Report

**Date:** January 14, 2026  
**Status:** ✅ Build Passing

---

## Changes Made This Session

### Removed Features
- **Live Preview Feature** - Completely removed `liveUrl` field and `LivePreviewModal` component
  - Removed from: `db.ts`, `ProjectsManager.tsx`, `ProjectsSection.tsx`
  - Deleted: `LivePreviewModal.tsx`

### Fixed Issues
- ✅ Middleware deprecation warning (moved `middleware.ts` to root)
- ✅ Missing photo.jpg (changed to `/coder.png`)
- ✅ Auth callback error handling improved
- ✅ Supabase middleware error handling with try/catch

---

## Security Audit

### ✅ Good Practices Found

| Area | Status | Notes |
|------|--------|-------|
| API Authentication | ✅ | All protected routes check `supabase.auth.getUser()` |
| Owner Verification | ✅ | Dashboard routes restricted to `OWNER_EMAIL` |
| Rate Limiting | ✅ | Messages API has 5/hour limit with IP hashing |
| Input Validation | ✅ | Messages API validates name/email/message length |
| CSRF Protection | ✅ | Supabase auth handles this |
| SQL Injection | ✅ | Using Supabase client (parameterized queries) |

### ⚠️ Security Recommendations

1. **Hardcoded Owner Email**
   - Found in: `server-client.ts`, `route.ts` (messages API)
   - **Fix:** Use `process.env.OWNER_EMAIL` consistently everywhere

2. **Rate Limit Storage**
   - Current: In-memory Map (resets on deploy)
   - **Recommendation:** Use Redis for production rate limiting

3. **Missing CORS Headers**
   - API routes don't explicitly set CORS
   - **Low risk** since using Supabase auth

---

## Known Bugs & Issues

### 🔴 Critical

| Issue | Location | Impact |
|-------|----------|--------|
| `live_url` column may not exist | Database | Projects won't save if column missing |

**Fix:** Run in Supabase SQL Editor:
```sql
ALTER TABLE projects ADD COLUMN IF NOT EXISTS live_url TEXT;
```

### 🟡 Medium

| Issue | Description | Solution |
|-------|-------------|----------|
| Supabase Auth Redirect | Must configure URLs in Supabase Dashboard | Add `https://www.hrideymarwah.online/auth/callback` to allowed URLs |
| RLS Policies | May need to be set up for tables | See RLS SQL below |

### 🟢 Low

| Issue | Description |
|-------|-------------|
| Unused `Eye` import | Was used for live preview, now removed |
| Cedarville Cursive font | Loaded via `<link>` instead of `next/font` |

---

## Database Schema Required

### Tables

```sql
-- site_content
CREATE TABLE IF NOT EXISTS site_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- projects
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  problem TEXT,
  outcome TEXT,
  tag TEXT,
  tag_color TEXT,
  link TEXT,
  github_repo TEXT,
  github_stars INTEGER,
  visible BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- blog_posts
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  excerpt TEXT,
  cover_image TEXT,
  tags TEXT[],
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  author_id UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- messages
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- availability
CREATE TABLE IF NOT EXISTS availability (
  id TEXT PRIMARY KEY DEFAULT 'current',
  is_available BOOLEAN DEFAULT true,
  message TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### RLS Policies

```sql
-- Enable RLS
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public read site_content" ON site_content FOR SELECT USING (true);
CREATE POLICY "Public read visible projects" ON projects FOR SELECT USING (visible = true);
CREATE POLICY "Public read published posts" ON blog_posts FOR SELECT USING (published = true);

-- Public can insert messages
CREATE POLICY "Public can send messages" ON messages FOR INSERT WITH CHECK (true);

-- Authenticated write policies
CREATE POLICY "Auth full access site_content" ON site_content FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth full access projects" ON projects FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth full access blog_posts" ON blog_posts FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth full access messages" ON messages FOR ALL USING (auth.role() = 'authenticated');
```

---

## Environment Variables Required

| Variable | Required | Location |
|----------|----------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ Yes | Vercel + `.env` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ Yes | Vercel + `.env` |
| `OWNER_EMAIL` | Optional | Fallback: `hrideymarwah2907@gmail.com` |
| `GITHUB_TOKEN` | Optional | For higher GitHub API limits |

---

## Supabase Configuration Checklist

- [ ] **Site URL:** `https://www.hrideymarwah.online`
- [ ] **Redirect URLs:** `https://www.hrideymarwah.online/auth/callback`
- [ ] **GitHub OAuth:** Configure in Supabase Auth → Providers
- [ ] **RLS Policies:** Run SQL above

---

## Performance Notes

| Metric | Status |
|--------|--------|
| Build Time | ~3s (Turbopack) |
| Static Pages | 11 pages |
| Dynamic Pages | Most routes are SSR |

---

## Recommendations

1. **Add photo** - Place personal photo at `public/photo.jpg`
2. **Test auth flow** - Sign in/out on deployed site
3. **Verify RLS** - Test that only you can edit content
4. **Monitor errors** - Check Vercel logs after deploy
5. **Consider Redis** - For production rate limiting

---

## Files Modified This Session

| File | Change |
|------|--------|
| `src/lib/db.ts` | Removed `liveUrl` field |
| `src/components/ProjectsSection.tsx` | Removed live preview feature |
| `src/components/dashboard/ProjectsManager.tsx` | Removed Live Preview URL input |
| `src/components/LivePreviewModal.tsx` | **Deleted** |
| `middleware.ts` | Moved to root |
| `src/lib/supabase/server-client.ts` | Renamed from middleware.ts, added error handling |
