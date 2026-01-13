"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TechCategory {
    name: string;
    shortName: string;
    skills: string[];
    bgColor: string;
    tabColor: string;
}

interface TechStackSectionProps {
    skills: string[];
}

// Category styling following design system
const categoryStyles: Record<string, { bgColor: string; tabColor: string; shortName: string }> = {
    "Languages": { bgColor: "#fff9c4", tabColor: "#1a1a1a", shortName: "LANGUAGES" },
    "Frontend": { bgColor: "#ffcdd2", tabColor: "#c62828", shortName: "FRONTEND" },
    "Backend": { bgColor: "#bbdefb", tabColor: "#1565c0", shortName: "BACKEND" },
    "Database": { bgColor: "#c8e6c9", tabColor: "#2e7d32", shortName: "DATABASE" },
    "DevOps & Tools": { bgColor: "#e1bee7", tabColor: "#7b1fa2", shortName: "DEVOPS" },
    "Other": { bgColor: "#ffe0b2", tabColor: "#e65100", shortName: "OTHER" },
};

// Skill categorization map
const skillCategories: Record<string, string> = {
    // Languages
    "JavaScript": "Languages", "TypeScript": "Languages", "Python": "Languages",
    "Java": "Languages", "Go": "Languages", "Rust": "Languages",
    "C++": "Languages", "C#": "Languages", "Ruby": "Languages",
    "PHP": "Languages", "Swift": "Languages", "Kotlin": "Languages",

    // Frontend  
    "React": "Frontend", "Next.js": "Frontend", "Vue": "Frontend",
    "Vue.js": "Frontend", "Angular": "Frontend", "Svelte": "Frontend",
    "Tailwind": "Frontend", "TailwindCSS": "Frontend", "Tailwind CSS": "Frontend",
    "CSS": "Frontend", "HTML": "Frontend", "Framer Motion": "Frontend",

    // Backend
    "Node.js": "Backend", "Express": "Backend", "Django": "Backend",
    "Flask": "Backend", "FastAPI": "Backend", "Spring": "Backend",
    "Rails": "Backend", "GraphQL": "Backend", "REST": "Backend", "tRPC": "Backend",

    // Database
    "PostgreSQL": "Database", "MySQL": "Database", "MongoDB": "Database",
    "Redis": "Database", "Supabase": "Database", "Firebase": "Database",
    "Prisma": "Database", "SQLite": "Database",

    // DevOps
    "Docker": "DevOps & Tools", "Kubernetes": "DevOps & Tools", "AWS": "DevOps & Tools",
    "GCP": "DevOps & Tools", "Azure": "DevOps & Tools", "Vercel": "DevOps & Tools",
    "Git": "DevOps & Tools", "GitHub": "DevOps & Tools", "CI/CD": "DevOps & Tools",
    "Linux": "DevOps & Tools",
};

function categorizeSkills(skills: string[]): TechCategory[] {
    const grouped: Record<string, string[]> = {};

    skills.forEach((skill) => {
        const category = skillCategories[skill] || "Other";
        if (!grouped[category]) grouped[category] = [];
        grouped[category].push(skill);
    });

    const order = ["Languages", "Frontend", "Backend", "Database", "DevOps & Tools", "Other"];

    return order
        .filter((cat) => grouped[cat]?.length > 0)
        .map((name) => ({
            name,
            shortName: categoryStyles[name]?.shortName || name.toUpperCase(),
            skills: grouped[name],
            bgColor: categoryStyles[name]?.bgColor || "#f5f5f5",
            tabColor: categoryStyles[name]?.tabColor || "#666",
        }));
}

// Smooth spring animation config per design system
const springTransition = {
    type: "spring" as const,
    stiffness: 300,
    damping: 25,
};

// Folder content animation variants
const contentVariants = {
    initial: {
        opacity: 0,
        y: 20,
        scale: 0.98,
    },
    animate: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            ...springTransition,
            staggerChildren: 0.03,
            delayChildren: 0.1,
        },
    },
    exit: {
        opacity: 0,
        y: -15,
        scale: 0.98,
        transition: { duration: 0.2 },
    },
};

// Skill tag animation variants
const skillVariants = {
    initial: { opacity: 0, y: 12, scale: 0.9 },
    animate: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: springTransition,
    },
    exit: { opacity: 0, scale: 0.9 },
};

export default function TechStackSection({ skills }: TechStackSectionProps) {
    const categories = categorizeSkills(skills);
    const [activeIndex, setActiveIndex] = useState(0);

    const handleTabClick = useCallback((index: number) => {
        if (index !== activeIndex) {
            setActiveIndex(index);
        }
    }, [activeIndex]);

    if (categories.length === 0) {
        return (
            <div className="text-center py-12 font-mono text-gray-400">
        // NO SKILLS DEFINED
            </div>
        );
    }

    const currentCategory = categories[activeIndex];

    return (
        <div className="relative w-full max-w-4xl mx-auto">
            {/* Folder Tabs Container */}
            <div className="flex items-end gap-1 px-2">
                {categories.map((cat, index) => {
                    const isActive = index === activeIndex;

                    return (
                        <motion.button
                            key={cat.name}
                            onClick={() => handleTabClick(index)}
                            className="relative font-mono font-bold text-xs tracking-wide border-2 border-b-0 border-black transition-colors"
                            style={{
                                backgroundColor: isActive ? cat.tabColor : '#9ca3af',
                                color: 'white',
                                borderRadius: '10px 10px 0 0',
                                padding: '10px 16px',
                                zIndex: isActive ? 20 : 10 - index,
                                marginBottom: isActive ? '-2px' : '0',
                            }}
                            whileHover={{
                                y: isActive ? 0 : -2,
                                transition: { duration: 0.15 },
                            }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {cat.shortName}

                            {/* Active indicator dot */}
                            {isActive && (
                                <motion.div
                                    layoutId="activeTabIndicator"
                                    className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rounded-full border border-black/20"
                                    transition={springTransition}
                                />
                            )}
                        </motion.button>
                    );
                })}
            </div>

            {/* Folder Content Card */}
            <div
                className="relative border-2 border-black overflow-hidden"
                style={{
                    backgroundColor: currentCategory.bgColor,
                    borderRadius: '0 12px 12px 12px',
                    boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)',
                }}
            >
                {/* Paper texture overlay */}
                <div
                    className="absolute inset-0 opacity-[0.025] pointer-events-none"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
                    }}
                />

                {/* Top fold line decoration */}
                <div
                    className="h-1 w-full"
                    style={{ backgroundColor: currentCategory.tabColor + '15' }}
                />

                {/* Animated Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeIndex}
                        variants={contentVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="relative p-8 md:p-10"
                    >
                        {/* Category Header */}
                        <div className="mb-8">
                            <motion.h3
                                className="font-mono font-black text-2xl md:text-3xl tracking-tight text-black inline-block"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.05, ...springTransition }}
                            >
                                {currentCategory.name}
                            </motion.h3>

                            {/* Animated wavy underline */}
                            <svg
                                className="w-full max-w-[180px] h-3 mt-1"
                                viewBox="0 0 120 12"
                                preserveAspectRatio="none"
                            >
                                <motion.path
                                    d="M2 7 Q 15 3 30 7 T 60 6 T 90 7 T 118 5"
                                    stroke={currentCategory.tabColor}
                                    strokeWidth="3"
                                    fill="none"
                                    strokeLinecap="round"
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{ pathLength: 1, opacity: 1 }}
                                    transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
                                />
                            </svg>
                        </div>

                        {/* Skills Grid */}
                        <motion.div
                            className="flex flex-wrap gap-3"
                            variants={contentVariants}
                        >
                            {currentCategory.skills.map((skill) => (
                                <motion.span
                                    key={skill}
                                    variants={skillVariants}
                                    className="px-4 py-2.5 text-sm font-mono font-bold bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-black hover:text-white hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-150 cursor-default select-none"
                                >
                                    {skill}
                                </motion.span>
                            ))}
                        </motion.div>

                        {/* Skill count badge */}
                        <motion.div
                            className="absolute bottom-4 right-6 md:bottom-6 md:right-8"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <span className="font-mono text-xs text-black/40 bg-white/50 px-2 py-1 rounded border border-black/10">
                                {currentCategory.skills.length} skill{currentCategory.skills.length !== 1 ? 's' : ''}
                            </span>
                        </motion.div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Subtle shadow under folder */}
            <div
                className="absolute -bottom-3 left-3 right-3 h-6 bg-gradient-to-b from-black/5 to-transparent rounded-b-lg -z-10"
                style={{ filter: 'blur(4px)' }}
            />
        </div>
    );
}
