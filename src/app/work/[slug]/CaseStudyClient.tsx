"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Github, Globe, Layers, Zap, Database } from "lucide-react";
import Link from "next/link";
import mermaid from "mermaid";
import { Project } from "@/lib/types";

interface CaseStudyClientProps {
  project: Project;
}

export default function CaseStudyClient({ project }: CaseStudyClientProps) {
  const mermaidRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: "neutral",
      fontFamily: "Geist Mono, monospace",
    });
    mermaid.contentLoaded();
  }, []);

  // Mock Mermaid diagram if not in DB yet
  const architectureDiagram = `
    graph TD
    User[User] --> CDN[CDN / Edge]
    CDN --> FE[Next.js Client]
    FE --> API[API Routes]
    API --> Service[Service Layer]
    Service --> DB[(Supabase Postgres)]
    Service --> Cache[Redis Cache]
  `;

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-24 pb-12 px-6">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/work"
          className="inline-flex items-center gap-2 font-mono text-sm text-[var(--muted)] hover:text-[var(--foreground)] mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          BACK_TO_WORK
        </Link>

        {/* Hero Section */}
        <div className="mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-mono font-black text-4xl md:text-6xl mb-6"
          >
            {project.title.toUpperCase()}
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap gap-4 mb-8"
          >
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 border border-[var(--border)] text-xs font-mono bg-neutral-100"
              >
                {tech}
              </span>
            ))}
          </motion.div>
          <div className="flex gap-4">
            {project.githubRepo && (
                <a
                  href={project.githubRepo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 border-2 border-[var(--foreground)] bg-[var(--foreground)] text-[var(--background)] font-mono font-bold text-sm hover:opacity-90 transition-opacity"
                >
                  <Github className="w-4 h-4" />
                  VIEW_SOURCE
                </a>
            )}
            {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 border-2 border-[var(--foreground)] font-mono font-bold text-sm hover:bg-neutral-100 transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  LIVE_DEMO
                </a>
            )}
          </div>
        </div>

        {/* Overview */}
        <section className="mb-16 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="font-mono font-bold text-xl mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5" /> PROBLEM
            </h2>
            <p className="text-[var(--muted)] leading-relaxed">
              {project.problem ||
                "Description of the complex problem this project solves. Details about user pain points and technical challenges faced during the initial phase."}
            </p>
          </div>
          <div>
            <h2 className="font-mono font-bold text-xl mb-4 flex items-center gap-2">
              <Layers className="w-5 h-5" /> SOLUTION
            </h2>
            <p className="text-[var(--muted)] leading-relaxed">
              {project.outcome ||
                "How the solution was engineered. Architectural decisions made to ensure scalability, performance, and user experience."}
            </p>
          </div>
        </section>

        {/* System Architecture */}
        <section className="mb-16 border-2 border-dashed border-[var(--muted)] p-8 bg-neutral-50">
          <h2 className="font-mono font-bold text-xl mb-8 flex items-center gap-2">
            <Database className="w-5 h-5" /> SYSTEM_ARCHITECTURE
          </h2>
          <div className="mermaid flex justify-center" ref={mermaidRef}>
            {architectureDiagram}
          </div>
        </section>

        {/* Deep Dive / Challenges */}
        <section className="mb-16">
          <h2 className="font-mono font-bold text-xl mb-6">ENGINEERING_DEEP_DIVE</h2>
          <div className="prose prose-neutral max-w-none font-sans">
             <p className="font-mono text-sm text-[var(--muted)] mb-4">
               // Detailed breakdown of technical challenges and performance optimizations
             </p>
             <p>
               One of the main challenges in building {project.title} was ensuring real-time data synchronization across clients. We utilized WebSockets via Supabase Realtime to achieve sub-100ms updates...
             </p>
             <h3 className="font-bold mt-6 mb-2">Performance Metrics</h3>
             <ul className="list-disc pl-5 space-y-2">
               <li>Lighthouse Score: 98/100</li>
               <li>First Contentful Paint: 0.8s</li>
               <li>Time to Interactive: 1.2s</li>
             </ul>
          </div>
        </section>
      </div>
    </main>
  );
}
