"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Cloud, fetchSimpleIcons, renderSimpleIcon, SimpleIcon } from "react-icon-cloud";

interface SkillsIconCloudProps {
    skills: string[];
}

// Map skill names to simple-icons slugs
const skillToIconSlug: Record<string, string> = {
    // Languages
    "JavaScript": "javascript",
    "TypeScript": "typescript",
    "Python": "python",
    "Java": "openjdk",
    "Go": "go",
    "Rust": "rust",
    "C++": "cplusplus",
    "C#": "csharp",
    "Ruby": "ruby",
    "PHP": "php",
    "Swift": "swift",
    "Kotlin": "kotlin",

    // Frontend
    "React": "react",
    "Next.js": "nextdotjs",
    "Vue": "vuedotjs",
    "Vue.js": "vuedotjs",
    "Angular": "angular",
    "Svelte": "svelte",
    "Tailwind": "tailwindcss",
    "TailwindCSS": "tailwindcss",
    "Tailwind CSS": "tailwindcss",
    "CSS": "css3",
    "HTML": "html5",
    "Framer Motion": "framer",

    // Backend
    "Node.js": "nodedotjs",
    "Express": "express",
    "Django": "django",
    "Flask": "flask",
    "FastAPI": "fastapi",
    "Spring": "spring",
    "Rails": "rubyonrails",
    "GraphQL": "graphql",
    "REST": "openapiinitiative",
    "tRPC": "trpc",

    // Database
    "PostgreSQL": "postgresql",
    "MySQL": "mysql",
    "MongoDB": "mongodb",
    "Redis": "redis",
    "Supabase": "supabase",
    "Firebase": "firebase",
    "Prisma": "prisma",
    "SQLite": "sqlite",

    // DevOps & Cloud
    "Docker": "docker",
    "Kubernetes": "kubernetes",
    "AWS": "amazonwebservices",
    "GCP": "googlecloud",
    "Azure": "microsoftazure",
    "Vercel": "vercel",
    "Git": "git",
    "GitHub": "github",
    "CI/CD": "githubactions",
    "Linux": "linux",

    // AI/ML
    "TensorFlow": "tensorflow",
    "PyTorch": "pytorch",
    "OpenAI": "openai",
    "Hugging Face": "huggingface",

    // Tools
    "VS Code": "visualstudiocode",
    "Figma": "figma",
    "Notion": "notion",
    "Postman": "postman",
};

// Render icon with sketch aesthetic
// Per plan: grayscale by default, color on hover, no floating text labels
const renderCustomIcon = (icon: SimpleIcon) => {
    return renderSimpleIcon({
        icon,
        bgHex: "#ffffff",
        fallbackHex: "#1a1a1a",
        minContrastRatio: 2,
        size: 42,
        aProps: {
            href: undefined,
            target: undefined,
            rel: undefined,
            onClick: (e: React.MouseEvent) => e.preventDefault(),
            style: {
                filter: "grayscale(100%)",
                transition: "filter 0.2s ease",
            },
            onMouseEnter: (e: React.MouseEvent<HTMLAnchorElement>) => {
                e.currentTarget.style.filter = "grayscale(0%)";
            },
            onMouseLeave: (e: React.MouseEvent<HTMLAnchorElement>) => {
                e.currentTarget.style.filter = "grayscale(100%)";
            },
        },
    });
};

export default function SkillsIconCloud({ skills }: SkillsIconCloudProps) {
    const [icons, setIcons] = useState<SimpleIcon[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDesktop, setIsDesktop] = useState(false);
    const [isTabActive, setIsTabActive] = useState(true);

    // Convert skills to icon slugs
    const iconSlugs = useMemo(() => {
        return skills
            .map((skill) => skillToIconSlug[skill])
            .filter(Boolean);
    }, [skills]);

    // Per plan: Desktop only (≥1024px)
    useEffect(() => {
        const checkDesktop = () => {
            setIsDesktop(window.innerWidth >= 1024);
        };

        checkDesktop();
        window.addEventListener("resize", checkDesktop);
        return () => window.removeEventListener("resize", checkDesktop);
    }, []);

    // Per plan: Pause animation when tab is inactive
    useEffect(() => {
        const handleVisibilityChange = () => {
            setIsTabActive(!document.hidden);
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
    }, []);

    // Fetch icons
    useEffect(() => {
        if (iconSlugs.length === 0) {
            setIsLoading(false);
            return;
        }

        fetchSimpleIcons({ slugs: iconSlugs }).then((data) => {
            setIcons(Object.values(data.simpleIcons));
            setIsLoading(false);
        }).catch(() => {
            setIsLoading(false);
        });
    }, [iconSlugs]);

    const renderedIcons = useMemo(() => {
        return icons.map((icon) => renderCustomIcon(icon));
    }, [icons]);

    // Loading state
    if (isLoading) {
        return (
            <div
                className="relative bg-white border-2 border-black p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center min-h-[280px]"
                style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}
            >
                <motion.div
                    className="w-5 h-5 border-2 border-black border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <span className="ml-3 font-mono text-gray-500 text-sm">LOADING...</span>
            </div>
        );
    }

    // No icons to display
    if (icons.length === 0) {
        return null;
    }

    // Per plan: Mobile fallback → static grid
    if (!isDesktop) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}
            >
                {/* Tape decoration */}
                <div className="absolute -top-3 left-8 w-16 h-5 bg-gray-200/80 rotate-[-2deg] border border-gray-300 z-10" />

                <div className="flex flex-wrap gap-4 justify-center py-4">
                    {icons.slice(0, 20).map((icon, index) => (
                        <div
                            key={icon.slug || index}
                            className="w-10 h-10 flex items-center justify-center grayscale hover:grayscale-0 transition-all"
                            title={icon.title}
                        >
                            {renderCustomIcon(icon)}
                        </div>
                    ))}
                </div>
            </motion.div>
        );
    }

    // Desktop: 3D rotating cloud
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
            style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}
        >
            {/* Tape decoration */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-gray-200/80 rotate-[1deg] border border-gray-300 z-10" />

            <div
                className="relative mx-auto"
                style={{ maxWidth: "500px", minHeight: "280px" }}
            >
                <Cloud
                    containerProps={{
                        style: {
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "100%",
                            paddingTop: 20,
                            paddingBottom: 20,
                        },
                    }}
                    options={{
                        reverse: true,
                        depth: 1,
                        wheelZoom: false,
                        imageScale: 2,
                        activeCursor: "default",
                        tooltip: "native",
                        initial: [0.1, -0.1],
                        clickToFront: 500,
                        tooltipDelay: 0,
                        outlineColour: "#0000",
                        // Per plan: pause when tab inactive
                        maxSpeed: isTabActive ? 0.04 : 0,
                        minSpeed: isTabActive ? 0.02 : 0,
                        freezeActive: !isTabActive,
                    }}
                >
                    {renderedIcons}
                </Cloud>
            </div>

            {/* Subtle instruction */}
            <p className="text-center font-mono text-xs text-gray-400 mt-2">
                HOVER TO REVEAL
            </p>
        </motion.div>
    );
}
