-- Add content fields to blog_posts
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS content_mdx TEXT;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS excerpt TEXT;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS cover_image TEXT;
