"use client";

import { motion } from "framer-motion";
import { Activity, Code2, GitCommit, Layers, Terminal, Cpu, Database, Server } from "lucide-react";

interface SystemDashboardClientProps {
  githubStats: any;
  // Add other props as we implement more services
}

export default function SystemDashboardClient({ githubStats }: SystemDashboardClientProps) {
  // Mock data for "Now Learning" - eventually fetch from DB
  const learningStack = [
    { name: "Rust", progress: 65, icon: Terminal },
    { name: "System Design", progress: 80, icon: Layers },
    { name: "Kubernetes", progress: 40, icon: Server },
  ];

  const systemMetrics = [
    { label: "UPTIME", value: "99.9%", status: "good" },
    { label: "LATENCY", value: "24ms", status: "good" },
    { label: "ERROR RATE", value: "0.00%", status: "good" },
    { label: "DEPLOY", value: "v2.1.0", status: "neutral" },
  ];

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="border-b-2 border-dashed border-[var(--muted)] pb-8">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-5 h-5 text-yellow-500" />
            <h1 className="font-mono text-xl font-bold tracking-tight">ENGINEERING_DASHBOARD</h1>
          </div>
          <p className="text-[var(--muted)] font-mono text-sm max-w-2xl">
            // LIVE SYSTEM METRICS AND ENGINEERING ACTIVITY
          </p>
        </div>

        {/* System Status Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {systemMetrics.map((metric) => (
            <div
              key={metric.label}
              className="p-4 border-2 border-[var(--border)] bg-[var(--accent)] shadow-hard"
              style={{ borderRadius: "2px" }}
            >
              <div className="text-[10px] font-mono text-[var(--muted)] mb-1">{metric.label}</div>
              <div className="font-mono font-bold text-xl">{metric.value}</div>
              <div className="mt-2 flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    metric.status === "good" ? "bg-green-500" : "bg-gray-400"
                  }`}
                />
                <span className="text-[10px] font-mono opacity-60">OPERATIONAL</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* GitHub Activity - Uses the data passed from server */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="font-mono font-bold text-lg flex items-center gap-2">
              <GitCommit className="w-5 h-5" />
              ACTIVITY_LOG
            </h2>
            <div
              className="border-2 border-[var(--border)] p-6 bg-[var(--background)] shadow-hard"
              style={{ borderRadius: "4px" }}
            >
               {/* Reusing/Adapting the graph logic here or importing a shared component */}
               {/* For now, placeholder for the detailed graph we'll port over */}
               <div className="h-64 flex items-center justify-center border border-dashed border-[var(--muted)] bg-neutral-50/50">
                  <span className="font-mono text-sm text-[var(--muted)]">GITHUB CONTRIBUTION GRAPH COMPONENT</span>
               </div>
               <div className="mt-6 grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-black font-mono">{githubStats?.totalContributions || 0}</div>
                    <div className="text-xs font-mono text-[var(--muted)]">YEAR_CONTRIBUTIONS</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-black font-mono">{githubStats?.totalPullRequests || 0}</div>
                    <div className="text-xs font-mono text-[var(--muted)]">PULL_REQUESTS</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-black font-mono">{githubStats?.totalRepositories || 0}</div>
                    <div className="text-xs font-mono text-[var(--muted)]">REPOSITORIES</div>
                  </div>
               </div>
            </div>
          </div>

          {/* Right Column: Learning & Stack */}
          <div className="space-y-6">
            <h2 className="font-mono font-bold text-lg flex items-center gap-2">
              <Cpu className="w-5 h-5" />
              ACTIVE_LEARNING
            </h2>
            <div className="space-y-4">
              {learningStack.map((item) => (
                <div
                  key={item.name}
                  className="border-2 border-[var(--border)] p-4 bg-[var(--background)] shadow-hard hover:translate-x-1 transition-transform"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2 font-mono font-bold">
                      <item.icon className="w-4 h-4" />
                      {item.name}
                    </div>
                    <span className="text-xs font-mono">{item.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden border border-black/10">
                    <div
                      className="h-full bg-[var(--foreground)]"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Current Stack Snapshot */}
            <div className="border-2 border-[var(--border)] p-5 bg-[var(--accent)] mt-8">
               <h3 className="font-mono text-xs font-bold mb-4 uppercase">System Architecture</h3>
               <div className="space-y-2 font-mono text-sm">
                  <div className="flex justify-between">
                    <span className="text-[var(--muted)]">Frontend</span>
                    <span>Next.js 14</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--muted)]">Backend</span>
                    <span>Supabase</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--muted)]">Database</span>
                    <span>Postgres</span>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
