"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, Tag, Search, X, TrendingUp, Clock, Bell } from "lucide-react";
import type { BlogPost } from "@/lib/types";

interface BlogListClientProps {
  posts: BlogPost[];
}

type SortOption = "newest" | "popular";

export default function BlogListClient({ posts }: BlogListClientProps) {
  if (!posts) {
    return <div>Error: No posts found.</div>;
  }
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [showNotification, setShowNotification] = useState(true);

  // Calculate most recent post
  const latestPost = posts.length > 0 ? posts[0] : null;
  const isNewPost = latestPost && new Date(latestPost.publishedAt || "").getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000;

  // Filter and sort posts
  const filteredPosts = useMemo(() => {
    let filtered = posts.filter((post) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        post.title.toLowerCase().includes(searchLower) ||
        (post.excerpt && post.excerpt.toLowerCase().includes(searchLower)) ||
        (post.tags && post.tags.some((tag) => tag.toLowerCase().includes(searchLower)))
      );
    });

    // Sort posts
    if (sortBy === "popular") {
      // Sort by view count or default to newest
      filtered = [...filtered].sort((a, b) => {
        // For now, use creation date as proxy for popularity
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    } else {
      // newest
      filtered = [...filtered].sort((a, b) => {
        const dateA = new Date(a.publishedAt || a.createdAt).getTime();
        const dateB = new Date(b.publishedAt || b.createdAt).getTime();
        return dateB - dateA;
      });
    }

    return filtered;
  }, [posts, searchQuery, sortBy]);

  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-mono font-bold mb-4 text-[var(--foreground)]">BLOG</h1>
        <p className="text-[var(--muted)] font-mono">
          Thoughts on software development, technology, and building things.
        </p>
      </div>

      {/* New Post Notification - Sticky note style (never themed) */}
      {isNewPost && showNotification && (
        <div className="sticky-note mb-8 p-4 relative">
          <button
            onClick={() => setShowNotification(false)}
            className="absolute top-2 right-2 p-1 hover:bg-black hover:text-white transition-colors"
            aria-label="Close notification"
          >
            <X size={16} />
          </button>
          <div className="flex items-start gap-3">
            <Bell size={20} className="mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-mono font-bold mb-1">New Post Alert! 🎉</p>
              <Link
                href={`/blog/${latestPost.slug}`}
                className="text-sm hover:underline"
              >
                {latestPost.title}
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Search and Sort Controls */}
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]"
          />
          <input
            type="text"
            placeholder="Search posts by title, content, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-12 py-3 border-2 border-[var(--border)] bg-[var(--input-bg)] text-[var(--foreground)] font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[var(--border)] placeholder:text-[var(--muted)]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-[var(--card-hover)] rounded text-[var(--foreground)]"
              aria-label="Clear search"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Sort Buttons */}
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm text-[var(--muted)]">Sort by:</span>
          <button
            onClick={() => setSortBy("newest")}
            className={`flex items-center gap-2 px-4 py-2 font-mono font-bold text-sm border-2 border-[var(--border)] transition-all shadow-hard-sm ${
              sortBy === "newest"
                ? "bg-[var(--foreground)] text-[var(--background)]"
                : "bg-[var(--background)] text-[var(--foreground)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
            }`}
          >
            <Clock size={14} />
            NEWEST
          </button>
          <button
            onClick={() => setSortBy("popular")}
            className={`flex items-center gap-2 px-4 py-2 font-mono font-bold text-sm border-2 border-[var(--border)] transition-all shadow-hard-sm ${
              sortBy === "popular"
                ? "bg-[var(--foreground)] text-[var(--background)]"
                : "bg-[var(--background)] text-[var(--foreground)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
            }`}
          >
            <TrendingUp size={14} />
            POPULAR
          </button>
        </div>

        {/* Results Count */}
        {searchQuery && (
          <p className="font-mono text-sm text-[var(--muted)]">
            Found {filteredPosts.length} {filteredPosts.length === 1 ? "post" : "posts"}
          </p>
        )}
      </div>

      {/* Posts List */}
      <div className="space-y-8">
        {filteredPosts.map((post) => (
          <article
            key={post.id}
            className="group bg-[var(--card-bg)] border-2 border-[var(--border)] shadow-hard hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-hard-sm transition-all"
          >
            <Link href={`/blog/${post.slug}`} className="block p-6">
              {post.coverImage && (
                <div className="mb-4 -mx-6 -mt-6 border-b-2 border-[var(--border)] overflow-hidden relative h-48">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              )}
              <div className="flex items-center gap-4 text-xs text-[var(--muted)] font-mono mb-3">
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
                {post.tags && post.tags.length > 0 && (
                  <span className="flex items-center gap-1">
                    <Tag size={12} />
                    {post.tags.join(", ")}
                  </span>
                )}
              </div>
              <h2 className="text-xl md:text-2xl font-mono font-bold mb-2 text-[var(--foreground)] group-hover:underline">
                {post.title}
              </h2>
              <p className="text-[var(--muted)] mb-4">{post.excerpt}</p>
              <span className="inline-flex items-center gap-2 font-mono text-sm font-bold text-[var(--foreground)] group-hover:gap-3 transition-all">
                READ MORE <ArrowRight size={16} />
              </span>
            </Link>
          </article>
        ))}

        {filteredPosts.length === 0 && (
          <div className="text-center py-16 border-2 border-dashed border-[var(--muted)]">
            <p className="font-mono text-[var(--muted)] mb-4">
              {searchQuery
                ? `No posts found matching "${searchQuery}"`
                : "No blog posts yet."}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="font-mono text-sm px-4 py-2 border-2 border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
