"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { GitCommit, GitBranch, Github } from "lucide-react";

interface Commit {
  sha: string;
  message: string;
  date: string;
  repo: string;
  url: string;
}

export default function BuildLogs() {
  const [commits, setCommits] = useState<Commit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCommits() {
      try {
        const res = await fetch("/api/github/stats");
        const data = await res.json();
        setCommits(data.commits || []);
      } catch (err) {
        console.error("Failed to fetch build logs", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCommits();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-[var(--accent)] rounded border border-[var(--border)]" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <GitBranch className="text-[var(--foreground)]" size={20} />
        <h3 className="font-mono font-bold text-lg">Engineering Velocity</h3>
      </div>

      <div className="relative border-l-2 border-dashed border-[var(--muted)] ml-3 space-y-8 pl-6 pb-2">
        {commits.map((commit, index) => (
          <div key={commit.sha} className="relative group">
             {/* Timeline dot */}
            <div className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-[var(--background)] border-2 border-[var(--foreground)] group-hover:bg-[var(--foreground)] transition-colors" />
            
            <div className="bg-[var(--background)] border-2 border-[var(--border)] p-4 shadow-hard hover:shadow-hard-sm transition-all hover:translate-x-1 hover:translate-y-1 rounded-sm">
                <div className="flex justify-between items-start mb-1">
                    <span className="font-mono text-xs font-bold bg-[var(--accent)] px-2 py-0.5 border border-[var(--border)] rounded">
                        {commit.repo}
                    </span>
                    <span className="font-mono text-xs text-[var(--muted)]">
                        {formatDistanceToNow(new Date(commit.date), { addSuffix: true })}
                    </span>
                </div>
                
                <h4 className="font-bold text-sm mb-1 line-clamp-2">
                    {commit.message}
                </h4>
                
                <div className="flex items-center gap-2 mt-2">
                    <a 
                        href={commit.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs font-mono text-[var(--muted)] hover:text-[var(--foreground)] transition-colors hover:underline"
                    >
                        <GitCommit size={12} />
                        {commit.sha.substring(0, 7)}
                    </a>
                </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-center mt-4">
        <a 
            href="https://github.com/hrideymarwah15" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-[var(--background)] border-2 border-[var(--border)] font-mono text-xs hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-colors shadow-hard-sm"
        >
            <Github size={14} />
            View Full History
        </a>
      </div>
    </div>
  );
}
