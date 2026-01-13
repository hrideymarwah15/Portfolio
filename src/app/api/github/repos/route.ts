import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Restrict to owner only
    const OWNER_EMAIL = "hrideymarwah2907@gmail.com";
    if (user.email !== OWNER_EMAIL) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get user's GitHub access token from Supabase auth
    const { data: { session } } = await supabase.auth.getSession();
    const providerToken = session?.provider_token;

    if (!providerToken) {
      return NextResponse.json(
        { error: "No GitHub token found. Please sign in with GitHub." },
        { status: 401 }
      );
    }

    // Fetch user's repos from GitHub
    const response = await fetch("https://api.github.com/user/repos?sort=updated&per_page=100", {
      headers: {
        Authorization: `Bearer ${providerToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!response.ok) {
      if (response.status === 403) {
        return NextResponse.json(
          { error: "GitHub API rate limit exceeded. Try again later." },
          { status: 429 }
        );
      }
      throw new Error("Failed to fetch repos from GitHub");
    }

    const repos = await response.json();

    // Transform to simpler format
    const simplifiedRepos = repos
      .filter((repo: any) => !repo.fork) // Exclude forks
      .map((repo: any) => ({
        id: repo.id,
        name: repo.name,
        fullName: repo.full_name,
        description: repo.description || "",
        htmlUrl: repo.html_url,
        homepage: repo.homepage || null,
        stars: repo.stargazers_count,
        language: repo.language,
        topics: repo.topics || [],
        updatedAt: repo.updated_at,
      }));

    return NextResponse.json(simplifiedRepos);
  } catch (error) {
    console.error("Error fetching GitHub repos:", error);
    return NextResponse.json(
      { error: "Failed to fetch repositories" },
      { status: 500 }
    );
  }
}
