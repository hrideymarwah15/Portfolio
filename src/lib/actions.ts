"use server";

import {
  setHero,
  setAbout,
  setContact,
  setMeta,
  setSkills,
  setAvailability,
  createProject,
  updateProject,
  deleteProject,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  getProjectById,
  getAllProjects,
  HeroData,
  AboutData,
  ContactData,
  MetaData,
  ProjectInput,
  BlogPostInput,
} from "@/lib/db";
import { revalidatePath } from "next/cache";

// Content Actions
export async function updateHeroAction(data: HeroData) {
  await setHero(data);
  revalidatePath("/");
  revalidatePath("/dashboard/content");
}

export async function updateAboutAction(data: AboutData) {
  await setAbout(data);
  revalidatePath("/");
  revalidatePath("/dashboard/content");
}

export async function updateContactAction(data: ContactData) {
  await setContact(data);
  revalidatePath("/");
  revalidatePath("/dashboard/content");
}

export async function updateMetaAction(data: MetaData) {
  await setMeta(data);
  revalidatePath("/");
  revalidatePath("/dashboard/content");
}

export async function updateSkillsAction(skills: string[]) {
  await setSkills(skills);
  revalidatePath("/");
  revalidatePath("/dashboard/content");
}

export async function updateAvailabilityAction(
  isAvailable: boolean,
  message: string | null
) {
  await setAvailability(isAvailable, message || "");
  revalidatePath("/");
  revalidatePath("/dashboard/content");
}

// Project Actions
export async function createProjectAction(input: ProjectInput) {
  const project = await createProject(input);
  revalidatePath("/");
  revalidatePath("/dashboard/projects");
  return { success: !!project, project };
}

export async function updateProjectAction(
  id: string,
  input: Partial<ProjectInput>
) {
  const project = await updateProject(id, input);
  revalidatePath("/");
  revalidatePath("/dashboard/projects");
  return { success: !!project, project };
}

export async function deleteProjectAction(id: string) {
  const success = await deleteProject(id);
  revalidatePath("/");
  revalidatePath("/dashboard/projects");
  return { success };
}

// GitHub Sync Actions
export async function syncProjectGitHubAction(id: string) {
  const project = await getProjectById(id);
  if (!project || !project.githubRepo) {
    return { success: false, error: "No GitHub repo linked" };
  }

  try {
    // Fetch GitHub data
    const response = await fetch(
      `https://api.github.com/repos/${project.githubRepo}`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          ...(process.env.GITHUB_TOKEN
            ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
            : {}),
        },
        next: { revalidate: 0 },
      }
    );

    if (!response.ok) {
      return { success: false, error: "Failed to fetch GitHub data" };
    }

    const data = await response.json();
    const updated = await updateProject(id, {
      githubStars: data.stargazers_count,
    });

    revalidatePath("/");
    revalidatePath("/dashboard/projects");
    return { success: true, project: updated };
  } catch {
    return { success: false, error: "GitHub sync failed" };
  }
}

export async function syncAllProjectsGitHubAction() {
  const projects = await getAllProjects();
  const results = await Promise.all(
    projects
      .filter((p) => p.githubRepo)
      .map((p) => syncProjectGitHubAction(p.id))
  );

  revalidatePath("/");
  revalidatePath("/dashboard/projects");
  return {
    success: true,
    synced: results.filter((r) => r.success).length,
    total: results.length,
  };
}

// Blog Actions
export async function createBlogPostAction(input: BlogPostInput) {
  const post = await createBlogPost(input);
  revalidatePath("/blog");
  revalidatePath("/dashboard/blog");
  return { success: !!post, post };
}

export async function updateBlogPostAction(
  id: string,
  input: Partial<BlogPostInput>
) {
  const post = await updateBlogPost(id, input);
  revalidatePath("/blog");
  revalidatePath("/dashboard/blog");
  if (input.slug) {
    revalidatePath(`/blog/${input.slug}`);
  }
  return { success: !!post, post };
}

export async function deleteBlogPostAction(id: string) {
  const success = await deleteBlogPost(id);
  revalidatePath("/blog");
  revalidatePath("/dashboard/blog");
  return { success };
}
