# Hridey Portfolio V2 --- Full System Blueprint

Objective: Transform portfolio into a product-grade engineering system
that signals elite full-stack capability, systems thinking, and
consistent output.

------------------------------------------------------------------------

# 1. SYSTEM VISION

This is not a portfolio site.\
This is a personal engineering platform.

It must function as: - Portfolio - CMS - Engineering dashboard - Public
build log - Recruiter funnel - AI-indexed knowledge base

Target perception: "This engineer builds systems, not just websites."

------------------------------------------------------------------------

# 2. CORE ARCHITECTURE

## Tech Stack

Frontend: - Next.js 14+ (App Router) - TypeScript - TailwindCSS + CSS
variables - Framer Motion - Three.js / React Three Fiber (limited use) -
MDX

Backend: - Supabase (Postgres + Auth + Storage) - Next.js Server
Actions - Zod validation layer

AI Layer: - OpenAI API - pgvector (Supabase) - embeddings pipeline

Analytics: - PostHog or Plausible - Sentry (error logging)

Deployment: - Vercel - Supabase

------------------------------------------------------------------------

# 3. HIGH LEVEL SYSTEM ARCHITECTURE

Client (Next.js) → Server Actions/API → Service Layer → Repository Layer
→ Supabase DB → External APIs (GitHub, LLM)

Service Layer Files: - github.service.ts - blog.service.ts -
project.service.ts - analytics.service.ts - ai.service.ts

------------------------------------------------------------------------

# 4. DATABASE MODELS

## projects

-   id
-   title
-   slug
-   description
-   tech_stack\[\]
-   github_url
-   live_url
-   cover_image
-   featured
-   visibility
-   created_at

## blog_posts

-   id
-   slug
-   title
-   content_mdx
-   tags\[\]
-   cover
-   published_at
-   updated_at
-   visibility

## logs (build in public)

-   id
-   content
-   type (commit, note, release)
-   created_at

## messages

-   id
-   name
-   email
-   message
-   created_at

## metrics_cache

-   id
-   github_commits
-   repos
-   leetcode
-   updated_at

## embeddings

-   id
-   content
-   embedding vector

------------------------------------------------------------------------

# 5. CORE FEATURES

## Engineering Dashboard (/system)

Public live metrics: - GitHub activity - coding hours - current stack -
learning roadmap - shipped this week

## Case Study Project Pages

Each project must include: - architecture diagram - tech decisions -
scaling plan - performance metrics - screenshots - repo link

## Recruiter Mode Toggle

Simplified UI: - skills - projects - resume - contact

Removes experimental visuals.

## Build in Public Logs (/logs)

Auto pulls: - commits - blog posts - release notes - manual updates

## AI Chatbot

Ask about: - skills - projects - experience

Stack: - embeddings (pgvector) - OpenAI - RAG search

------------------------------------------------------------------------

# 6. PERFORMANCE SYSTEM

Targets: - Lighthouse 95+ all - LCP \< 1.8s - TTI \< 2.5s

Implement: - image optimization (AVIF) - dynamic imports - ISR caching -
edge caching - skeleton loaders

------------------------------------------------------------------------

# 7. SECURITY + ENGINEERING SIGNALS

Must include: - rate limiting (contact API) - zod validation - error
logging (Sentry) - analytics tracking - CSP headers - SEO metadata -
sitemap + robots

------------------------------------------------------------------------

# 8. ELITE FEATURES

Implement at least 5:

-   public roadmap page
-   changelog page
-   system design blog section
-   now-building widget
-   resume auto-update
-   command palette navigation
-   terminal mode
-   portfolio public API
-   PWA offline support

------------------------------------------------------------------------

# 9. BUILD ORDER (STRICT)

Phase 1: 1. Backend schema + Supabase 2. CMS dashboard 3. Case study
project pages 4. engineering dashboard 5. performance optimization

Phase 2: 6. AI chatbot (RAG) 7. build logs 8. recruiter mode 9.
analytics 10. roadmap/changelog

Phase 3: 11. motion polish 12. 3D enhancements 13. experimental UI

------------------------------------------------------------------------

# FINAL DIRECTIVE

Build this like a startup product.

Every feature must answer: "Does this make me look like a serious
engineer?"

If not, remove it.
