"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowRight, Calendar, Tag, Search, X, TrendingUp, Clock, Bell } from "lucide-react";
import type { BlogPost } from "@/lib/db";

interface BlogListClientProps {
  posts: BlogPost[];
}

type SortOption = "newest" | "popular";

export default function BlogListClient({ posts }: BlogListClientProps) {
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
        post.excerpt?.toLowerCase().includes(searchLower) ||
        post.tags.some((tag) => tag.toLowerCase().includes(searchLower))
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
        <h1 className="text-4xl md:text-5xl font-mono font-bold mb-4">BLOG</h1>
        <p className="text-gray-600 font-mono">
          Thoughts on software development, technology, and building things.
        </p>
      </div>

      {/* New Post Notification */}
      {isNewPost && showNotification && (
        <div className="mb-8 p-4 border-2 border-black bg-yellow-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative">
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
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search posts by title, content, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-12 py-3 border-2 border-black font-mono text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
              aria-label="Clear search"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Sort Buttons */}
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm text-gray-600">Sort by:</span>
          <button
            onClick={() => setSortBy("newest")}
            className={`flex items-center gap-2 px-4 py-2 font-mono font-bold text-sm border-2 border-black transition-all ${
              sortBy === "newest"
                ? "bg-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                : "bg-white text-black hover:translate-x-[2px] hover:translate-y-[2px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            }`}
          >
            <Clock size={14} />
            NEWEST
          </button>
          <button
            onClick={() => setSortBy("popular")}
            className={`flex items-center gap-2 px-4 py-2 font-mono font-bold text-sm border-2 border-black transition-all ${
              sortBy === "popular"
                ? "bg-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                : "bg-white text-black hover:translate-x-[2px] hover:translate-y-[2px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            }`}
          >
            <TrendingUp size={14} />
            POPULAR
          </button>
        </div>

        {/* Results Count */}
        {searchQuery && (
          <p className="font-mono text-sm text-gray-600">
            Found {filteredPosts.length} {filteredPosts.length === 1 ? "post" : "posts"}
          </p>
        )}
      </div>

      {/* Posts List */}
      <div className="space-y-8">
        {filteredPosts.map((post) => (
          <article
            key={post.id}
            className="group bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            <Link href={`/blog/${post.slug}`} className="block p-6">
              {post.coverImage && (
                <div className="mb-4 -mx-6 -mt-6 border-b-2 border-black overflow-hidden">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                </div>
              )}
              <div className="flex items-center gap-4 text-xs text-gray-500 font-mono mb-3">
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
              <h2 className="text-xl md:text-2xl font-mono font-bold mb-2 group-hover:underline">
                {post.title}
              </h2>
              <p className="text-gray-600 mb-4">{post.excerpt}</p>
              <span className="inline-flex items-center gap-2 font-mono text-sm font-bold group-hover:gap-3 transition-all">
                READ MORE <ArrowRight size={16} />
              </span>
            </Link>
          </article>
        ))}

        {filteredPosts.length === 0 && (
          <div className="text-center py-16 border-2 border-dashed border-gray-300">
            <p className="font-mono text-gray-500 mb-4">
              {searchQuery
                ? `No posts found matching "${searchQuery}"`
                : "No blog posts yet."}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="font-mono text-sm px-4 py-2 border-2 border-black bg-white hover:bg-black hover:text-white transition-colors"
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
