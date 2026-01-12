"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export function ScrollEntrance({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once: true,
    margin: "-100px 0px -100px 0px",
  });

  return (
    <>
      <div ref={ref} className="absolute pointer-events-none h-px" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{
          duration: 0.8,
          ease: "easeOut",
          delay: Math.min(delay, 0.1),
        }}
      >
        {children}
      </motion.div>
    </>
  );
}
export default function ProjectsSection() {
  return null;
}