"use client";

import { useRef, useState, useCallback, ReactNode } from "react";
import { motion, useInView, AnimatePresence, Variants } from "framer-motion";
import { ChevronLeft, ChevronRight, Github, Star, ExternalLink } from "lucide-react";

// Exported interfaces for use in other components
export interface ProjectItem {
  title: string;
  problem: string;
  outcome?: string;
  tag: string;
  tagColor: string;
  link?: string;
}

export interface GitHubRepoItem {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage?: string | null;
  language: string | null;
  stargazers_count: number;
  topics: string[];
  updated_at: string;
}

// Scroll entrance animation for elements
export function ScrollEntrance({
  children,
  delay = 0,
}: {
  children: ReactNode;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once: true,
    amount: 0.1,
  });

  return (
    <div ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{
          duration: 0.6,
          ease: [0.25, 0.1, 0.25, 1],
          delay: delay,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

// Internal project type with optional id for carousel
interface InternalProject extends ProjectItem {
  id?: string;
}

// Combined project type for carousel
type CarouselProject =
  | { type: "manual"; data: InternalProject; key: string }
  | { type: "github"; data: GitHubRepoItem; key: string };

// Tear animation variants with proper typing
const tearVariants: Variants = {
  initial: (direction: number) => ({
    x: direction > 0 ? 400 : -400,
    rotateZ: direction > 0 ? 8 : -8,
    opacity: 0,
    scale: 0.9,
  }),
  animate: {
    x: 0,
    rotateZ: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 30,
      mass: 1,
    },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -400 : 400,
    rotateZ: direction > 0 ? -8 : 8,
    opacity: 0,
    scale: 0.9,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 30,
      mass: 1,
    },
  }),
};

// Project Card Component - Theme aware
function ProjectCard({
  project,
  direction,
}: {
  project: CarouselProject;
  direction: number;
}) {
  if (project.type === "manual") {
    const data = project.data;
    return (
      <motion.div
        key={project.key}
        custom={direction}
        variants={tearVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="absolute inset-0"
      >
        <div
          className="relative bg-[var(--card-bg)] border-2 border-[var(--border)] p-8 shadow-hard h-full flex gap-6"
          style={{ borderRadius: '20px 15px 20px 15px' }}
        >
          {/* Paper texture overlay */}
          <div
            className="absolute inset-0 opacity-[0.02] pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
            }}
          />

          {/* Tag */}
          <div
            className={`absolute top-4 right-4 px-4 py-2 font-mono font-bold text-xs border-2 border-[var(--border)] bg-[var(--background)] rotate-6 shadow-hard-sm ${data.tagColor} z-10`}
          >
            [{data.tag}]
          </div>

          {/* Left Content */}
          <div className="flex-1 flex flex-col min-w-0">
            <h3 className="font-mono font-bold text-2xl md:text-3xl mb-4 pr-20 tracking-tight text-[var(--foreground)]">
              {data.title}
            </h3>
            <p className="text-[var(--muted)] text-lg mb-6 leading-relaxed">
              {data.problem}
            </p>

            {/* Action Buttons */}
            <div className="mt-auto flex flex-wrap gap-3">
              {data.link && (
                <a
                  href={data.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-6 py-3 bg-[var(--foreground)] text-[var(--background)] font-mono font-bold text-sm border-2 border-[var(--border)] shadow-hard-sm hover:bg-[var(--background)] hover:text-[var(--foreground)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                >
                  <ExternalLink size={16} />
                  VIEW PROJECT
                </a>
              )}
            </div>
          </div>

          {/* Right Preview Box */}
          <div className="hidden md:flex w-72 h-64 border-2 border-[var(--border)] bg-[var(--card-hover)] flex-shrink-0 relative overflow-hidden items-center justify-center">
            <div className="text-center p-4">
              <ExternalLink size={32} className="mx-auto mb-2 text-[var(--muted)]" />
              <p className="text-xs font-mono text-[var(--muted)]">
                {data.link ? "Click VIEW PROJECT" : "No link"}
              </p>
            </div>
          </div>

          {/* Decorative corner fold */}
          <div
            className="absolute top-0 right-0 w-12 h-12 bg-[var(--card-hover)] border-l-2 border-b-2 border-[var(--border)]"
            style={{
              clipPath: 'polygon(100% 0, 0 0, 100% 100%)',
            }}
          />
        </div>
      </motion.div>
    );
  }

  // GitHub Repo Card
  const repo = project.data;
  return (
    <motion.div
      key={project.key}
      custom={direction}
      variants={tearVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="absolute inset-0"
    >
      <div
        className="relative bg-[var(--card-bg)] border-2 border-[var(--border)] p-8 shadow-hard h-full flex gap-6"
        style={{ borderRadius: '20px 15px 20px 15px' }}
      >
        {/* Paper texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
          }}
        />

        {/* GitHub badge + stats */}
        <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
          {repo.language && (
            <span className="px-3 py-1.5 font-mono font-bold text-xs border-2 border-[var(--border)] bg-[var(--card-hover)] text-[var(--foreground)] shadow-hard-sm">
              {repo.language}
            </span>
          )}
          <span className="px-3 py-1.5 font-mono font-bold text-xs border-2 border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] flex items-center gap-1.5 shadow-hard-sm">
            <Star size={14} className="fill-yellow-400 text-yellow-400" />
            {repo.stargazers_count}
          </span>
        </div>

        {/* Left Content */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full border-2 border-[var(--border)] flex items-center justify-center bg-[var(--card-hover)]">
              <Github size={20} className="text-[var(--foreground)]" />
            </div>
            <h3 className="font-mono font-bold text-2xl md:text-3xl tracking-tight text-[var(--foreground)]">
              {repo.name}
            </h3>
          </div>

          <p className="text-[var(--muted)] text-lg mb-6 leading-relaxed">
            {repo.description || "No description available"}
          </p>

          {/* Topics */}
          {repo.topics && repo.topics.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {repo.topics.slice(0, 5).map((topic) => (
                <span
                  key={topic}
                  className="px-3 py-1 text-xs font-mono font-bold bg-[var(--card-hover)] text-[var(--muted)] border border-[var(--muted)]"
                >
                  #{topic}
                </span>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-auto flex flex-wrap gap-3">
            {repo.homepage && (
              <a
                href={repo.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-6 py-3 bg-[var(--foreground)] text-[var(--background)] font-mono font-bold text-sm border-2 border-[var(--border)] shadow-hard-sm hover:bg-[var(--background)] hover:text-[var(--foreground)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
              >
                <ExternalLink size={16} />
                VISIT SITE
              </a>
            )}
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-3 bg-[var(--background)] text-[var(--foreground)] font-mono font-bold text-sm border-2 border-[var(--border)] shadow-hard-sm hover:bg-[var(--foreground)] hover:text-[var(--background)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
            >
              <Github size={16} />
              VIEW CODE
            </a>
          </div>
        </div>

        {/* Right Preview Box */}
        <div className="hidden md:flex w-72 h-64 border-2 border-[var(--border)] bg-[var(--card-hover)] flex-shrink-0 relative overflow-hidden items-center justify-center">
          <div className="text-center p-4">
            <Github size={32} className="mx-auto mb-2 text-[var(--muted)]" />
            <p className="text-xs font-mono text-[var(--muted)]">
              {repo.homepage ? "Click VISIT SITE" : "Code only"}
            </p>
          </div>
        </div>

        {/* Decorative corner fold */}
        <div
          className="absolute top-0 right-0 w-12 h-12 bg-[var(--card-hover)] border-l-2 border-b-2 border-[var(--border)] z-10"
          style={{
            clipPath: 'polygon(100% 0, 0 0, 100% 100%)',
          }}
        />
      </div>
    </motion.div>
  );
}

interface ProjectsSectionProps {
  projects: ProjectItem[];
  githubRepos?: GitHubRepoItem[];
}

export default function ProjectsSection({ projects, githubRepos = [] }: ProjectsSectionProps) {
  const [[currentIndex, direction], setCurrentIndex] = useState([0, 0]);

  // Combine all projects into a single array
  const allProjects: CarouselProject[] = [
    ...projects.map((p, idx): CarouselProject => ({
      type: "manual",
      data: p,
      key: `manual-${idx}-${p.title}`
    })),
    ...githubRepos.map((r): CarouselProject => ({
      type: "github",
      data: r,
      key: `github-${r.id}`
    })),
  ];

  const totalProjects = allProjects.length;

  const goToNext = useCallback(() => {
    if (totalProjects === 0) return;
    setCurrentIndex(([prev]) => [(prev + 1) % totalProjects, 1]);
  }, [totalProjects]);

  const goToPrev = useCallback(() => {
    if (totalProjects === 0) return;
    setCurrentIndex(([prev]) => [(prev - 1 + totalProjects) % totalProjects, -1]);
  }, [totalProjects]);

  // Empty state
  if (totalProjects === 0) {
    return (
      <div className="text-center py-16">
        <div className="font-mono text-[var(--muted)] mb-4">// NO PROJECTS YET</div>
        <p className="text-[var(--muted)]">Add projects in the admin panel to display them here.</p>
      </div>
    );
  }

  const currentProject = allProjects[currentIndex];

  return (
    <div className="relative">
      {/* Project counter */}
      <div className="flex items-center justify-between mb-6">
        <div className="font-mono text-sm text-[var(--muted)]">
          <span className="text-[var(--foreground)] font-bold">{String(currentIndex + 1).padStart(2, '0')}</span>
          <span className="mx-2">/</span>
          <span>{String(totalProjects).padStart(2, '0')}</span>
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={goToPrev}
            className="w-12 h-12 rounded-full border-2 border-[var(--border)] flex items-center justify-center bg-[var(--background)] text-[var(--foreground)] shadow-hard-sm hover:bg-[var(--foreground)] hover:text-[var(--background)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
            aria-label="Previous project"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={goToNext}
            className="w-12 h-12 rounded-full border-2 border-[var(--border)] flex items-center justify-center bg-[var(--background)] text-[var(--foreground)] shadow-hard-sm hover:bg-[var(--foreground)] hover:text-[var(--background)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
            aria-label="Next project"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      {/* Carousel container */}
      <div className="relative h-[400px] md:h-[350px] overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <ProjectCard
            key={currentProject.key}
            project={currentProject}
            direction={direction}
          />
        </AnimatePresence>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center items-center gap-2 mt-8">
        {allProjects.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex([index, index > currentIndex ? 1 : -1])}
            className={`w-3 h-3 rounded-full border-2 border-[var(--border)] transition-all ${index === currentIndex
              ? 'bg-[var(--foreground)] scale-110'
              : 'bg-[var(--background)] hover:bg-[var(--card-hover)]'
              }`}
            aria-label={`Go to project ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
