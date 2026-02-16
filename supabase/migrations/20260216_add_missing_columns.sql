-- Add tech_stack if missing
ALTER TABLE projects ADD COLUMN IF NOT EXISTS tech_stack TEXT[] DEFAULT '{}';

-- Add cover_image if missing
ALTER TABLE projects ADD COLUMN IF NOT EXISTS cover_image TEXT;

-- Add slug if missing
ALTER TABLE projects ADD COLUMN IF NOT EXISTS slug TEXT;

-- Update existing slugs from title (basic slugification)
UPDATE projects 
SET slug = lower(regexp_replace(title, '[^a-zA-Z0-9]+', '-', 'g')) 
WHERE slug IS NULL;

-- Handle potential duplicate slugs by appending random suffix (optional safer approach)
-- For now, assuming titles are distinct enough or user will fix conflicts.

-- Make slug unique and not null
ALTER TABLE projects ALTER COLUMN slug SET NOT NULL;

-- Add unique constraint if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'projects_slug_key') THEN
        ALTER TABLE projects ADD CONSTRAINT projects_slug_key UNIQUE (slug);
    END IF;
END $$;
