"use client";

import React, { Suspense, useEffect, useRef, useState, useCallback } from "react";
import { Application, SplineEvent } from "@splinetool/runtime";
const Spline = React.lazy(() => import("@splinetool/react-spline"));
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Skill, SkillNames, SKILLS } from "@/data/skills";
import { useSounds } from "@/hooks/use-sounds";
import { useTheme } from "next-themes";
import { Section, getKeyboardState } from "./keyboard-config";
import { motion, AnimatePresence } from "framer-motion";

// Register GSAP plugin
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

interface AnimatedBackgroundProps {
    onSectionChange?: (section: Section) => void;
}

export default function AnimatedBackground({ onSectionChange }: AnimatedBackgroundProps) {
    const { theme } = useTheme();
    const splineContainerRef = useRef<HTMLDivElement>(null);
    const [splineApp, setSplineApp] = useState<Application>();
    const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
    const selectedSkillRef = useRef<Skill | null>(null);
    const [activeSection, setActiveSection] = useState<Section>("skills");
    const [isMobile, setIsMobile] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [keyboardRevealed, setKeyboardRevealed] = useState(false);

    const { playPressSound, playReleaseSound } = useSounds();

    // Check if mobile
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Handle mouse hover on keycaps
    const handleMouseHover = useCallback((e: SplineEvent) => {
        if (!splineApp || selectedSkillRef.current?.name === e.target.name) return;

        if (e.target.name === "body" || e.target.name === "platform" || e.target.name === "keyboard") {
            if (selectedSkillRef.current) playReleaseSound();
            setSelectedSkill(null);
            selectedSkillRef.current = null;
            try {
                splineApp.setVariable("heading", "");
                splineApp.setVariable("desc", "");
            } catch {
                // Variables may not exist
            }
        } else {
            const skill = SKILLS[e.target.name as SkillNames];
            if (skill) {
                if (selectedSkillRef.current) playReleaseSound();
                playPressSound();
                setSelectedSkill(skill);
                selectedSkillRef.current = skill;
                try {
                    splineApp.setVariable("heading", skill.label);
                    splineApp.setVariable("desc", skill.shortDescription);
                } catch {
                    // Variables may not exist
                }
            }
        }
    }, [splineApp, playPressSound, playReleaseSound]);

    // Setup Spline interactions
    const handleSplineInteractions = useCallback(() => {
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
                try {
                    splineApp.setVariable("heading", skill.label);
                    splineApp.setVariable("desc", skill.shortDescription);
                } catch {
                    // Variables may not exist
                }
            }
        });

        splineApp.addEventListener("mouseHover", handleMouseHover);
    }, [splineApp, handleMouseHover, playPressSound, playReleaseSound]);

    // Create section scroll timeline
    const createSectionTimeline = useCallback((
        triggerId: string,
        targetSection: Section,
        prevSection: Section,
        start: string = "top 50%",
        end: string = "bottom bottom"
    ) => {
        if (!splineApp) return;
        const kbd = splineApp.findObjectByName("keyboard");
        if (!kbd) return;

        gsap.timeline({
            scrollTrigger: {
                trigger: triggerId,
                start,
                end,
                scrub: true,
                onEnter: () => {
                    setActiveSection(targetSection);
                    onSectionChange?.(targetSection);
                    const state = getKeyboardState({ section: targetSection, isMobile });
                    gsap.to(kbd.scale, { ...state.scale, duration: 1 });
                    gsap.to(kbd.position, { ...state.position, duration: 1 });
                    gsap.to(kbd.rotation, { ...state.rotation, duration: 1 });
                },
                onLeaveBack: () => {
                    setActiveSection(prevSection);
                    onSectionChange?.(prevSection);
                    const state = getKeyboardState({ section: prevSection, isMobile });
                    gsap.to(kbd.scale, { ...state.scale, duration: 1 });
                    gsap.to(kbd.position, { ...state.position, duration: 1 });
                    gsap.to(kbd.rotation, { ...state.rotation, duration: 1 });
                },
            },
        });
    }, [splineApp, isMobile, onSectionChange]);

    // Setup scroll animations
    const setupScrollAnimations = useCallback(() => {
        if (!splineApp || !splineContainerRef.current) return;
        const kbd = splineApp.findObjectByName("keyboard");
        if (!kbd) return;

        // Initial state - skills section
        const skillsState = getKeyboardState({ section: "skills", isMobile });
        gsap.set(kbd.scale, skillsState.scale);
        gsap.set(kbd.position, skillsState.position);
        gsap.set(kbd.rotation, skillsState.rotation);

        // Section transitions
        createSectionTimeline("#experience", "experience", "skills", "top 70%");
        createSectionTimeline("#projects", "projects", "experience", "top 70%");
        createSectionTimeline("#contact-cta", "contact", "projects", "top 50%");
    }, [splineApp, isMobile, createSectionTimeline]);

    // Reveal keyboard animation
    const updateKeyboardTransform = useCallback(async () => {
        if (!splineApp) return;
        const kbd = splineApp.findObjectByName("keyboard");
        if (!kbd) return;

        kbd.visible = false;
        await new Promise(r => setTimeout(r, 300));
        kbd.visible = true;
        setKeyboardRevealed(true);

        const currentState = getKeyboardState({ section: activeSection, isMobile });

        // Elastic reveal animation
        gsap.fromTo(
            kbd.scale,
            { x: 0.01, y: 0.01, z: 0.01 },
            {
                ...currentState.scale,
                duration: 1.5,
                ease: "elastic.out(1, 0.6)",
            }
        );

        // Reveal keycaps with stagger effect
        const allObjects = splineApp.getAllObjects();
        const keycaps = allObjects.filter((obj) => 
            obj.name === "keycap" || 
            obj.name === "keycap-desktop" || 
            SKILLS[obj.name as SkillNames]
        );

        await new Promise(r => setTimeout(r, 800));

        keycaps.forEach(async (keycap, idx) => {
            keycap.visible = false;
            await new Promise(r => setTimeout(r, idx * 50));
            keycap.visible = true;
            gsap.fromTo(
                keycap.position,
                { y: 200 },
                { y: 50, duration: 0.4, ease: "bounce.out" }
            );
        });
    }, [splineApp, activeSection, isMobile]);

    // Initialize keyboard interactions when Spline loads
    useEffect(() => {
        if (!splineApp) return;
        handleSplineInteractions();
        setupScrollAnimations();
    }, [splineApp, handleSplineInteractions, setupScrollAnimations]);

    // Handle keyboard text visibility based on theme
    useEffect(() => {
        if (!splineApp) return;
        
        const textDesktopDark = splineApp.findObjectByName("text-desktop-dark");
        const textDesktopLight = splineApp.findObjectByName("text-desktop");
        const textMobileDark = splineApp.findObjectByName("text-mobile-dark");
        const textMobileLight = splineApp.findObjectByName("text-mobile");

        if (!textDesktopDark && !textDesktopLight && !textMobileDark && !textMobileLight) return;

        const setVisibility = (dDark: boolean, dLight: boolean, mDark: boolean, mLight: boolean) => {
            if (textDesktopDark) textDesktopDark.visible = dDark;
            if (textDesktopLight) textDesktopLight.visible = dLight;
            if (textMobileDark) textMobileDark.visible = mDark;
            if (textMobileLight) textMobileLight.visible = mLight;
        };

        if (activeSection !== "skills") {
            setVisibility(false, false, false, false);
        } else if (theme === "dark") {
            isMobile
                ? setVisibility(false, false, false, true)
                : setVisibility(false, true, false, false);
        } else {
            isMobile
                ? setVisibility(false, false, true, false)
                : setVisibility(true, false, false, false);
        }
    }, [theme, splineApp, isMobile, activeSection]);

    // Update Spline variables when skill selected
    useEffect(() => {
        if (!selectedSkill || !splineApp) return;
        try {
            splineApp.setVariable("heading", selectedSkill.label);
            splineApp.setVariable("desc", selectedSkill.shortDescription);
        } catch {
            // Variables may not exist
        }
    }, [selectedSkill, splineApp]);

    // Keyboard rotation animation based on section
    useEffect(() => {
        if (!splineApp) return;

        const kbd = splineApp.findObjectByName("keyboard");
        if (!kbd) return;

        let rotationTween: gsap.core.Tween | undefined;

        // Slow rotation when in skills section
        if (activeSection === "skills") {
            rotationTween = gsap.to(kbd.rotation, {
                y: kbd.rotation.y + Math.PI * 2,
                duration: 20,
                repeat: -1,
                ease: "none",
            });
        }

        // Clear text when not in skills
        if (activeSection !== "skills") {
            try {
                splineApp.setVariable("heading", "");
                splineApp.setVariable("desc", "");
            } catch {
                // Variables may not exist
            }
        }

        return () => {
            rotationTween?.kill();
        };
    }, [activeSection, splineApp]);

    // Reveal keyboard on load
    useEffect(() => {
        if (!splineApp || isLoading || keyboardRevealed) return;
        updateKeyboardTransform();
    }, [splineApp, isLoading, keyboardRevealed, updateKeyboardTransform]);

    return (
        <>
            {/* Fixed 3D Keyboard Background */}
            <div 
                ref={splineContainerRef}
                className="fixed inset-0 w-full h-full z-0"
                style={{ pointerEvents: 'auto' }}
            >
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-zinc-950 z-50">
                        <div className="text-center">
                            <div className="w-16 h-16 border-4 border-gray-200 dark:border-zinc-700 border-t-black dark:border-t-white rounded-full animate-spin mx-auto mb-4" />
                            <div className="font-mono text-gray-500 dark:text-zinc-400 text-sm">
                                Loading 3D Experience...
                            </div>
                        </div>
                    </div>
                )}

                <Suspense
                    fallback={
                        <div className="w-full h-full flex items-center justify-center">
                            <div className="font-mono text-gray-500 dark:text-zinc-400 text-sm animate-pulse">
                                Initializing...
                            </div>
                        </div>
                    }
                >
                    <Spline
                        scene="/assets/skills-keyboard.spline"
                        className="w-full h-full"
                        style={{ pointerEvents: 'auto' }}
                        onLoad={(app: Application) => {
                            setSplineApp(app);
                            setIsLoading(false);
                        }}
                    />
                </Suspense>
            </div>

            {/* Skill Info Tooltip - Fixed Position */}
            <AnimatePresence>
                {selectedSkill && activeSection === "skills" && (
                    <motion.div 
                        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="bg-white dark:bg-zinc-900 border-2 border-black dark:border-white px-6 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)]">
                            <div className="flex items-center gap-3">
                                {selectedSkill.icon && (
                                    <img 
                                        src={selectedSkill.icon} 
                                        alt={selectedSkill.label}
                                        className="w-8 h-8 object-contain"
                                    />
                                )}
                                <div>
                                    <div className="font-mono font-bold text-black dark:text-white text-lg">
                                        {selectedSkill.label}
                                    </div>
                                    <div className="font-mono text-gray-600 dark:text-zinc-400 text-sm">
                                        {selectedSkill.shortDescription}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Interactive Skills Grid - Shows in skills section */}
            <AnimatePresence>
                {activeSection === "skills" && !isLoading && (
                    <motion.div
                        className="fixed top-32 left-6 z-40 max-w-xs"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3, delay: 0.5 }}
                    >
                        <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm border-2 border-black dark:border-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)]">
                            <div className="font-mono text-xs text-gray-500 dark:text-zinc-500 mb-3 uppercase tracking-wider">
                                // Click a skill
                            </div>
                            <div className="grid grid-cols-5 gap-2">
                                {Object.values(SKILLS).slice(0, 20).map((skill) => (
                                    <motion.button
                                        key={skill.name}
                                        onClick={() => {
                                            playPressSound();
                                            setSelectedSkill(skill);
                                            selectedSkillRef.current = skill;
                                        }}
                                        onMouseEnter={() => {
                                            if (selectedSkillRef.current?.name !== skill.name) {
                                                setSelectedSkill(skill);
                                                selectedSkillRef.current = skill;
                                            }
                                        }}
                                        onMouseLeave={() => {
                                            playReleaseSound();
                                        }}
                                        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 border-2 ${
                                            selectedSkill?.name === skill.name
                                                ? 'border-black dark:border-white scale-110 shadow-lg'
                                                : 'border-transparent hover:border-gray-300 dark:hover:border-zinc-600'
                                        }`}
                                        style={{ backgroundColor: skill.color + '20' }}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        title={skill.label}
                                    >
                                        <img 
                                            src={skill.icon} 
                                            alt={skill.label}
                                            className="w-6 h-6 object-contain"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = 'none';
                                            }}
                                        />
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
