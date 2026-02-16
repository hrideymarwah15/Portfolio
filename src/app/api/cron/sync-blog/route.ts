import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createClient();
    const contentDir = path.join(process.cwd(), "content/blog");

    // Ensure directory exists
    if (!fs.existsSync(contentDir)) {
      return NextResponse.json({ success: true, message: "No blog content directory found." });
    }

    const files = fs.readdirSync(contentDir);
    const results = [];

    for (const file of files) {
      if (!file.endsWith(".md") && !file.endsWith(".mdx")) continue;

      const filePath = path.join(contentDir, file);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(fileContent);

      const slug = data.slug || file.replace(/\.mdx?$/, "");

      const blogPost = {
        slug,
        title: data.title || "Untitled",
        content_mdx: content,
        excerpt: data.excerpt || "",
        cover_image: data.cover_image || null,
        tags: data.tags || [],
        published: data.published ?? false,
        published_at: data.published_at || new Date().toISOString(),
        author_id: data.author_id || null, // Optional
        updated_at: new Date().toISOString(),
      };

      // Check if exists
      const { data: existing } = await supabase
        .from("blog_posts")
        .select("id")
        .eq("slug", slug)
        .single();

      if (existing) {
        const { error } = await supabase
          .from("blog_posts")
          .update(blogPost)
          .eq("id", existing.id);
        results.push({ action: "updated", slug, error });
      } else {
        const { error } = await supabase
          .from("blog_posts")
          .insert({
            ...blogPost,
            created_at: new Date().toISOString(),
          });
        results.push({ action: "created", slug, error });
      }
    }

    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error("Blog sync failed:", error);
    return NextResponse.json({ success: false, error: "Sync failed" }, { status: 500 });
  }
}
