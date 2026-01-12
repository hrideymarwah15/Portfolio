"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const codeLines = [
    { text: "const developer = {", delay: 0 },
    { text: '  name: "Hridey Marwah",', delay: 100 },
    { text: "  skills: [", delay: 200 },
    { text: '    "TypeScript",', delay: 300 },
    { text: '    "React",', delay: 400 },
    { text: '    "Node.js",', delay: 500 },
    { text: '    "System Design"', delay: 600 },
    { text: "  ],", delay: 700 },
    { text: "  available: true,", delay: 800 },
    { text: '  status: "building..."', delay: 900 },
    { text: "};", delay: 1000 },
];

export default function CodeTypewriter() {
    const [visibleLines, setVisibleLines] = useState<number>(0);
    const [currentChar, setCurrentChar] = useState<number>(0);
    const [isTyping, setIsTyping] = useState(true);

    useEffect(() => {
        if (visibleLines >= codeLines.length) {
            setIsTyping(false);
            return;
        }

        const currentLine = codeLines[visibleLines];

        if (currentChar < currentLine.text.length) {
            const timer = setTimeout(() => {
                setCurrentChar((prev) => prev + 1);
            }, 30 + Math.random() * 20); // Variable typing speed
            return () => clearTimeout(timer);
        } else {
            const timer = setTimeout(() => {
                setVisibleLines((prev) => prev + 1);
                setCurrentChar(0);
            }, 150);
            return () => clearTimeout(timer);
        }
    }, [visibleLines, currentChar]);

    const getColorClass = (text: string) => {
        if (text.includes("const") || text.includes("true")) return "text-purple-600";
        if (text.includes('"') || text.includes("'")) return "text-green-600";
        if (text.includes(":") && !text.includes('"')) return "text-blue-500";
        return "text-gray-800";
    };

    return (
        <motion.div
            className="relative bg-gray-50 border-2 border-black p-4 md:p-6 font-mono text-xs md:text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
            style={{ borderRadius: "2px 20px 3px 20px / 20px 3px 20px 3px" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
        >
            {/* Terminal header */}
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-dashed border-gray-300">
                <div className="w-3 h-3 rounded-full bg-red-400 border border-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-400 border border-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-400 border border-green-500" />
                <span className="ml-2 text-[10px] text-gray-400 uppercase tracking-widest">
          // developer.ts
                </span>
            </div>

            {/* Code lines */}
            <div className="space-y-1">
                {codeLines.map((line, index) => {
                    if (index > visibleLines) return null;

                    const displayText = index === visibleLines
                        ? line.text.slice(0, currentChar)
                        : line.text;

                    return (
                        <div key={index} className="flex">
                            <span className="text-gray-400 w-6 select-none text-right mr-4">
                                {index + 1}
                            </span>
                            <span className={getColorClass(line.text)}>
                                {displayText}
                                {index === visibleLines && isTyping && (
                                    <motion.span
                                        className="inline-block w-2 h-4 bg-black ml-0.5 -mb-0.5"
                                        animate={{ opacity: [1, 0] }}
                                        transition={{ duration: 0.5, repeat: Infinity }}
                                    />
                                )}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Blinking cursor after completion */}
            {!isTyping && (
                <div className="flex mt-2">
                    <span className="text-gray-400 w-6 select-none text-right mr-4">
                        {codeLines.length + 1}
                    </span>
                    <motion.span
                        className="inline-block w-2 h-4 bg-black"
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                    />
                </div>
            )}
        </motion.div>
    );
}
