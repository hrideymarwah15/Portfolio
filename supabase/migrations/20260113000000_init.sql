-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================
-- PROFILES TABLE (extends auth.users)
-- =====================
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- =====================
-- SITE CONTENT TABLE
-- =====================
CREATE TABLE public.site_content (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- Content policies
CREATE POLICY "Site content is viewable by everyone" ON public.site_content
  FOR SELECT USING (true);

CREATE POLICY "Only admins can modify content" ON public.site_content
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =====================
-- PROJECTS TABLE
-- =====================
CREATE TABLE public.projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  problem TEXT NOT NULL,
  outcome TEXT NOT NULL,
  tag TEXT NOT NULL,
  tag_color TEXT NOT NULL DEFAULT 'text-blue-600',
  link TEXT,
  github_repo TEXT,
  github_stars INTEGER DEFAULT 0,
  visible BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Projects policies
CREATE POLICY "Visible projects are viewable by everyone" ON public.projects
  FOR SELECT USING (visible = true OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Only admins can modify projects" ON public.projects
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =====================
-- BLOG POSTS TABLE
-- =====================
CREATE TABLE public.blog_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  cover_image TEXT,
  tags TEXT[] DEFAULT '{}',
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Blog policies
CREATE POLICY "Published posts are viewable by everyone" ON public.blog_posts
  FOR SELECT USING (published = true OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Only admins can modify blog posts" ON public.blog_posts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =====================
-- AVAILABILITY TABLE
-- =====================
CREATE TABLE public.availability (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  is_available BOOLEAN DEFAULT true,
  message TEXT DEFAULT 'Available for new opportunities',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.availability ENABLE ROW LEVEL SECURITY;

-- Availability policies
CREATE POLICY "Availability is viewable by everyone" ON public.availability
  FOR SELECT USING (true);

CREATE POLICY "Only admins can modify availability" ON public.availability
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =====================
-- ANALYTICS EVENTS TABLE
-- =====================
CREATE TABLE public.analytics_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_type TEXT NOT NULL,
  page TEXT,
  referrer TEXT,
  user_agent TEXT,
  ip_hash TEXT,
  session_id TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Analytics policies - anyone can insert (track), only admins can read
CREATE POLICY "Anyone can track events" ON public.analytics_events
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Only admins can view analytics" ON public.analytics_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =====================
-- GITHUB WEBHOOK EVENTS TABLE
-- =====================
CREATE TABLE public.github_webhook_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  processed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.github_webhook_events ENABLE ROW LEVEL SECURITY;

-- GitHub webhook policies
CREATE POLICY "Only admins can view webhook events" ON public.github_webhook_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =====================
-- FUNCTIONS & TRIGGERS
-- =====================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all relevant tables
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_content_updated_at
  BEFORE UPDATE ON public.site_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_availability_updated_at
  BEFORE UPDATE ON public.availability
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    CASE 
      WHEN NEW.email = 'hrideymarwah2907@gmail.com' THEN 'admin'
      ELSE 'user'
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================
-- SEED DATA
-- =====================

-- Insert default availability
INSERT INTO public.availability (is_available, message)
VALUES (true, 'Open to new opportunities and collaborations')
ON CONFLICT DO NOTHING;

-- Insert default site content
INSERT INTO public.site_content (key, value) VALUES
('hero', '{
  "headline1": "BUILDING THE",
  "headline2": "FUTURE OF WEB",
  "highlightWord": "FUTURE",
  "description": "Full-stack developer crafting digital experiences with modern technologies. Passionate about clean code, scalable architecture, and user-centric design.",
  "ctaText": "VIEW MY WORK"
}'::jsonb),
('about', '{
  "name": "Hridey Marwah",
  "description": "I''m a passionate full-stack developer with expertise in building scalable web applications. I love working with modern technologies and creating seamless user experiences.",
  "photoUrl": "/photo.jpg",
  "stats": [
    {"label": "Years Experience", "value": "3+"},
    {"label": "Projects Completed", "value": "20+"},
    {"label": "Technologies", "value": "15+"}
  ]
}'::jsonb),
('contact', '{
  "email": "hrideymarwah2907@gmail.com",
  "github": "https://github.com/hrideymarwah15",
  "linkedin": "https://linkedin.com/in/hrideymarwah",
  "description": "Feel free to reach out for collaborations, opportunities, or just to say hello!"
}'::jsonb),
('meta', '{
  "footerText": "© 2026 Hridey Marwah. Built with Next.js and Supabase."
}'::jsonb),
('skills', '["TypeScript", "React", "Next.js", "Node.js", "PostgreSQL", "Supabase", "Tailwind CSS", "Python", "Docker", "AWS", "Git", "GraphQL"]'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- Insert sample projects
INSERT INTO public.projects (title, problem, outcome, tag, tag_color, link, sort_order) VALUES
('Nyaay Saathi', 'Legal aid platform connecting underserved communities with lawyers.', 'Reduced case intake from days to minutes.', 'ACTIVE', 'text-green-600', 'https://github.com/hrideymarwah15', 1),
('Infrastructure Monitoring', 'Real-time alerting across distributed cloud services.', 'Reduced incident response time by 60%.', 'BUILD', 'text-blue-600', NULL, 2),
('Document Processing', 'Automated extraction for enterprise documents.', 'Processed 10K+ documents with 95% accuracy.', 'RESEARCH', 'text-gray-600', NULL, 3),
('API Gateway', 'Unified auth, rate limiting, and routing.', 'Handled 1M+ requests/day with 99.9% uptime.', 'BUILD', 'text-blue-600', NULL, 4)
ON CONFLICT DO NOTHING;
