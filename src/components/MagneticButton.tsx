"use client";

import { useRef, useState, ReactNode } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useTheme } from "next-themes";

interface MagneticButtonProps {
    children: ReactNode;
    href?: string;
    onClick?: () => void;
    variant?: "primary" | "secondary";
    className?: string;
    external?: boolean;
}

/**
 * Magnetic Button Component
 * 
 * Inspired by Naresh-Khatri/3d-portfolio button effects.
 * Adapted to sketch aesthetic:
 * - Cursor-following effect within button bounds
 * - Slight scale + shadow intensification on hover
 * - Hard black borders maintained
 * - Dark mode support
 */
export default function MagneticButton({
    children,
    href,
    onClick,
    variant = "primary",
    className = "",
    external = false,
}: MagneticButtonProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);
    const { resolvedTheme } = useTheme();

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Calculate offset from center (limited to 8px movement)
        const maxOffset = 8;
        const x = ((e.clientX - centerX) / rect.width) * maxOffset;
        const y = ((e.clientY - centerY) / rect.height) * maxOffset;

        setPosition({ x, y });
    };

    const handleMouseLeave = () => {
        setPosition({ x: 0, y: 0 });
        setIsHovered(false);
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const baseStyles = `
    relative font-mono font-bold text-lg border-2 
    transition-colors duration-200 cursor-pointer inline-block
    ${variant === "primary"
            ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white hover:bg-white dark:hover:bg-zinc-900 hover:text-black dark:hover:text-white"
            : "bg-white dark:bg-zinc-900 text-black dark:text-white border-black dark:border-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black"
        }
    ${className}
  `.trim();

    const content = (
        <motion.span
            className="block px-8 py-3"
            animate={{
                x: position.x,
                y: position.y,
            }}
            transition={{
                type: "spring",
                stiffness: 350,
                damping: 15,
                mass: 0.5,
            }}
        >
            {children}
        </motion.span>
    );

    const isDark = resolvedTheme === "dark";
    const shadowColor = isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,1)";
    
    const motionProps = {
        animate: {
            scale: isHovered ? 1.02 : 1,
            boxShadow: isHovered
                ? `6px 6px 0px 0px ${shadowColor}`
                : `4px 4px 0px 0px ${shadowColor}`,
        },
        transition: {
            type: "spring" as const,
            stiffness: 300,
            damping: 20,
        },
    };

    if (href) {
        if (external) {
            return (
                <motion.div
                    ref={containerRef}
                    onMouseMove={handleMouseMove}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    className="inline-block"
                    {...motionProps}
                >
                    <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={baseStyles}
                    >
                        {content}
                    </a>
                </motion.div>
            );
        }

        return (
            <motion.div
                ref={containerRef}
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="inline-block"
                {...motionProps}
            >
                <Link href={href} className={baseStyles}>
                    {content}
                </Link>
            </motion.div>
        );
    }

    return (
        <motion.div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="inline-block"
            {...motionProps}
        >
            <button onClick={onClick} className={baseStyles}>
                {content}
            </button>
        </motion.div>
    );
}

