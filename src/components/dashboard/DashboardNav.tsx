"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  BarChart3,
  Settings,
  LogOut,
  ExternalLink,
  User,
  Shield,
  MessageSquare,
} from "lucide-react";

interface DashboardNavProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/content", label: "Content", icon: Settings },
  { href: "/dashboard/projects", label: "Projects", icon: Briefcase },
  { href: "/dashboard/blog", label: "Blog", icon: FileText },
  { href: "/dashboard/messages", label: "Messages", icon: MessageSquare },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/diagnostics", label: "Diagnostics", icon: Shield },
];

export default function DashboardNav({ user }: DashboardNavProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <nav className="fixed left-0 top-0 h-screen w-64 bg-white border-r-2 border-black flex flex-col">
      {/* Header */}
      <div className="p-6 border-b-2 border-black">
        <h1 className="font-mono font-bold text-lg">DASHBOARD</h1>
        <p className="text-xs text-gray-500 font-mono mt-1">Admin Panel</p>
      </div>

      {/* Nav Items */}
      <div className="flex-1 py-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-6 py-3 font-mono text-sm transition-all ${isActive
                ? "bg-black text-white"
                : "text-gray-600 hover:bg-gray-100 hover:text-black"
                }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* View Site Link */}
      <div className="px-4 py-2">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 text-sm font-mono text-gray-500 hover:text-black transition-colors"
        >
          <ExternalLink size={14} />
          View Site
        </a>
      </div>

      {/* User Section */}
      <div className="p-4 border-t-2 border-black">
        <div className="flex items-center gap-3 mb-3">
          {user.image ? (
            <img
              src={user.image}
              alt={user.name || "User"}
              className="w-8 h-8 rounded-full border border-black"
            />
          ) : (
            <div className="w-8 h-8 bg-gray-100 border border-black flex items-center justify-center">
              <User size={14} />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-mono text-sm font-bold truncate">
              {user.name || "Admin"}
            </p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm font-mono text-red-600 hover:bg-red-50 transition-colors border border-transparent hover:border-red-200"
        >
          <LogOut size={14} />
          Sign Out
        </button>
      </div>
    </nav>
  );
}
