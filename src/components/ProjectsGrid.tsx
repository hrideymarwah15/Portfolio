"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import Image from "next/image";

export interface ProjectGridItem {
    id: string;
    title: string;
    description: string;
    image: string;
    link?: string;
    github?: string;
    tags?: string[];
}

interface ProjectsGridProps {
    projects: ProjectGridItem[];
}

// Project card with hover effects like Naresh's - dark mode support
function ProjectCard({ project, index }: { project: ProjectGridItem; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative"
        >
            {/* Card - Naresh style with dark mode */}
            <motion.div
                className="relative overflow-hidden rounded-2xl shadow-lg dark:shadow-zinc-900/50 cursor-pointer border-2 border-transparent dark:border-zinc-800"
                whileHover={{
                    scale: 1.03,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
                }}
                transition={{ duration: 0.3 }}
            >
                {/* Image with 16:9 aspect ratio */}
                <div className="relative aspect-[16/9] overflow-hidden bg-gray-100 dark:bg-zinc-800">
                    {project.image ? (
                        <Image
                            src={project.image}
                            alt={project.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-zinc-700 dark:to-zinc-800 flex items-center justify-center">
                            <span className="font-mono text-gray-500 dark:text-zinc-400 text-sm">[No Preview]</span>
                        </div>
                    )}

                    {/* Dark gradient overlay at bottom for label contrast */}
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent" />

                    {/* White pill label at bottom-left - Naresh style */}
                    <div className="absolute bottom-4 left-4">
                        <span className="inline-block px-4 py-2 bg-white dark:bg-zinc-900 text-black dark:text-white text-sm font-bold rounded-full shadow-md border dark:border-zinc-700">
                            {project.title}
                        </span>
                    </div>

                    {/* Hover overlay with action buttons */}
                    <div className="absolute inset-0 bg-black/50 dark:bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                        {project.link && (
                            <a
                                href={project.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-12 h-12 rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors shadow-lg"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <ExternalLink size={20} className="text-black dark:text-white" />
                            </a>
                        )}
                        {project.github && (
                            <a
                                href={project.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-12 h-12 rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors shadow-lg"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Github size={20} className="text-black dark:text-white" />
                            </a>
                        )}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

export default function ProjectsGrid({ projects }: ProjectsGridProps) {
    if (!projects || projects.length === 0) {
        return (
            <div className="text-center py-16">
                <div className="font-mono text-gray-400 dark:text-zinc-500 mb-4">// NO PROJECTS YET</div>
                <p className="text-gray-500 dark:text-zinc-400">Add projects to display them here.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
            ))}
        </div>
    );
}
