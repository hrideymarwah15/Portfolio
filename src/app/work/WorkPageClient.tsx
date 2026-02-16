"use client";

import { motion } from "framer-motion";
import TechStackSection from "@/components/TechStackSection";
import ProjectsSection, { ProjectItem } from "@/components/ProjectsSection";
import GitHubStatsSection from "@/components/GitHubStatsSection";
import ProblemSolvingSection from "@/components/ProblemSolvingSection";

interface Project {
    id: string;
    title: string;
    problem: string;
    outcome: string;
    tag: string;
    tagColor: string;
    link: string | null;
    githubRepo: string | null;
    githubStars: number | null;
}

interface WorkPageClientProps {
    skills: string[];
    projects: Project[];
    githubUsername: string;
    leetcodeUsername: string;
}

// ScrollEntrance for scroll-triggered animations
function ScrollEntrance({
    children,
    delay = 0,
}: {
    children: React.ReactNode;
    delay?: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay }}
        >
            {children}
        </motion.div>
    );
}

export default function WorkPageClient({
    skills,
    projects,
    githubUsername,
    leetcodeUsername,
}: WorkPageClientProps) {
    const projectsForSection: ProjectItem[] = projects.map((p) => ({
        title: p.title,
        problem: p.problem,
        outcome: p.outcome,
        tag: p.tag,
        tagColor: p.tagColor,
        link: p.link || undefined,
    }));

    return (
        <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
            {/* Grid Background */}
            <div
                className="fixed inset-0 pointer-events-none opacity-[0.03]"
                style={{
                    backgroundImage:
                        "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
                    backgroundSize: "30px 30px",
                }}
            />

            <div className="relative z-10">
                {/* Skills Section */}
                <section id="skills" className="px-6 py-24 pt-32">
                    <div className="max-w-5xl mx-auto">
                        <ScrollEntrance>
                            <span className="text-xs font-mono text-[var(--muted)] uppercase tracking-widest mb-4 block">
                                // STACK
                            </span>
                            <h1 className="font-mono font-bold text-4xl md:text-5xl tracking-tighter mb-10 text-[var(--foreground)]">
                                WHAT I WORK WITH
                            </h1>
                            <TechStackSection skills={skills} />
                        </ScrollEntrance>
                    </div>
                </section>

                {/* Projects Section */}
                <section id="projects" className="px-6 py-24 border-t border-dashed border-[var(--muted)]">
                    <div className="max-w-5xl mx-auto">
                        <ScrollEntrance>
                            <span className="text-xs font-mono text-[var(--muted)] uppercase tracking-widest mb-4 block">
                                // WORK
                            </span>
                            <h2 className="font-mono font-bold text-4xl md:text-5xl tracking-tighter mb-10 text-[var(--foreground)]">
                                PROJECTS
                            </h2>
                            <ProjectsSection projects={projectsForSection} githubRepos={[]} />
                        </ScrollEntrance>
                    </div>
                </section>

                {/* Activity Section */}
                <section id="activity" className="px-6 py-24 border-t border-dashed border-[var(--muted)]">
                    <div className="max-w-5xl mx-auto space-y-16">
                        {/* GitHub Activity */}
                        <ScrollEntrance>
                            <div>
                                <span className="text-xs font-mono text-[var(--muted)] uppercase tracking-widest mb-4 block">
                                    // GITHUB
                                </span>
                                <h2 className="font-mono font-bold text-4xl md:text-5xl tracking-tighter mb-10 text-[var(--foreground)]">
                                    CONTRIBUTION ACTIVITY
                                </h2>
                                <GitHubStatsSection username={githubUsername} />
                            </div>
                        </ScrollEntrance>

                        {/* Problem Solving Activity */}
                        <ScrollEntrance delay={0.2}>
                            <div>
                                <span className="text-xs font-mono text-[var(--muted)] uppercase tracking-widest mb-4 block">
                                    // LEETCODE
                                </span>
                                <h2 className="font-mono font-bold text-4xl md:text-5xl tracking-tighter mb-10 text-[var(--foreground)]">
                                    PROBLEM SOLVING
                                </h2>
                                <ProblemSolvingSection username={leetcodeUsername} />
                            </div>
                        </ScrollEntrance>
                    </div>
                </section>

                {/* Footer */}
                <footer className="px-6 py-10 border-t-2 border-[var(--border)] bg-[var(--background)]">
                    <div className="max-w-5xl mx-auto flex justify-between items-center font-mono text-xs text-[var(--muted)]">
                        <span>© {new Date().getFullYear()} Hridey Marwah</span>
                        <span>NEXT.JS + TAILWIND</span>
                    </div>
                </footer>
            </div>
        </main>
    );
}
