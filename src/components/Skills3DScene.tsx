"use client";

import { useRef, useMemo, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text, Float, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

// Skill icons with their colors
const SKILL_DATA = [
    { name: "React", color: "#61DAFB", row: 0, col: 0 },
    { name: "Next.js", color: "#000000", row: 0, col: 1 },
    { name: "TypeScript", color: "#3178C6", row: 0, col: 2 },
    { name: "Node.js", color: "#339933", row: 0, col: 3 },
    { name: "Python", color: "#3776AB", row: 1, col: 0 },
    { name: "PostgreSQL", color: "#4169E1", row: 1, col: 1 },
    { name: "MongoDB", color: "#47A248", row: 1, col: 2 },
    { name: "Docker", color: "#2496ED", row: 1, col: 3 },
    { name: "AWS", color: "#FF9900", row: 2, col: 0 },
    { name: "Git", color: "#F05032", row: 2, col: 1 },
    { name: "Tailwind", color: "#06B6D4", row: 2, col: 2 },
    { name: "GraphQL", color: "#E10098", row: 2, col: 3 },
];

interface SkillBlockProps {
    position: [number, number, number];
    name: string;
    color: string;
    index: number;
    hoveredBlock: number | null;
    setHoveredBlock: (index: number | null) => void;
}

function SkillBlock({ position, name, color, index, hoveredBlock, setHoveredBlock }: SkillBlockProps) {
    const meshRef = useRef<THREE.Mesh>(null);
    const [hovered, setHovered] = useState(false);
    const isHovered = hoveredBlock === index;

    // Animate on hover
    useFrame((state) => {
        if (!meshRef.current) return;

        // Subtle floating animation
        meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + index * 0.5) * 0.05;

        // Scale on hover
        const targetScale = isHovered ? 1.15 : 1;
        meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    });

    return (
        <Float
            speed={1.5}
            rotationIntensity={0.2}
            floatIntensity={0.3}
            floatingRange={[-0.1, 0.1]}
        >
            <group position={position}>
                {/* Block body - sketch style with hard edges */}
                <mesh
                    ref={meshRef}
                    onPointerOver={() => {
                        setHovered(true);
                        setHoveredBlock(index);
                    }}
                    onPointerOut={() => {
                        setHovered(false);
                        setHoveredBlock(null);
                    }}
                >
                    <boxGeometry args={[0.8, 0.8, 0.8]} />
                    <meshStandardMaterial
                        color={isHovered ? color : "#e5e5e5"}
                        roughness={0.9}
                        metalness={0}
                    />
                </mesh>

                {/* Outline effect for sketch aesthetic */}
                <mesh scale={[1.02, 1.02, 1.02]}>
                    <boxGeometry args={[0.8, 0.8, 0.8]} />
                    <meshBasicMaterial color="#000000" wireframe />
                </mesh>

                {/* Text label */}
                <Text
                    position={[0, 0, 0.45]}
                    fontSize={0.15}
                    color={isHovered ? "#ffffff" : "#333333"}
                    anchorX="center"
                    anchorY="middle"
                    font="/fonts/JetBrainsMono-Bold.ttf"
                    maxWidth={0.7}
                >
                    {name}
                </Text>
            </group>
        </Float>
    );
}

function SkillGrid() {
    const groupRef = useRef<THREE.Group>(null);
    const [hoveredBlock, setHoveredBlock] = useState<number | null>(null);
    const { viewport } = useThree();

    // Responsive scaling
    const scale = Math.min(1, viewport.width / 10);

    // Auto-rotate
    useFrame((state) => {
        if (!groupRef.current) return;
        groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.3;
        groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1 - 0.3;
    });

    // Calculate positions for grid
    const blocks = useMemo(() => {
        return SKILL_DATA.map((skill, i) => {
            const x = (skill.col - 1.5) * 1.1;
            const y = (1 - skill.row) * 1.1;
            const z = 0;
            return {
                ...skill,
                position: [x, y, z] as [number, number, number],
                index: i,
            };
        });
    }, []);

    return (
        <group ref={groupRef} scale={scale}>
            {blocks.map((block) => (
                <SkillBlock
                    key={block.name}
                    position={block.position}
                    name={block.name}
                    color={block.color}
                    index={block.index}
                    hoveredBlock={hoveredBlock}
                    setHoveredBlock={setHoveredBlock}
                />
            ))}
        </group>
    );
}

interface Skills3DSceneProps {
    className?: string;
}

export default function Skills3DScene({ className = "" }: Skills3DSceneProps) {
    const [mounted, setMounted] = useState(false);
    const [isDesktop, setIsDesktop] = useState(true);

    useEffect(() => {
        setMounted(true);
        setIsDesktop(window.innerWidth >= 768);

        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 768);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Don't render 3D on mobile for performance
    if (!mounted || !isDesktop) {
        return (
            <div className={`${className} flex items-center justify-center bg-gray-50 border-2 border-black`}>
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

    return (
        <div
            className={`${className} relative`}
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

            <Canvas
                camera={{ position: [0, 0, 6], fov: 45 }}
                style={{
                    background: "linear-gradient(135deg, #fafafa 0%, #f0f0f0 100%)",
                    borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px",
                }}
            >
                <Suspense fallback={null}>
                    {/* Lighting */}
                    <ambientLight intensity={0.6} />
                    <directionalLight position={[5, 5, 5]} intensity={0.8} />
                    <directionalLight position={[-5, -5, -5]} intensity={0.3} />

                    {/* Skills Grid */}
                    <SkillGrid />

                    {/* Subtle orbit controls */}
                    <OrbitControls
                        enableZoom={false}
                        enablePan={false}
                        maxPolarAngle={Math.PI / 1.5}
                        minPolarAngle={Math.PI / 3}
                    />
                </Suspense>
            </Canvas>

            {/* Hint text */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 font-mono text-xs text-gray-400 z-20">
                HOVER TO REVEAL
            </div>
        </div>
    );
}
