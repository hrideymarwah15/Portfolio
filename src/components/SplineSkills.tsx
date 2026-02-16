"use client";

import React, { Suspense, useState, useEffect } from "react";
const Spline = React.lazy(() => import("@splinetool/react-spline"));

interface SplineSkillsProps {
    className?: string;
    // You can get a scene URL from Spline's export feature
    // Example: "https://prod.spline.design/your-scene-id/scene.splinecode"
    sceneUrl?: string;
}

export default function SplineSkills({
    className = "",
    // Default to a placeholder scene - replace with your own Spline scene URL
    sceneUrl = "https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode"
}: SplineSkillsProps) {
    const [mounted, setMounted] = useState(false);
    const [isDesktop, setIsDesktop] = useState(true);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        setMounted(true);
        setIsDesktop(window.innerWidth >= 768);

        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 768);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Mobile fallback
    if (!mounted || !isDesktop) {
        return (
            <div
                className={`${className} flex items-center justify-center bg-gray-50 border-2 border-black`}
                style={{
                    borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px",
                }}
            >
                <div className="text-center p-8">
                    <div className="font-mono text-gray-500 text-sm">
                        [3D SKILLS VIEW]
                    </div>
                    <div className="font-mono text-xs text-gray-400 mt-2">
                        Available on desktop
                    </div>
                </div>
            </div>
        );
    }

    // Error fallback
    if (hasError) {
        return (
            <div
                className={`${className} flex items-center justify-center bg-gray-50 border-2 border-black`}
                style={{
                    borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px",
                }}
            >
                <div className="text-center p-8">
                    <div className="font-mono text-gray-500 text-sm">
                        [3D Scene]
                    </div>
                    <div className="font-mono text-xs text-gray-400 mt-2">
                        Loading...
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className={`${className} relative overflow-hidden`}
            style={{
                borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px",
            }}
        >
            {/* Sketch border */}
            <div
                className="absolute inset-0 border-2 border-black pointer-events-none z-10"
                style={{
                    borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px",
                }}
            />

            {/* Tape decoration */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-5 bg-yellow-100/70 rotate-[1deg] border border-gray-300 z-20" />

            <Suspense
                fallback={
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <div className="font-mono text-gray-400 text-sm animate-pulse">
                            Loading 3D Scene...
                        </div>
                    </div>
                }
            >
                <Spline
                    scene={sceneUrl}
                    className="w-full h-full"
                    onError={() => setHasError(true)}
                    style={{
                        borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px",
                    }}
                />
            </Suspense>

            {/* Hint text */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 font-mono text-xs text-gray-400 z-20 bg-white/80 px-2 py-1 rounded">
                DRAG TO ROTATE
            </div>
        </div>
    );
}
