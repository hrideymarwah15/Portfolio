import { createClient } from "@/lib/supabase/server";

// Types
export interface HeroData {
  headline1: string;
  headline2: string;
  highlightWord: string;
  description: string;
  ctaText: string;
}

export interface AboutData {
  name: string;
  description: string;
  photoUrl: string;
  stats: { label: string; value: string }[];
}

export interface ContactData {
  email: string;
  github: string;
  linkedin: string;
  portfolio?: string;
  description: string;
}

export interface MetaData {
  footerText: string;
}

// Database types (snake_case)
interface ProjectDB {
  id: string;
  title: string;
  problem: string;
  outcome: string;
  tag: string;
  tag_color: string;
  link: string | null;
  live_url: string | null;
  github_repo: string | null;
  github_stars: number | null;
  visible: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

interface BlogPostDB {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  cover_image: string | null;
  tags: string[];
  published: boolean;
  published_at: string | null;
  author_id: string | null;
  created_at: string;
  updated_at: string;
}

interface AvailabilityDB {
  id: string;
  is_available: boolean;
  message: string;
  updated_at: string;
}

// Frontend types (camelCase)
export interface Project {
  id: string;
  title: string;
  problem: string;
  outcome: string;
  tag: string;
  tagColor: string;
  link: string | null;
  liveUrl: string | null;
  githubRepo: string | null;
  githubStars: number | null;
  isVisible: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  coverImage: string | null;
  tags: string[];
  published: boolean;
  publishedAt: string | null;
  authorId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Availability {
  id: string;
  isAvailable: boolean;
  message: string;
  updatedAt: string;
}

// Mappers
function mapProject(p: ProjectDB): Project {
  return {
    id: p.id,
    title: p.title,
    problem: p.problem,
    outcome: p.outcome,
    tag: p.tag,
    tagColor: p.tag_color,
    link: p.link,
    liveUrl: p.live_url,
    githubRepo: p.github_repo,
    githubStars: p.github_stars,
    isVisible: p.visible,
    sortOrder: p.sort_order,
    createdAt: p.created_at,
    updatedAt: p.updated_at,
  };
}

function mapBlogPost(p: BlogPostDB): BlogPost {
  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    content: p.content,
    excerpt: p.excerpt,
    coverImage: p.cover_image,
    tags: p.tags,
    published: p.published,
    publishedAt: p.published_at,
    authorId: p.author_id,
    createdAt: p.created_at,
    updatedAt: p.updated_at,
  };
}

function mapAvailability(a: AvailabilityDB): Availability {
  return {
    id: a.id,
    isAvailable: a.is_available,
    message: a.message,
    updatedAt: a.updated_at,
  };
}

// Default values
const defaultHero: HeroData = {
  headline1: "BUILDING THE",
  headline2: "FUTURE OF WEB",
  highlightWord: "FUTURE",
  description: "Full-stack developer crafting digital experiences.",
  ctaText: "VIEW MY WORK",
};

const defaultAbout: AboutData = {
  name: "Hridey Marwah",
  description: "Full-stack developer passionate about creating impactful solutions.",
  photoUrl: "/photo.jpg",
  stats: [
    { label: "Years Experience", value: "3+" },
    { label: "Projects Completed", value: "20+" },
    { label: "Technologies", value: "15+" },
  ],
};

const defaultContact: ContactData = {
  email: "hrideymarwah2907@gmail.com",
  github: "https://github.com/hrideymarwah15",
  linkedin: "https://linkedin.com/in/hrideymarwah",
  description: "Feel free to reach out!",
};

const defaultMeta: MetaData = {
  footerText: "© 2026 Hridey Marwah. All rights reserved.",
};

const defaultSkills: string[] = [
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "PostgreSQL",
  "Supabase",
];

// Site Content Functions
export async function getSiteContent<T>(key: string): Promise<T | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_content")
    .select("value")
    .eq("key", key)
    .single();

  if (error || !data) return null;
  return data.value as T;
}

export async function setSiteContent<T>(key: string, value: T): Promise<void> {
  const supabase = await createClient();
  await supabase
    .from("site_content")
    .upsert({ key, value, updated_at: new Date().toISOString() });
}

// Convenience getters with defaults
export async function getHero(): Promise<HeroData> {
  return (await getSiteContent<HeroData>("hero")) || defaultHero;
}

export async function getAbout(): Promise<AboutData> {
  return (await getSiteContent<AboutData>("about")) || defaultAbout;
}

export async function getContact(): Promise<ContactData> {
  return (await getSiteContent<ContactData>("contact")) || defaultContact;
}

export async function getMeta(): Promise<MetaData> {
  return (await getSiteContent<MetaData>("meta")) || defaultMeta;
}

export async function getSkills(): Promise<string[]> {
  return (await getSiteContent<string[]>("skills")) || defaultSkills;
}

// Setters
export async function setHero(data: HeroData): Promise<void> {
  await setSiteContent("hero", data);
}

export async function setAbout(data: AboutData): Promise<void> {
  await setSiteContent("about", data);
}

export async function setContact(data: ContactData): Promise<void> {
  await setSiteContent("contact", data);
}

export async function setMeta(data: MetaData): Promise<void> {
  await setSiteContent("meta", data);
}

export async function setSkills(skills: string[]): Promise<void> {
  await setSiteContent("skills", skills);
}

// Availability Functions
export async function getAvailability(): Promise<Availability | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("availability")
    .select("*")
    .limit(1)
    .single();

  if (error || !data) return null;
  return mapAvailability(data);
}

export async function setAvailability(
  isAvailable: boolean,
  message: string
): Promise<void> {
  const supabase = await createClient();
  const existing = await supabase
    .from("availability")
    .select("id")
    .limit(1)
    .single();

  if (existing.data) {
    await supabase
      .from("availability")
      .update({ is_available: isAvailable, message })
      .eq("id", existing.data.id);
  } else {
    await supabase
      .from("availability")
      .insert({ is_available: isAvailable, message });
  }
}

// Project Functions
export async function getVisibleProjects(): Promise<Project[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("visible", true)
    .order("sort_order", { ascending: true });

  if (error || !data) return [];
  return data.map(mapProject);
}

export async function getAllProjects(): Promise<Project[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error || !data) return [];
  return data.map(mapProject);
}

export async function getProjectById(id: string): Promise<Project | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return mapProject(data);
}

// Input type for creating projects (camelCase)
export interface ProjectInput {
  title: string;
  problem: string;
  outcome: string;
  tag: string;
  tagColor: string;
  link?: string | null;
  liveUrl?: string | null;
  githubRepo?: string | null;
  githubStars?: number | null;
  isVisible?: boolean;
  sortOrder?: number;
}

export async function createProject(project: ProjectInput): Promise<Project | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .insert({
      title: project.title,
      problem: project.problem,
      outcome: project.outcome,
      tag: project.tag,
      tag_color: project.tagColor,
      link: project.link ?? null,
      live_url: project.liveUrl ?? null,
      github_repo: project.githubRepo ?? null,
      github_stars: project.githubStars ?? null,
      visible: project.isVisible ?? true,
      sort_order: project.sortOrder ?? 0,
    })
    .select()
    .single();

  if (error || !data) return null;
  return mapProject(data);
}

export async function updateProject(
  id: string,
  project: Partial<ProjectInput>
): Promise<Project | null> {
  const supabase = await createClient();

  // Convert camelCase to snake_case
  const updates: Record<string, unknown> = {};
  if (project.title !== undefined) updates.title = project.title;
  if (project.problem !== undefined) updates.problem = project.problem;
  if (project.outcome !== undefined) updates.outcome = project.outcome;
  if (project.tag !== undefined) updates.tag = project.tag;
  if (project.tagColor !== undefined) updates.tag_color = project.tagColor;
  if (project.link !== undefined) updates.link = project.link;
  if (project.liveUrl !== undefined) updates.live_url = project.liveUrl;
  if (project.githubRepo !== undefined) updates.github_repo = project.githubRepo;
  if (project.githubStars !== undefined) updates.github_stars = project.githubStars;
  if (project.isVisible !== undefined) updates.visible = project.isVisible;
  if (project.sortOrder !== undefined) updates.sort_order = project.sortOrder;

  const { data, error } = await supabase
    .from("projects")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error || !data) return null;
  return mapProject(data);
}

export async function deleteProject(id: string): Promise<boolean> {
  const supabase = await createClient();
  const { error } = await supabase.from("projects").delete().eq("id", id);
  return !error;
}

// Blog Functions
export async function getPublishedBlogPosts(): Promise<BlogPost[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false });

  if (error || !data) return [];
  return data.map(mapBlogPost);
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data.map(mapBlogPost);
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;
  return mapBlogPost(data);
}

export async function getBlogPostById(id: string): Promise<BlogPost | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return mapBlogPost(data);
}

// Input type for creating blog posts (camelCase)
export interface BlogPostInput {
  title: string;
  slug: string;
  content: string;
  excerpt?: string | null;
  coverImage?: string | null;
  tags?: string[];
  published?: boolean;
  publishedAt?: string | null;
  authorId?: string | null;
}

export async function createBlogPost(post: BlogPostInput): Promise<BlogPost | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .insert({
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt ?? null,
      cover_image: post.coverImage ?? null,
      tags: post.tags ?? [],
      published: post.published ?? false,
      published_at: post.publishedAt ?? null,
      author_id: post.authorId ?? null,
    })
    .select()
    .single();

  if (error || !data) return null;
  return mapBlogPost(data);
}

export async function updateBlogPost(
  id: string,
  post: Partial<BlogPostInput>
): Promise<BlogPost | null> {
  const supabase = await createClient();

  // Convert camelCase to snake_case
  const updates: Record<string, unknown> = {};
  if (post.title !== undefined) updates.title = post.title;
  if (post.slug !== undefined) updates.slug = post.slug;
  if (post.content !== undefined) updates.content = post.content;
  if (post.excerpt !== undefined) updates.excerpt = post.excerpt;
  if (post.coverImage !== undefined) updates.cover_image = post.coverImage;
  if (post.tags !== undefined) updates.tags = post.tags;
  if (post.published !== undefined) updates.published = post.published;
  if (post.publishedAt !== undefined) updates.published_at = post.publishedAt;
  if (post.authorId !== undefined) updates.author_id = post.authorId;

  const { data, error } = await supabase
    .from("blog_posts")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error || !data) return null;
  return mapBlogPost(data);
}

export async function deleteBlogPost(id: string): Promise<boolean> {
  const supabase = await createClient();
  const { error } = await supabase.from("blog_posts").delete().eq("id", id);
  return !error;
}
