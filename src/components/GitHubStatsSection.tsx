"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GitCommit, GitPullRequest, Building2, FolderGit2 } from "lucide-react";
import Image from "next/image";

interface ContributionDay {
  contributionCount: number;
  date: string;
  color: string;
}

interface ContributionWeek {
  contributionDays: ContributionDay[];
}

interface Organization {
  name: string;
  avatarUrl: string;
  url: string;
}

interface GitHubStats {
  totalContributions: number;
  totalPullRequests: number;
  totalRepositories: number;
  followers: number;
  organizations: Organization[];
  contributionCalendar: {
    totalContributions: number;
    weeks: ContributionWeek[];
  };
}

interface GitHubStatsSectionProps {
  username: string;
}

// Map contribution count to intensity class using specific grayscale values
const getIntensityClass = (count: number): string => {
  if (count === 0) return "bg-white border-black/10";
  if (count <= 3) return "bg-neutral-300 border-neutral-400/20";
  if (count <= 6) return "bg-neutral-500 border-neutral-600/20";
  if (count <= 9) return "bg-neutral-700 border-neutral-800/20";
  return "bg-black border-black/20";
};

export default function GitHubStatsSection({ username }: GitHubStatsSectionProps) {
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`/api/github/stats?username=${username}`);
        if (!response.ok) {
          throw new Error("Failed to fetch stats");
        }
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load GitHub stats");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [username]);

  if (loading) {
    return (
      <div
        className="bg-[var(--background)] border-2 border-[var(--border)] p-8 shadow-hard"
        style={{ borderRadius: "3px 15px 5px 15px / 15px 5px 15px 5px" }}
      >
        <div className="flex items-center justify-center gap-3 font-mono text-[var(--muted)]">
          <motion.div
            className="w-4 h-4 border-2 border-[var(--foreground)] border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          LOADING GITHUB STATS...
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div
        className="bg-[var(--background)] border-2 border-[var(--border)] p-8 shadow-hard"
        style={{ borderRadius: "3px 15px 5px 15px / 15px 5px 15px 5px" }}
      >
        <div className="text-center font-mono text-[var(--muted)]">
          <p className="text-sm">{error || "Unable to load GitHub stats"}</p>
        </div>
      </div>
    );
  }

  const statItems = [
    {
      label: "TOTAL CONTRIBUTIONS",
      value: stats.totalContributions.toLocaleString(),
      icon: GitCommit,
    },
    {
      label: "REPOSITORIES",
      value: stats.totalRepositories.toLocaleString(),
      icon: FolderGit2,
    },
     {
      label: "FOLLOWERS",
      value: stats.followers.toLocaleString(),
      icon: Building2,
    },
    {
        label: "PULL REQUESTS",
        value: stats.totalPullRequests.toLocaleString(),
        icon: GitPullRequest,
    },
  ];

  // Get contributions
  const weeks = stats.contributionCalendar.weeks;

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="p-6 border-2 border-[var(--border)] bg-[var(--accent)] shadow-hard"
        style={{ borderRadius: "3px 15px 5px 15px / 15px 5px 15px 5px" }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statItems.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, type: "spring", bounce: 0.4 }}
              className="text-center p-4 border border-dashed border-[var(--muted)] bg-[var(--background)] group hover:border-solid hover:border-[var(--border)] transition-all duration-200"
            >
              <stat.icon
                className="w-5 h-5 mx-auto mb-2 text-[var(--foreground)] group-hover:scale-110 transition-transform"
              />
              <div className="text-[10px] font-mono text-[var(--muted)] uppercase tracking-wider mb-1">
                {stat.label}
              </div>
              <div className="text-2xl font-mono font-black text-[var(--foreground)]">
                {stat.value}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Contribution Graph */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative bg-[var(--background)] border-2 border-[var(--border)] p-6 shadow-hard overflow-hidden"
        style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}
      >
        {/* Tape decoration */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-gray-200/80 rotate-[-1deg] border border-gray-300 z-10" />

        <h3 className="font-mono font-bold text-sm uppercase tracking-widest text-[var(--muted)] mb-4">
          // CONTRIBUTION GRAPH
        </h3>

        <div className="overflow-x-auto pb-2">
          <div className="flex gap-[3px] min-w-fit">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-[3px]">
                {week.contributionDays.map((day, dayIndex) => (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className={`w-3 h-3 border ${getIntensityClass(day.contributionCount)} hover:ring-2 hover:ring-[var(--foreground)] hover:ring-offset-1 transition-all cursor-default`}
                    style={{ borderRadius: "2px" }}
                    title={`${day.date}: ${day.contributionCount} contributions`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-end gap-2 mt-4 font-mono text-xs text-[var(--muted)]">
          <span>LESS</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 bg-white border border-black/10" style={{ borderRadius: "2px" }} />
            <div className="w-3 h-3 bg-neutral-300 border border-neutral-400/20" style={{ borderRadius: "2px" }} />
            <div className="w-3 h-3 bg-neutral-500 border border-neutral-600/20" style={{ borderRadius: "2px" }} />
            <div className="w-3 h-3 bg-neutral-700 border border-neutral-800/20" style={{ borderRadius: "2px" }} />
            <div className="w-3 h-3 bg-black border border-black/20" style={{ borderRadius: "2px" }} />
          </div>
          <span>MORE</span>
        </div>
      </motion.div>

      {/* Organizations */}
      {stats.organizations && stats.organizations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-[var(--background)] border-2 border-[var(--border)] p-6 shadow-hard"
          style={{ borderRadius: "20px 15px 20px 15px" }}
        >
          <h3 className="font-mono font-bold text-sm uppercase tracking-widest text-[var(--muted)] mb-4">
            // ORGANIZATIONS CONTRIBUTED TO
          </h3>

          <div className="flex flex-wrap gap-4">
            {stats.organizations.map((org, index) => (
              <motion.a
                key={org.name}
                href={org.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4, rotate: 1 }}
                className="flex items-center gap-3 px-4 py-2 border-2 border-[var(--border)] bg-[var(--background)] shadow-hard-sm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
              >


                <Image
                  src={org.avatarUrl}
                  alt={org.name}
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full border-2 border-[var(--border)] grayscale hover:grayscale-0 transition-all"
                />
                <span className="font-mono font-bold text-sm text-[var(--foreground)]">{org.name}</span>
              </motion.a>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
