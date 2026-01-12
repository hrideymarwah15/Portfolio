"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Mail, Github, Linkedin } from "lucide-react";
import { SiteData, getSiteData, defaultSiteData } from "@/lib/siteData";
import { ScrollEntrance } from "@/components/ProjectsSection";

// Animation variants from DESIGN_SYSTEM.md
const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export default function Home() {
    const [data, setData] = useState<SiteData>(defaultSiteData);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const stored = getSiteData();
        setData(stored);
        setIsLoaded(true);
    }, []);

    // Show a simple loading state to prevent hydration mismatch
    if (!isLoaded) {
        return (
            <main className="min-h-screen bg-white text-black flex items-center justify-center">
                <div className="font-mono text-gray-400 animate-pulse">Loading...</div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-white text-black">
            {/* Grid Background */}
            <div
                className="fixed inset-0 pointer-events-none opacity-[0.03]"
                style={{
                    backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
                    backgroundSize: '30px 30px'
                }}
            />

            {/* Hero Section */}
            <section className="min-h-screen flex flex-col justify-center items-center px-6 relative overflow-hidden">
                {/* Background Animation - positioned as background element */}
                <motion.div
                    className="absolute inset-0 flex items-center justify-end pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                >
                    {/* White background behind video */}
                    <div className="absolute inset-0 bg-white" />

                    {/* Grid overlay matching site background */}
                    <div
                        className="absolute inset-0 pointer-events-none opacity-[0.03]"
                        style={{
                            backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
                            backgroundSize: '30px 30px'
                        }}
                    />

                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="h-full w-auto max-w-none object-cover object-left relative"
                        style={{
                            minHeight: '100%',
                            transform: 'translateX(10%)',
                            mixBlendMode: 'multiply'
                        }}
                    >
                        <source src="/coder-animation.mp4" type="video/mp4" />
                    </video>
                </motion.div>

                {/* Content overlay */}
                <div className="max-w-6xl w-full relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-xl"
                    >
                        <h1
                            className="font-mono font-black text-4xl md:text-5xl lg:text-6xl tracking-tighter leading-[1.1] mb-6"
                        >
                            {data.hero.headline1}
                            <br />
                            {data.hero.headline2}{" "}
                            <span className="marker-yellow inline-block">{data.hero.highlightWord}</span>.
                        </h1>
                        <p className="text-base md:text-lg text-gray-600 max-w-md leading-relaxed mb-8">
                            {data.hero.description}
                        </p>
                        <motion.button
                            className="px-8 py-3 bg-black text-white font-mono font-bold text-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-white hover:text-black hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                            whileHover={{ scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                            {data.hero.ctaText}
                        </motion.button>
                    </motion.div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10">
                    <motion.div
                        className="w-6 h-10 border-2 border-black rounded-full flex justify-center pt-2"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                    >
                        <motion.div
                            className="w-1.5 h-3 bg-black rounded-full"
                            animate={{ y: [0, 6, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        />
                    </motion.div>
                </div>
            </section>

            {/* About Section */}
            <section className="px-6 py-24 border-t border-dashed border-gray-300">
                <div className="max-w-5xl mx-auto">
                    <ScrollEntrance delay={0.1}>
                        <span className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-4 block">
              // ABOUT
                        </span>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                            {/* Avatar */}
                            <div
                                className="relative w-full max-w-xs mx-auto lg:mx-0 aspect-square border-2 border-black bg-gray-100 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
                                style={{ borderRadius: '255px 15px 225px 15px / 15px 225px 15px 255px' }}
                            >
                                {data.about.photoUrl ? (
                                    <img
                                        src={data.about.photoUrl}
                                        alt={data.about.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <>
                                        <svg className="absolute inset-0 w-full h-full opacity-10">
                                            <line x1="0" y1="0" x2="100%" y2="100%" stroke="black" strokeWidth="1" strokeDasharray="4 4" />
                                            <line x1="100%" y1="0" x2="0" y2="100%" stroke="black" strokeWidth="1" strokeDasharray="4 4" />
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center font-mono text-gray-400 text-xs">
                                            [PHOTO]
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Content */}
                            <div>
                                <h2 className="font-mono font-bold text-4xl md:text-5xl tracking-tighter mb-5 relative inline-block">
                                    {data.about.name}
                                    <svg className="absolute -bottom-2 left-0 w-full h-3" viewBox="0 0 120 12" preserveAspectRatio="none">
                                        <motion.path
                                            d="M2 8 Q 30 2 60 8 T 118 6"
                                            stroke="black"
                                            strokeWidth="3"
                                            fill="none"
                                            strokeLinecap="round"
                                            initial={{ pathLength: 0 }}
                                            whileInView={{ pathLength: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.8, delay: 0.3 }}
                                        />
                                    </svg>
                                </h2>
                                <p className="text-gray-600 leading-relaxed mb-6 mt-4">
                                    {data.about.description}
                                </p>

                                {/* Stats */}
                                <motion.div
                                    className="p-6 border-2 border-black bg-gray-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                                    style={{ borderRadius: '3px 15px 5px 15px / 15px 5px 15px 5px' }}
                                    variants={containerVariants}
                                    initial="hidden"
                                    whileInView="show"
                                    viewport={{ once: true }}
                                >
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {data.about.stats.map((stat) => (
                                            <motion.div
                                                key={stat.label}
                                                className="text-center p-3 border border-dashed border-gray-400 bg-white group hover:border-solid hover:border-black transition-all"
                                                variants={itemVariants}
                                            >
                                                <div className="text-[10px] font-mono text-gray-400 uppercase tracking-wider mb-1">
                                                    {stat.label}
                                                </div>
                                                <div className="text-lg font-mono font-black text-black">
                                                    {stat.value}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </ScrollEntrance>
                </div>
            </section>

            {/* Projects Section */}
            <section className="px-6 py-24 border-t border-dashed border-gray-300">
                <div className="max-w-5xl mx-auto">
                    <ScrollEntrance delay={0.1}>
                        <span className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-4 block">
              // WORK
                        </span>
                        <h2 className="font-mono font-bold text-4xl md:text-5xl tracking-tighter mb-10">
                            PROJECTS
                        </h2>

                        <motion.div
                            className="grid grid-cols-1 md:grid-cols-2 gap-6"
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true }}
                        >
                            {data.projects.map((project) => (
                                <motion.a
                                    key={project.id}
                                    href={project.link}
                                    className="group relative block bg-white border-2 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all"
                                    style={{ borderRadius: '20px 15px 20px 15px' }}
                                    variants={itemVariants}
                                    whileHover={{ y: -8, rotate: 1, scale: 1.02 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                >
                                    {/* Tag */}
                                    <div
                                        className={`absolute top-4 right-4 px-3 py-1 font-mono font-bold text-xs border-2 border-black bg-white rotate-12 shadow-sm ${project.tagColor}`}
                                    >
                                        [{project.tag}]
                                    </div>

                                    <h3 className="font-mono font-bold text-xl md:text-2xl mb-3 pr-20">{project.title}</h3>
                                    <p className="text-gray-600 mb-3">{project.problem}</p>
                                    <p className="text-gray-500 text-sm font-mono">{project.outcome}</p>

                                    {/* Arrow */}
                                    <div className="absolute bottom-5 right-5 w-8 h-8 rounded-full border-2 border-black flex items-center justify-center bg-white group-hover:bg-black group-hover:text-white transition-colors">
                                        <ArrowUpRight size={16} />
                                    </div>
                                </motion.a>
                            ))}
                        </motion.div>
                    </ScrollEntrance>
                </div>
            </section>

            {/* Skills Section */}
            <section className="px-6 py-24 border-t border-dashed border-gray-300">
                <div className="max-w-5xl mx-auto">
                    <ScrollEntrance delay={0.1}>
                        <span className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-4 block">
              // STACK
                        </span>
                        <h2 className="font-mono font-bold text-4xl md:text-5xl tracking-tighter mb-8">
                            WHAT I WORK WITH
                        </h2>

                        <motion.div
                            className="flex flex-wrap gap-3"
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true }}
                        >
                            {data.skills.map((skill) => (
                                <motion.span
                                    key={skill}
                                    className="px-4 py-2 border-2 border-black text-sm font-mono font-bold bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-black hover:text-white hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all cursor-default"
                                    variants={itemVariants}
                                >
                                    {skill}
                                </motion.span>
                            ))}
                        </motion.div>
                    </ScrollEntrance>
                </div>
            </section>

            {/* Contact Section */}
            <section className="px-6 py-24 border-t border-dashed border-gray-300">
                <div className="max-w-5xl mx-auto">
                    <ScrollEntrance delay={0.1}>
                        <span className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-4 block">
              // CONTACT
                        </span>
                        <h2 className="font-mono font-bold text-4xl md:text-5xl tracking-tighter mb-8">
                            GET IN TOUCH
                        </h2>

                        {/* Availability Badge */}
                        {data.contact.isAvailable ? (
                            <div className="inline-flex items-center gap-2 px-4 py-2 border rounded-full font-mono text-sm bg-green-50 border-green-200 text-green-700 mb-8">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                </span>
                                {data.contact.availabilityText}
                            </div>
                        ) : (
                            <div className="inline-flex items-center gap-2 px-4 py-2 border rounded-full font-mono text-sm bg-red-50 border-red-200 text-red-700 mb-8">
                                <span className="relative flex h-3 w-3">
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                </span>
                                {data.contact.availabilityText}
                            </div>
                        )}

                        {/* Contact Card */}
                        <div
                            className="relative bg-white border-2 border-black p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] max-w-lg"
                            style={{ borderRadius: '255px 15px 225px 15px / 15px 225px 15px 255px' }}
                        >
                            {/* Tape decorations */}
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-200/80 rotate-[-2deg] border border-gray-300 z-10" />
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-200/50 rotate-[1deg] border border-gray-300" />

                            <p className="text-gray-600 mb-6">
                                {data.contact.description}
                            </p>

                            <div className="flex flex-wrap gap-3">
                                <a
                                    href={`mailto:${data.contact.email}`}
                                    className="flex items-center gap-2 px-4 py-2 border-2 border-black font-mono font-bold text-sm hover:bg-black hover:text-white transition-colors shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px]"
                                >
                                    <Mail size={14} />
                                    EMAIL
                                </a>
                                <a
                                    href={data.contact.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-4 py-2 border-2 border-black font-mono font-bold text-sm hover:bg-black hover:text-white transition-colors shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px]"
                                >
                                    <Github size={14} />
                                    GITHUB
                                </a>
                                <a
                                    href={data.contact.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-4 py-2 border-2 border-black font-mono font-bold text-sm hover:bg-black hover:text-white transition-colors shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px]"
                                >
                                    <Linkedin size={14} />
                                    LINKEDIN
                                </a>
                            </div>
                        </div>
                    </ScrollEntrance>
                </div>
            </section>

            {/* Footer */}
            <footer className="px-6 py-10 border-t-2 border-black">
                <div className="max-w-5xl mx-auto flex justify-between items-center font-mono text-xs text-gray-500">
                    <span>© {new Date().getFullYear()} {data.meta.footerText}</span>
                    <div className="flex items-center gap-4">
                        <a
                            href="/admin"
                            className="hover:text-black transition-colors"
                            title="Admin Panel"
                        >
                            [ADMIN]
                        </a>
                        <span>NEXT.JS</span>
                    </div>
                </div>
            </footer>
        </main>
    );
}
