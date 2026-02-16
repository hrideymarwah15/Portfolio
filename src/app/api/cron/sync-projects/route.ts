import { getTopRepos } from "@/lib/github";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const repos = await getTopRepos();
    const supabase = await createClient();

    const results = [];

    for (const repo of repos) {
      // Map repo to ProjectDB structure
      // We use the repo name as the slug
      const projectData = {
        title: repo.name.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()), // Humanize title
        slug: repo.name.toLowerCase(),
        description: repo.description || "",
        problem: "Automated sync from GitHub.",
        outcome: `${repo.stars} stars on GitHub.`,
        tech_stack: repo.language ? [repo.language, ...(repo.topics || [])] : [...(repo.topics || [])],
        tag: "Open Source",
        tag_color: "blue", // Default color
        link: repo.homepage || repo.url,
        github_repo: repo.url,
        github_stars: repo.stars,
        visible: true,
        // We don't overwrite these if they exist
        updated_at: new Date().toISOString(),
      };

      // Check if exists to preserve manual edits (like cover_image, problem, etc)
      const { data: existing } = await supabase
        .from("projects")
        .select("id, cover_image, problem, outcome, tag, tag_color")
        .eq("slug", projectData.slug)
        .single();

      if (existing) {
        // Update only specific fields to keep manual polish
        const { error } = await supabase
            .from("projects")
            .update({
                description: projectData.description,
                github_stars: projectData.github_stars,
                updated_at: new Date().toISOString()
            })
            .eq("id", existing.id);
            
        results.push({ action: "updated", slug: projectData.slug, error });
      } else {
        // Insert new
        const { error } = await supabase
            .from("projects")
            .insert({
                ...projectData,
                // Defaults for required fields
                problem: projectData.description, 
                outcome: "View on GitHub",
                cover_image: null,
                featured: false,
                sort_order: 99
            });
            
        results.push({ action: "created", slug: projectData.slug, error });
      }
    }

    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error("Project sync failed:", error);
    return NextResponse.json({ success: false, error: "Sync failed" }, { status: 500 });
  }
}
