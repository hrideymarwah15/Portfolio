"use client";

import { motion } from "framer-motion";

export default function AnimatedCoder() {
    return (
        <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
        >
            <div className="relative">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-auto max-w-md mx-auto"
                    style={{ background: 'transparent' }}
                >
                    <source src="/coder-animation.mp4" type="video/mp4" />
                </video>
            </div>
        </motion.div>
    );
}
