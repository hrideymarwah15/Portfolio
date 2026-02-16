import { getPublishedBlogPosts } from "@/lib/db";
import BlogListClient from "@/components/BlogListClient";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  try {
    const posts = await getPublishedBlogPosts();
    return (
      <main className="min-h-screen bg-[var(--background)]">
        <BlogListClient posts={posts} />
      </main>
    );
  } catch (error) {
    console.error("BlogPage Error:", error);
    return (
      <main className="min-h-screen bg-[var(--background)] p-10 text-red-500">
        <h1>Error loading blog</h1>
        <p>Please try again later.</p>
      </main>
    );
  }
}


