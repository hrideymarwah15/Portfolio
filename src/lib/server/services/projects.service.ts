
import { createClient } from "@/lib/supabase/server";
import { Project, ProjectDB } from "@/lib/types";

// Mapper
function mapProject(p: ProjectDB): Project {
  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    description: p.description,
    problem: p.problem,
    outcome: p.outcome,
    techStack: p.tech_stack || [],
    tag: p.tag,
    tagColor: p.tag_color,
    link: p.link,
    githubRepo: p.github_repo,
    githubStars: p.github_stars,
    coverImage: p.cover_image,
    featured: p.featured,
    visible: p.visible,
    sortOrder: p.sort_order,
    createdAt: p.created_at,
    updatedAt: p.updated_at,
  };
}

export class ProjectsService {
  async getAll(): Promise<Project[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !data) return [];
    return data.map(mapProject);
  }

  async getVisible(): Promise<Project[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("visible", true)
      .order("sort_order", { ascending: true });

    if (error || !data) return [];
    return data.map(mapProject);
  }

  async getBySlug(slug: string): Promise<Project | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !data) return null;
    return mapProject(data);
  }

  async getFeatured(): Promise<Project[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("featured", true)
      .eq("visible", true)
      .order("sort_order", { ascending: true });

    if (error || !data) return [];
    return data.map(mapProject);
  }
}

export const projectsService = new ProjectsService();
