"use client";

import { motion } from "framer-motion";
import { SKILLS, SkillNames } from "@/data/skills";
import { Experience, EXPERIENCE } from "@/data/experience";

// Experience Card Component - Naresh-style
function ExperienceCard({
    experience,
    index,
}: {
    experience: Experience;
    index: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.4,
                delay: index * 0.1,
                ease: "easeOut",
            }}
            viewport={{ once: true, margin: "-50px" }}
        >
            <div className="bg-white dark:bg-zinc-900 border-2 border-gray-200 dark:border-zinc-700 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.05)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.15)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.1)] hover:border-gray-300 dark:hover:border-zinc-600 transition-all duration-300">
                {/* Header */}
                <div className="px-6 py-5 border-b border-gray-100 dark:border-zinc-800">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="space-y-1">
                            <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                                {experience.title}
                            </h3>
                            <div className="text-base font-medium text-gray-500 dark:text-zinc-400">
                                {experience.company}
                            </div>
                        </div>
                        <span className="w-fit px-3 py-1.5 bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-300 text-xs font-mono rounded-md border border-gray-200 dark:border-zinc-700">
                            {experience.startDate} - {experience.endDate}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="px-6 py-5 space-y-6">
                    {/* Description */}
                    <ul className="list-disc list-outside ml-4 space-y-2 text-base text-gray-600 dark:text-zinc-300 leading-relaxed">
                        {experience.description.map((point, i) => (
                            <li key={i}>{point}</li>
                        ))}
                    </ul>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-2">
                        {experience.skills.map((skillName) => {
                            const skill = SKILLS[skillName as SkillNames];
                            if (!skill) return null;
                            return (
                                <span
                                    key={skillName}
                                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-300 text-xs font-medium rounded-md border border-gray-200 dark:border-zinc-700 transition-colors"
                                >
                                    <img
                                        src={skill.icon}
                                        alt={skill.label}
                                        className="w-3.5 h-3.5 object-contain dark:invert-[0.8]"
                                    />
                                    {skill.label}
                                </span>
                            );
                        })}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

// Main Experience Section Component
export default function ExperienceSection() {
    return (
        <div className="w-full max-w-4xl px-4 md:px-8 mx-auto">
            {/* Section Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12 md:mb-16"
            >
                <span className="text-xs font-mono text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-4 block">
                    // EXPERIENCE
                </span>
                <h2 className="font-mono font-bold text-4xl md:text-6xl lg:text-7xl tracking-tighter text-black dark:text-white">
                    My Journey
                </h2>
                <p className="mt-4 text-gray-500 dark:text-zinc-400 font-mono text-sm">
                    Professional experience and growth
                </p>
            </motion.div>

            {/* Experience Cards */}
            <div className="flex flex-col gap-8 md:gap-10 relative">
                {/* Timeline Connector Line */}
                <div className="absolute left-8 md:left-1/2 top-4 bottom-4 w-px bg-gray-200 dark:bg-zinc-700 hidden md:block -translate-x-1/2" />

                {EXPERIENCE.map((exp, index) => (
                    <div key={exp.id} className="relative">
                        {/* Timeline Dot */}
                        <div className="absolute left-1/2 -translate-x-1/2 top-8 w-3 h-3 bg-black dark:bg-white rounded-full hidden md:block z-10 ring-4 ring-white dark:ring-zinc-950" />
                        <ExperienceCard experience={exp} index={index} />
                    </div>
                ))}
            </div>
        </div>
    );
}
