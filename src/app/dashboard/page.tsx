import { getAnalyticsSummary } from "@/lib/analytics";
import { getAllProjects, getAllBlogPosts, getAvailability } from "@/lib/db";
import { Eye, Users, FileText, Briefcase } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [analytics, projects, blogPosts, availability] = await Promise.all([
    getAnalyticsSummary(30),
    getAllProjects(),
    getAllBlogPosts(),
    getAvailability(),
  ]);

  const stats = [
    {
      label: "Page Views (30d)",
      value: analytics.totalPageViews.toLocaleString(),
      icon: Eye,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Unique Visitors",
      value: analytics.uniqueVisitors.toLocaleString(),
      icon: Users,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Blog Posts",
      value: blogPosts.length.toString(),
      icon: FileText,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Total Projects",
      value: projects.length.toString(),
      icon: Briefcase,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-mono font-bold text-3xl mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your portfolio.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 ${stat.bg} border border-black`}>
                <stat.icon className={stat.color} size={20} />
              </div>
              <div>
                <p className="text-xs font-mono text-gray-500 uppercase">{stat.label}</p>
                <p className="text-2xl font-mono font-bold">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Availability Status */}
      <div className="mb-8">
        <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-mono font-bold text-lg mb-1">Availability Status</h2>
              <p className="text-sm text-gray-600">{availability?.message ?? "Available for new opportunities"}</p>
            </div>
            <div className={`px-4 py-2 border-2 border-black font-mono font-bold text-sm ${
              availability?.isAvailable
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}>
              {availability?.isAvailable ? "AVAILABLE" : "UNAVAILABLE"}
            </div>
          </div>
          <Link
            href="/dashboard/content"
            className="inline-block mt-4 text-sm font-mono text-gray-500 hover:text-black transition-colors"
          >
            Change status →
          </Link>
        </div>
      </div>

      {/* Quick Links Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-mono font-bold text-lg">Recent Projects</h2>
            <Link
              href="/dashboard/projects"
              className="text-sm font-mono text-gray-500 hover:text-black transition-colors"
            >
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {projects.slice(0, 4).map((project) => (
              <div
                key={project.id}
                className="flex items-center justify-between p-3 border border-dashed border-gray-300 hover:border-black transition-colors"
              >
                <div>
                  <p className="font-mono font-bold text-sm">{project.title}</p>
                  <p className="text-xs text-gray-500">{project.tag}</p>
                </div>
                <span className={`text-xs font-mono ${project.isVisible ? "text-green-600" : "text-gray-400"}`}>
                  {project.isVisible ? "VISIBLE" : "HIDDEN"}
                </span>
              </div>
            ))}
            {projects.length === 0 && (
              <p className="text-gray-500 text-sm text-center py-4">No projects yet</p>
            )}
          </div>
        </div>

        {/* Recent Blog Posts */}
        <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-mono font-bold text-lg">Recent Blog Posts</h2>
            <Link
              href="/dashboard/blog"
              className="text-sm font-mono text-gray-500 hover:text-black transition-colors"
            >
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {blogPosts.slice(0, 4).map((post) => (
              <div
                key={post.id}
                className="flex items-center justify-between p-3 border border-dashed border-gray-300 hover:border-black transition-colors"
              >
                <div>
                  <p className="font-mono font-bold text-sm">{post.title}</p>
                  <p className="text-xs text-gray-500">
                    {post.publishedAt 
                      ? new Date(post.publishedAt).toLocaleDateString()
                      : "Draft"}
                  </p>
                </div>
                <span className={`text-xs font-mono ${post.published ? "text-green-600" : "text-gray-400"}`}>
                  {post.published ? "PUBLISHED" : "DRAFT"}
                </span>
              </div>
            ))}
            {blogPosts.length === 0 && (
              <p className="text-gray-500 text-sm text-center py-4">No blog posts yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Top Pages */}
      {analytics.topPages.length > 0 && (
        <div className="mt-6 bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="font-mono font-bold text-lg mb-4">Top Pages (30 days)</h2>
          <div className="space-y-2">
            {analytics.topPages.slice(0, 5).map((page, index) => (
              <div
                key={page.page}
                className="flex items-center justify-between p-2 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-gray-400 text-sm w-6">{index + 1}.</span>
                  <span className="font-mono text-sm">{page.page}</span>
                </div>
                <span className="font-mono text-sm text-gray-600">{page.count} views</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
