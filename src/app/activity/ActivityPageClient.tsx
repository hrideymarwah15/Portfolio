"use client";

import { motion } from "framer-motion";
import GitHubStatsSection from "@/components/GitHubStatsSection";
import ProblemSolvingSection from "@/components/ProblemSolvingSection";

interface ActivityPageClientProps {
    githubUsername: string;
    leetcodeUsername: string;
}

export default function ActivityPageClient({
    githubUsername,
    leetcodeUsername
}: ActivityPageClientProps) {
    return (
        <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-24 pb-16">
            {/* Grid Background */}
            <div
                className="fixed inset-0 pointer-events-none opacity-[0.03]"
                style={{
                    backgroundImage:
                        "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
                    backgroundSize: "30px 30px",
                }}
            />

            <div className="relative z-10 px-6">
                <div className="max-w-5xl mx-auto space-y-16">
                    {/* GitHub Activity */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="text-xs font-mono text-[var(--muted)] uppercase tracking-widest mb-4 block">
              // GITHUB
                        </span>
                        <h1 className="font-mono font-bold text-4xl md:text-5xl tracking-tighter mb-10 text-[var(--foreground)]">
                            CONTRIBUTION ACTIVITY
                        </h1>

                        <GitHubStatsSection username={githubUsername} />
                    </motion.section>

                    {/* Problem Solving Activity */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <span className="text-xs font-mono text-[var(--muted)] uppercase tracking-widest mb-4 block">
              // LEETCODE
                        </span>
                        <h2 className="font-mono font-bold text-4xl md:text-5xl tracking-tighter mb-10 text-[var(--foreground)]">
                            PROBLEM SOLVING
                        </h2>

                        <ProblemSolvingSection username={leetcodeUsername} />
                    </motion.section>
                </div>
            </div>
        </main>
    );
}
