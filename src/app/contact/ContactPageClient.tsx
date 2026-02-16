"use client";

import { motion } from "framer-motion";
import { Mail, Github, Linkedin } from "lucide-react";
import MessageForm from "@/components/MessageForm";

interface ContactPageClientProps {
    contact: {
        email: string;
        github: string;
        linkedin: string;
        portfolio?: string;
        description: string;
    };
    availability: {
        isAvailable: boolean;
        message: string;
    };
}

export default function ContactPageClient({ contact, availability }: ContactPageClientProps) {
    return (
        <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-24 pb-16">
            {/* Grid Background */}
            <div
                className="fixed inset-0 pointer-events-none opacity-[0.03]"
                style={{
                    backgroundImage:
                        "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
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
                        <span className="text-xs font-mono text-[var(--muted)] uppercase tracking-widest mb-4 block">
              // CONTACT
                        </span>
                        <h1 className="font-mono font-bold text-4xl md:text-5xl tracking-tighter mb-8 text-[var(--foreground)]">
                            GET IN TOUCH
                        </h1>

                        {/* Availability Badge */}
                        {availability.isAvailable ? (
                            <div className="inline-flex items-center gap-2 px-4 py-2 border rounded-full font-mono text-sm bg-green-50 border-green-200 text-green-700 mb-8">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                </span>
                                {availability.message}
                            </div>
                        ) : (
                            <div className="inline-flex items-center gap-2 px-4 py-2 border rounded-full font-mono text-sm bg-gray-50 border-gray-200 text-gray-600 mb-8">
                                <span className="relative flex h-3 w-3">
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-gray-400"></span>
                                </span>
                                {availability.message}
                            </div>
                        )}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="grid md:grid-cols-2 gap-10"
                    >
                        {/* Contact Info - Sticky Note Style (Never themed per design system) */}
                        <div
                            className="sticky-note relative p-8"
                        >
                            {/* Tape decoration */}
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-200/50 rotate-[1deg] border border-gray-300" />

                            <p className="text-gray-600 mb-6">{contact.description}</p>

                            <div className="flex flex-wrap gap-3">
                                <a
                                    href={`mailto:${contact.email}`}
                                    className="flex items-center gap-2 px-4 py-2 border-2 border-black bg-white font-mono font-bold text-sm text-black hover:bg-black hover:text-white transition-colors shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px]"
                                >
                                    <Mail size={14} />
                                    EMAIL
                                </a>
                                <a
                                    href={contact.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-4 py-2 border-2 border-black bg-white font-mono font-bold text-sm text-black hover:bg-black hover:text-white transition-colors shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px]"
                                >
                                    <Github size={14} />
                                    GITHUB
                                </a>
                                <a
                                    href={contact.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-4 py-2 border-2 border-black bg-white font-mono font-bold text-sm text-black hover:bg-black hover:text-white transition-colors shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px]"
                                >
                                    <Linkedin size={14} />
                                    LINKEDIN
                                </a>
                            </div>
                        </div>

                        {/* Message Form */}
                        <MessageForm />
                    </motion.div>
                </div>
            </div>
        </main>
    );
}
