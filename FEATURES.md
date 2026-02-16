# Portfolio Features & Architecture

This document provides an in-depth explanation of the features and architectural choices in this portfolio.

## 1. Engineering Dashboard (`/dashboard`)

The dashboard serves as a command center for managing the portfolio's content and data. It is protected and designed for the owner's use.

### **Features:**

- **Overview Metrics**: Visualizes key metrics like total contributions (from GitHub), project status, and automation health.
- **Automation Status**: Displays the real-time status of background jobs:
  - **Project Sync**: Fetches repository data (stars, descriptions) from GitHub using the GitHub API.
  - **Blog Auto-Publish**: Syncs local Markdown files to the database, ensuring content is always up-to-date.
  - **SEO Health**: Monitoring placeholder for SEO performance metrics.
- **Project Management**: Allows adding, editing, and deleting projects.
  - **GitHub Sync**: Connects projects to GitHub repositories to automatically update star counts and descriptions.
  - **Visibility Toggle**: Easily hide/show projects from the public portfolio without deleting them.
- **Blog Management**: A CMS-like interface to manage blog posts.
  - **MDX Support**: Writes posts in Markdown with JSX support for rich content.
  - **Tagging System**: Organizes posts by topic for better discoverability.

### **Architecture:**

- **Supabase**: Uses PostgreSQL for structured data storage (projects, blog posts).
- **Server Actions**: Mutations (create/update/delete) are handled via Next.js Server Actions for robust type safety and security.
- **Cron Jobs**: API routes (e.g., `/api/cron/sync-blog`) are designed to be triggered by cron services to keep data fresh.

## 2. Dynamic Blog System (`/blog`)

The blog is a hybrid system combining the speed of static files with the flexibility of a database.

### **Features:**

- **Local-First Authoring**: Posts can be written as `.mdx` files in the `content/blog` directory.
- **Automatic Sync**: A synchronization script parses local files and updates the Supabase database. This allows:
  - **Version Control**: Blog posts are version-controlled alongside the code.
  - **Dynamic Queries**: The frontend queries the database, enabling dynamic features like search, filtering, and sorting.
- **Search & Filter**: Real-time search by title, content, or tags.
- **Notifications**: "New Post Alert" notifies users of fresh content based on publication date.

## 3. Hero Animation (`/`)

The homepage features a custom animation designed to be subtle yet engaging.

### **Features:**

- **Seamless Integration**: The "Coder" animation plays automatically in the background.
- **No Controls**: It looks like a native part of the design, with no video controls or pause buttons.
- **Performance**: Loaded as an MP4 for better compression than GIF, with `pointer-events-none` to prevent interaction.

## 4. GitHub Integration

The portfolio deeply integrates with GitHub to showcase engineering activity.

### **Features:**

- **Contribution Graph**: Fetches contribution data to render a custom graph (similar to GitHub's profile).
- **Organization History**: Aggregates organizations you've contributed to via Pull Requests, ensuring a complete activity history.
- **Repository Stats**: Automatically updates project cards with the latest star counts.

### **Architecture:**

- **GitHub API**: Uses a personal access token (with a fallback to environment variables for admin access) to fetch public data without hitting strict rate limits.
- **Caching**: Data is cached to ensure fast load times and minimal API usage.

## 5. SEO & Performance

- **Metadata**: Dynamic OpenGraph tags ensure links look great on social media.
- **Sitemap**: Automatically generated sitemap for optimal search engine indexing.
- **Optimization**: All images use `next/image` for automatic resizing and format conversion (WebP/AVIF).
