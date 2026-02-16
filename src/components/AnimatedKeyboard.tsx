"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import { Application, SplineEvent } from "@splinetool/runtime";
const Spline = React.lazy(() => import("@splinetool/react-spline"));
import { Skill, SkillNames, SKILLS } from "@/data/skills";
import { useSounds } from "@/hooks/use-sounds";

interface AnimatedKeyboardProps {
    className?: string;
    onSkillSelect?: (skill: Skill | null) => void;
}

export default function AnimatedKeyboard({
    className = "",
    onSkillSelect,
}: AnimatedKeyboardProps) {
    const splineContainer = useRef<HTMLDivElement>(null);
    const [splineApp, setSplineApp] = useState<Application>();
    const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
    const selectedSkillRef = useRef<Skill | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [mounted, setMounted] = useState(false);
    const [isDesktop, setIsDesktop] = useState(true);

    const { playPressSound, playReleaseSound } = useSounds();

    useEffect(() => {
        setMounted(true);
        setIsDesktop(window.innerWidth >= 768);

        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 768);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Reveal all keycaps after loading (like Naresh's implementation)
    const revealKeycaps = async (app: Application) => {
        const allObjects = app.getAllObjects();

        // Make ALL keycap-related objects visible
        allObjects.forEach((obj) => {
            // Make keycaps visible
            if (
                obj.name === "keycap" ||
                obj.name === "keycap-desktop" ||
                obj.name.startsWith("keycap")
            ) {
                obj.visible = true;
            }

            // Make skill keycaps visible (they're named after skills)
            if (SKILLS[obj.name as SkillNames]) {
                obj.visible = true;
            }
        });
    };

    // Handle mouse hover on keycaps
    const handleMouseHover = (e: SplineEvent) => {
        if (!splineApp || selectedSkillRef.current?.name === e.target.name) return;

        if (
            e.target.name === "body" ||
            e.target.name === "platform" ||
            e.target.name === "keyboard"
        ) {
            if (selectedSkillRef.current) playReleaseSound();
            setSelectedSkill(null);
            selectedSkillRef.current = null;
            try {
                splineApp.setVariable("heading", "");
                splineApp.setVariable("desc", "");
            } catch {
                // Variables may not exist in the scene
            }
        } else {
            const skill = SKILLS[e.target.name as SkillNames];
            if (skill) {
                if (selectedSkillRef.current) playReleaseSound();
                playPressSound();
                setSelectedSkill(skill);
                selectedSkillRef.current = skill;
                onSkillSelect?.(skill);
                try {
                    splineApp.setVariable("heading", skill.label);
                    splineApp.setVariable("desc", skill.shortDescription);
                } catch {
                    // Variables may not exist in the scene
                }
            }
        }
    };

    // Handle keyboard interactions
    const handleSplineInteractions = () => {
        if (!splineApp) return;

        const isInputFocused = () => {
            const activeElement = document.activeElement;
            return (
                activeElement &&
                (activeElement.tagName === "INPUT" ||
                    activeElement.tagName === "TEXTAREA" ||
                    (activeElement as HTMLElement).isContentEditable)
            );
        };

        splineApp.addEventListener("keyUp", () => {
            if (!splineApp || isInputFocused()) return;
            playReleaseSound();
            try {
                splineApp.setVariable("heading", "");
                splineApp.setVariable("desc", "");
            } catch {
                // Variables may not exist
            }
        });

        splineApp.addEventListener("keyDown", (e) => {
            if (!splineApp || isInputFocused()) return;
            const skill = SKILLS[e.target.name as SkillNames];
            if (skill) {
                playPressSound();
                setSelectedSkill(skill);
                selectedSkillRef.current = skill;
                onSkillSelect?.(skill);
                try {
                    splineApp.setVariable("heading", skill.label);
                    splineApp.setVariable("desc", skill.shortDescription);
                } catch {
                    // Variables may not exist
                }
            }
        });

        splineApp.addEventListener("mouseHover", handleMouseHover);
    };

    useEffect(() => {
        if (!splineApp) return;
        handleSplineInteractions();
        revealKeycaps(splineApp);
    }, [splineApp]);

    // Mobile fallback
    if (!mounted || !isDesktop) {
        return (
            <div
                className={`${className} flex items-center justify-center bg-white border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]`}
            >
                <div className="text-center p-8">
                    <div className="font-mono text-black text-sm">[3D KEYBOARD]</div>
                    <div className="font-mono text-xs text-gray-500 mt-2">
                        Available on desktop
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div ref={splineContainer} className={`${className} relative overflow-hidden`}>
            {/* Loading state */}
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-20">
                    <div className="text-center">
                        <div className="font-mono text-gray-500 text-sm animate-pulse">
                            Loading 3D Keyboard...
                        </div>
                    </div>
                </div>
            )}

            <Suspense
                fallback={
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <div className="font-mono text-gray-500 text-sm animate-pulse">
                            Loading...
                        </div>
                    </div>
                }
            >
                <Spline
                    scene="/assets/skills-keyboard.spline"
                    className="w-full h-full"
                    onLoad={(app: Application) => {
                        setSplineApp(app);
                        setIsLoading(false);
                    }}
                />
            </Suspense>

            {/* Skill info display */}
            {selectedSkill && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 text-center bg-black/90 px-4 py-2 rounded-lg border border-gray-600">
                    <div className="font-mono font-bold text-white text-lg">
                        {selectedSkill.label}
                    </div>
                    <div className="font-mono text-gray-400 text-xs mt-1">
                        {selectedSkill.shortDescription}
                    </div>
                </div>
            )}

            {/* Hint text */}
            {!selectedSkill && !isLoading && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 font-mono text-xs text-gray-500 z-20 bg-white/80 px-2 py-1 rounded">
                    (hint: press a key)
                </div>
            )}
        </div>
    );
}
