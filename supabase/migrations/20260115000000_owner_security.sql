-- Add owner email security constraint
-- This migration restricts all admin operations to the owner email only

-- Drop existing admin policies and recreate with owner email check
DROP POLICY IF EXISTS "Only admins can modify content" ON public.site_content;
DROP POLICY IF EXISTS "Only admins can modify projects" ON public.projects;
DROP POLICY IF EXISTS "Only admins can modify blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Only admins can modify availability" ON public.availability;
DROP POLICY IF EXISTS "Only admins can view analytics" ON public.analytics_events;
DROP POLICY IF EXISTS "Only admins can view webhook events" ON public.github_webhook_events;

-- Create new policies that check for owner email
CREATE POLICY "Only owner can modify content" ON public.site_content
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() 
      AND role = 'admin'
      AND email = 'hrideymarwah2907@gmail.com'
    )
  );

CREATE POLICY "Only owner can modify projects" ON public.projects
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() 
      AND role = 'admin'
      AND email = 'hrideymarwah2907@gmail.com'
    )
  );

CREATE POLICY "Only owner can modify blog posts" ON public.blog_posts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() 
      AND role = 'admin'
      AND email = 'hrideymarwah2907@gmail.com'
    )
  );

CREATE POLICY "Only owner can modify availability" ON public.availability
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() 
      AND role = 'admin'
      AND email = 'hrideymarwah2907@gmail.com'
    )
  );

CREATE POLICY "Only owner can view analytics" ON public.analytics_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() 
      AND role = 'admin'
      AND email = 'hrideymarwah2907@gmail.com'
    )
  );

CREATE POLICY "Only owner can view webhook events" ON public.github_webhook_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() 
      AND role = 'admin'
      AND email = 'hrideymarwah2907@gmail.com'
    )
  );

-- Update visible projects/posts policies to use owner email
DROP POLICY IF EXISTS "Visible projects are viewable by everyone" ON public.projects;
CREATE POLICY "Visible projects are viewable by everyone" ON public.projects
  FOR SELECT USING (visible = true OR EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
    AND email = 'hrideymarwah2907@gmail.com'
  ));

DROP POLICY IF EXISTS "Published posts are viewable by everyone" ON public.blog_posts;
CREATE POLICY "Published posts are viewable by everyone" ON public.blog_posts
  FOR SELECT USING (published = true OR EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
    AND email = 'hrideymarwah2907@gmail.com'
  ));
