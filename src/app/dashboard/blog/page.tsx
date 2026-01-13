import { getAllBlogPosts } from "@/lib/db";
import BlogManager from "@/components/dashboard/BlogManager";

export const dynamic = "force-dynamic";

export default async function BlogDashboard() {
  const posts = await getAllBlogPosts();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-mono font-bold mb-2">BLOG POSTS</h1>
        <p className="text-gray-600 font-mono">
          Create and manage your blog posts with Markdown support.
        </p>
      </div>

      <BlogManager initialPosts={posts} />
    </div>
  );
}
