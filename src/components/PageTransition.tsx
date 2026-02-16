"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface PageTransitionProps {
    children: ReactNode;
}

/**
 * Page transition wrapper
 * 
 * Per plan rules:
 * - Maximum 300ms duration
 * - One consistent animation across routes
 * - Fade + slight vertical motion
 * - No fancy easing or gimmicks
 */
export default function PageTransition({ children }: PageTransitionProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{
                duration: 0.3, // Max 300ms per plan
                ease: "easeOut",
            }}
        >
            {children}
        </motion.div>
    );
}
