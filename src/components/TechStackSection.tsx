"use client";

import { motion } from "framer-motion";

interface TechCategory {
    name: string;
    skills: string[];
    bgColor: string;
    textColor: string;
}

interface TechStackSectionProps {
    skills: string[];
}

// Sticky note colors - all with dark text for visibility
const categoryStyles: Record<string, { bgColor: string; textColor: string }> = {
    "Languages": { bgColor: "#fff9c4", textColor: "#1a1a1a" },      // Yellow
    "Frontend": { bgColor: "#ffcdd2", textColor: "#1a1a1a" },       // Pink/Red
    "Backend": { bgColor: "#bbdefb", textColor: "#1a1a1a" },        // Blue
    "Database": { bgColor: "#c8e6c9", textColor: "#1a1a1a" },       // Green
    "DevOps & Tools": { bgColor: "#e1bee7", textColor: "#1a1a1a" }, // Purple
    "Other": { bgColor: "#ffe0b2", textColor: "#1a1a1a" },          // Orange
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
            skills: grouped[name],
            bgColor: categoryStyles[name]?.bgColor || "#f5f5f5",
            textColor: categoryStyles[name]?.textColor || "#1a1a1a",
        }));
}

// Individual sticky note component
function StickyNote({ category, index }: { category: TechCategory; index: number }) {
    // Slight rotation variations for a more natural look
    const rotations = [-2, 1, -1, 2, -1.5, 1.5];
    const rotation = rotations[index % rotations.length];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, rotate: 0 }}
            whileInView={{ opacity: 1, y: 0, rotate: rotation }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ 
                rotate: 0, 
                scale: 1.02,
                boxShadow: "8px 8px 0px 0px rgba(0,0,0,1)",
                transition: { duration: 0.2 }
            }}
            className="relative p-6 border-2 border-black min-w-[280px] flex-1"
            style={{
                backgroundColor: category.bgColor,
                boxShadow: "5px 5px 0px 0px rgba(0,0,0,1)",
            }}
        >
            {/* Tape decoration at top */}
            <div 
                className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 border border-gray-400/50 z-10"
                style={{
                    background: "linear-gradient(180deg, rgba(200,200,200,0.6) 0%, rgba(180,180,180,0.4) 100%)",
                    transform: `translateX(-50%) rotate(${rotation > 0 ? -1 : 1}deg)`,
                }}
            />

            {/* Category Title */}
            <h3 
                className="font-mono font-black text-xl mb-4 tracking-tight"
                style={{ color: category.textColor }}
            >
                {category.name}
                {/* Hand-drawn underline */}
                <svg
                    className="w-full max-w-[120px] h-2 mt-1"
                    viewBox="0 0 120 8"
                    preserveAspectRatio="none"
                >
                    <path
                        d="M2 5 Q 30 2 60 5 T 118 4"
                        stroke={category.textColor}
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                    />
                </svg>
            </h3>

            {/* Skills List */}
            <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                    <span
                        key={skill}
                        className="px-3 py-1.5 text-sm font-mono font-bold bg-white/90 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-black hover:text-white hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all duration-150 cursor-default select-none"
                        style={{ color: "#1a1a1a" }}
                    >
                        {skill}
                    </span>
                ))}
            </div>
        </motion.div>
    );
}

export default function TechStackSection({ skills }: TechStackSectionProps) {
    const categories = categorizeSkills(skills);

    if (categories.length === 0) {
        return (
            <div className="text-center py-12 font-mono text-gray-400">
                // NO SKILLS DEFINED
            </div>
        );
    }

    return (
        <div className="w-full max-w-6xl mx-auto">
            {/* Sticky Notes Grid - Side by Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categories.map((category, index) => (
                    <StickyNote 
                        key={category.name} 
                        category={category} 
                        index={index}
                    />
                ))}
            </div>
        </div>
    );
}
