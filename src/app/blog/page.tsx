import { getPublishedBlogPosts } from "@/lib/db";
import BlogListClient from "@/components/BlogListClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Blog | Hridey Marwah",
  description: "Thoughts on software development, technology, and more.",
};

export default async function BlogPage() {
  const posts = await getPublishedBlogPosts();

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <BlogListClient posts={posts} />
    </main>
  );
}

