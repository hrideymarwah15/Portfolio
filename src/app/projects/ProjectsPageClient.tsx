"use client";

import { motion } from "framer-motion";
import ProjectsSection, { ProjectItem } from "@/components/ProjectsSection";

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

interface ProjectsPageClientProps {
    projects: Project[];
}

export default function ProjectsPageClient({ projects }: ProjectsPageClientProps) {
    const projectsForSection: ProjectItem[] = projects.map((p) => ({
        title: p.title,
        problem: p.problem,
        outcome: p.outcome,
        tag: p.tag,
        tagColor: p.tagColor,
        link: p.link || undefined,
    }));

    return (
        <main className="min-h-screen bg-white text-black pt-24 pb-16">
            {/* Grid Background */}
            <div
                className="fixed inset-0 pointer-events-none opacity-[0.03]"
                style={{
                    backgroundImage:
                        "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
                    backgroundSize: "30px 30px",
                }}
            />

            <div className="relative z-10 px-6">
                <div className="max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-4 block">
              // WORK
                        </span>
                        <h1 className="font-mono font-bold text-4xl md:text-5xl tracking-tighter mb-10">
                            PROJECTS
                        </h1>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        <ProjectsSection projects={projectsForSection} githubRepos={[]} />
                    </motion.div>
                </div>
            </div>
        </main>
    );
}
