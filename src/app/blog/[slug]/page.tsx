import { getBlogPostBySlug, getPublishedBlogPosts } from "@/lib/db";
import { marked } from "marked";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Tag, ArrowLeft } from "lucide-react";

// Use dynamic rendering since this page depends on database
export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: `${post.title} | Blog`,
    description: post.excerpt,
  };
}

// Removed generateStaticParams - using dynamic rendering instead

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post || !post.published) {
    notFound();
  }

  // Configure marked for safe HTML rendering
  marked.setOptions({
    gfm: true,
    breaks: true,
  });

  const htmlContent = await marked(post.content);

  return (
    <main className="min-h-screen bg-white">
      <article className="max-w-3xl mx-auto px-6 py-20">
        {/* Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 font-mono text-sm text-gray-500 hover:text-black transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          Back to blog
        </Link>

        {/* Cover Image */}
        {post.coverImage && (
          <div className="mb-8 -mx-6 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-64 md:h-80 object-cover"
            />
          </div>
        )}

        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 font-mono mb-4">
            {post.publishedAt && (
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            )}
            {post.tags.length > 0 && (
              <span className="flex items-center gap-1">
                <Tag size={12} />
                {post.tags.join(", ")}
              </span>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-mono font-bold mb-4">
            {post.title}
          </h1>
          <p className="text-lg text-gray-600">{post.excerpt}</p>
        </header>

        {/* Content */}
        <div
          className="prose prose-lg max-w-none font-mono
            prose-headings:font-mono prose-headings:font-bold
            prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
            prose-p:text-gray-700 prose-p:leading-relaxed
            prose-a:text-black prose-a:underline hover:prose-a:no-underline
            prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
            prose-pre:bg-gray-900 prose-pre:text-white prose-pre:border-2 prose-pre:border-black prose-pre:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
            prose-img:border-2 prose-img:border-black prose-img:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
            prose-blockquote:border-l-4 prose-blockquote:border-black prose-blockquote:bg-gray-50 prose-blockquote:italic
            prose-ul:list-disc prose-ol:list-decimal
            prose-li:text-gray-700
          "
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t-2 border-dashed border-gray-200">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 font-mono text-sm font-bold hover:underline"
          >
            <ArrowLeft size={16} />
            Back to all posts
          </Link>
        </footer>
      </article>
    </main>
  );
}
