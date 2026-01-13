"use client";

import { useState, useTransition } from "react";
import {
  Plus,
  Trash2,
  Save,
  Eye,
  EyeOff,
  Edit,
  FileText,
  Calendar,
  Tag,
  ArrowLeft,
} from "lucide-react";
import {
  createBlogPostAction,
  updateBlogPostAction,
  deleteBlogPostAction,
} from "@/lib/actions";
import type { BlogPost } from "@/lib/db";

interface BlogManagerProps {
  initialPosts: BlogPost[];
}

export default function BlogManager({ initialPosts }: BlogManagerProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleCreate = () => {
    startTransition(async () => {
      const result = await createBlogPostAction({
        title: "Untitled Post",
        slug: `post-${Date.now()}`,
        excerpt: "A brief description of your post...",
        content: "# Your Post Title\n\nStart writing here...",
        tags: [],
      });

      if (result.success && result.post) {
        setPosts([result.post, ...posts]);
        setEditingPost(result.post);
      }
    });
  };

  const handleUpdate = (id: string, data: Partial<BlogPost>) => {
    startTransition(async () => {
      const result = await updateBlogPostAction(id, data);

      if (result.success && result.post) {
        setPosts(posts.map((p) => (p.id === id ? result.post! : p)));
        if (editingPost?.id === id) {
          setEditingPost(result.post);
        }
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this post? This action cannot be undone.")) return;

    startTransition(async () => {
      const result = await deleteBlogPostAction(id);

      if (result.success) {
        setPosts(posts.filter((p) => p.id !== id));
        if (editingPost?.id === id) {
          setEditingPost(null);
        }
      }
    });
  };

  const handlePublish = (id: string) => {
    startTransition(async () => {
      const result = await updateBlogPostAction(id, {
        published: true,
        publishedAt: new Date().toISOString(),
      });

      if (result.success && result.post) {
        setPosts(posts.map((p) => (p.id === id ? result.post! : p)));
        if (editingPost?.id === id) {
          setEditingPost(result.post);
        }
      }
    });
  };

  const handleUnpublish = (id: string) => {
    startTransition(async () => {
      const result = await updateBlogPostAction(id, {
        published: false,
      });

      if (result.success && result.post) {
        setPosts(posts.map((p) => (p.id === id ? result.post! : p)));
        if (editingPost?.id === id) {
          setEditingPost(result.post);
        }
      }
    });
  };

  if (editingPost) {
    return (
      <BlogEditor
        post={editingPost}
        onSave={(data) => handleUpdate(editingPost.id, data)}
        onBack={() => setEditingPost(null)}
        isPending={isPending}
      />
    );
  }

  return (
    <div>
      {/* Actions Bar */}
      <div className="mb-6">
        <button
          onClick={handleCreate}
          disabled={isPending}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white font-mono font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-white hover:text-black hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
        >
          <Plus size={18} />
          NEW POST
        </button>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-mono font-bold text-lg">{post.title}</h3>
                  <span
                    className={`text-xs font-mono px-2 py-0.5 border ${
                      post.published
                        ? "bg-green-100 text-green-700 border-green-300"
                        : "bg-yellow-100 text-yellow-700 border-yellow-300"
                    }`}
                  >
                    {post.published ? "PUBLISHED" : "DRAFT"}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-2">{post.excerpt}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500 font-mono">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString()
                      : "Not published"}
                  </span>
                  <span className="flex items-center gap-1">
                    <FileText size={12} />/{post.slug}
                  </span>
                  {post.tags.length > 0 && (
                    <span className="flex items-center gap-1">
                      <Tag size={12} />
                      {post.tags.join(", ")}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditingPost(post)}
                  className="p-2 border-2 border-black hover:bg-gray-100 transition-colors"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() =>
                    post.published
                      ? handleUnpublish(post.id)
                      : handlePublish(post.id)
                  }
                  disabled={isPending}
                  className={`p-2 border-2 border-black transition-colors ${
                    post.published
                      ? "bg-green-100 text-green-600"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {post.published ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  disabled={isPending}
                  className="p-2 border-2 border-red-300 text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {posts.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <FileText size={48} className="mx-auto mb-4 opacity-50" />
            <p className="font-mono">No blog posts yet. Create your first post!</p>
          </div>
        )}
      </div>
    </div>
  );
}

interface BlogEditorProps {
  post: BlogPost;
  onSave: (data: Partial<BlogPost>) => void;
  onBack: () => void;
  isPending: boolean;
}

function BlogEditor({ post, onSave, onBack, isPending }: BlogEditorProps) {
  const [title, setTitle] = useState(post.title);
  const [slug, setSlug] = useState(post.slug);
  const [excerpt, setExcerpt] = useState(post.excerpt || "");
  const [content, setContent] = useState(post.content);
  const [tags, setTags] = useState(post.tags.join(", "));
  const [coverImage, setCoverImage] = useState(post.coverImage || "");

  const handleSave = () => {
    onSave({
      title,
      slug,
      excerpt: excerpt || undefined,
      content,
      tags: tags.split(",").map((t: string) => t.trim()).filter(Boolean),
      coverImage: coverImage || undefined,
    });
  };

  const generateSlug = () => {
    const newSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setSlug(newSlug);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 font-mono text-gray-600 hover:text-black transition-colors"
        >
          <ArrowLeft size={18} />
          Back to posts
        </button>
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-mono px-2 py-0.5 border ${
              post.published
                ? "bg-green-100 text-green-700 border-green-300"
                : "bg-yellow-100 text-yellow-700 border-yellow-300"
            }`}
          >
            {post.published ? "PUBLISHED" : "DRAFT"}
          </span>
          <button
            onClick={handleSave}
            disabled={isPending}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white font-mono font-bold border-2 border-black hover:bg-white hover:text-black transition-colors"
          >
            <Save size={16} />
            SAVE
          </button>
        </div>
      </div>

      {/* Editor Form */}
      <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-gray-500 uppercase mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border-2 border-black font-mono focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-gray-500 uppercase mb-1">
              Slug
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="flex-1 px-3 py-2 border-2 border-black font-mono focus:outline-none focus:ring-2 focus:ring-black"
              />
              <button
                onClick={generateSlug}
                type="button"
                className="px-3 py-2 border-2 border-black font-mono text-xs hover:bg-gray-100 transition-colors"
              >
                AUTO
              </button>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono text-gray-500 uppercase mb-1">
            Excerpt
          </label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border-2 border-black font-mono focus:outline-none focus:ring-2 focus:ring-black resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-gray-500 uppercase mb-1">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-3 py-2 border-2 border-black font-mono focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="tech, tutorial, react"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-gray-500 uppercase mb-1">
              Cover Image URL
            </label>
            <input
              type="url"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              className="w-full px-3 py-2 border-2 border-black font-mono focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="https://..."
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono text-gray-500 uppercase mb-1">
            Content (Markdown)
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={20}
            className="w-full px-3 py-2 border-2 border-black font-mono focus:outline-none focus:ring-2 focus:ring-black resize-y"
            placeholder="# Your Post Title&#10;&#10;Start writing your post here...&#10;&#10;## Section&#10;&#10;Use markdown for formatting."
          />
        </div>

        <div className="text-xs text-gray-500 font-mono">
          <p>
            Tip: Use Markdown formatting. ## for headings, **bold**, *italic*, 
            `code`, ```code blocks```, [links](url), ![images](url)
          </p>
        </div>
      </div>
    </div>
  );
}
