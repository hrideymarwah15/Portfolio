"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import { useTheme } from "next-themes";

interface ParticleProps {
    className?: string;
    quantity?: number;
    staticity?: number;
    ease?: number;
    refresh?: boolean;
}

interface Circle {
    x: number;
    y: number;
    translateX: number;
    translateY: number;
    size: number;
    alpha: number;
    targetAlpha: number;
    dx: number;
    dy: number;
    magnetism: number;
}

interface MousePosition {
    x: number;
    y: number;
}

function hexToRgb(hex: string): number[] {
    hex = hex.replace("#", "");
    if (hex.length === 3) {
        hex = hex
            .split("")
            .map((char) => char + char)
            .join("");
    }
    const hexInt = parseInt(hex, 16);
    const red = (hexInt >> 16) & 255;
    const green = (hexInt >> 8) & 255;
    const blue = hexInt & 255;
    return [red, green, blue];
}

export default function Particles({
    className = "",
    quantity = 50,
    staticity = 50,
    ease = 50,
    refresh = false,
}: ParticleProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const canvasContainerRef = useRef<HTMLDivElement>(null);
    const context = useRef<CanvasRenderingContext2D | null>(null);
    const circles = useRef<Circle[]>([]);
    const mousePosition = useRef<MousePosition>({ x: 0, y: 0 });
    const mouse = useRef<MousePosition>({ x: 0, y: 0 });
    const canvasSize = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
    const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1;
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const color = resolvedTheme === "dark" ? "#ffffff" : "#000000";
    const rgb = hexToRgb(color);

    const circleParams = useCallback((): Circle => {
        const x = Math.floor(Math.random() * canvasSize.current.w);
        const y = Math.floor(Math.random() * canvasSize.current.h);
        const translateX = 0;
        const translateY = 0;
        const size = Math.floor(Math.random() * 2) + 1;
        const alpha = 0;
        const targetAlpha = parseFloat((Math.random() * 0.6 + 0.1).toFixed(1));
        const dx = (Math.random() - 0.5) * 0.2;
        const dy = (Math.random() - 0.5) * 0.2;
        const magnetism = 0.1 + Math.random() * 4;
        return { x, y, translateX, translateY, size, alpha, targetAlpha, dx, dy, magnetism };
    }, []);

    const drawCircle = useCallback((circle: Circle, update = false) => {
        if (!context.current) return;

        const { x, y, translateX, translateY, size, alpha } = circle;
        context.current.translate(translateX, translateY);
        context.current.beginPath();
        context.current.arc(x, y, size, 0, 2 * Math.PI);
        context.current.fillStyle = `rgba(${rgb.join(", ")}, ${alpha})`;
        context.current.fill();
        context.current.setTransform(dpr, 0, 0, dpr, 0, 0);

        if (!update) {
            circles.current.push(circle);
        }
    }, [rgb, dpr]);

    const clearContext = useCallback(() => {
        if (context.current) {
            context.current.clearRect(0, 0, canvasSize.current.w, canvasSize.current.h);
        }
    }, []);

    const drawParticles = useCallback(() => {
        clearContext();
        const particleCount = quantity;
        for (let i = 0; i < particleCount; i++) {
            const circle = circleParams();
            drawCircle(circle);
        }
    }, [clearContext, circleParams, drawCircle, quantity]);

    const remapValue = (
        value: number,
        start1: number,
        end1: number,
        start2: number,
        end2: number
    ): number => {
        const remapped = ((value - start1) * (end2 - start2)) / (end1 - start1) + start2;
        return remapped > 0 ? remapped : 0;
    };

    const animate = useCallback(() => {
        clearContext();
        circles.current.forEach((circle: Circle, i: number) => {
            // Handle alpha animation
            const edge = [
                circle.x + circle.translateX - circle.size,
                canvasSize.current.w - circle.x - circle.translateX - circle.size,
                circle.y + circle.translateY - circle.size,
                canvasSize.current.h - circle.y - circle.translateY - circle.size,
            ];
            const closestEdge = edge.reduce((a, b) => Math.min(a, b));
            const remapClosestEdge = parseFloat(remapValue(closestEdge, 0, 20, 0, 1).toFixed(2));
            if (remapClosestEdge > 1) {
                circle.alpha += 0.02;
                if (circle.alpha > circle.targetAlpha) {
                    circle.alpha = circle.targetAlpha;
                }
            } else {
                circle.alpha = circle.targetAlpha * remapClosestEdge;
            }
            circle.x += circle.dx;
            circle.y += circle.dy;
            circle.translateX +=
                (mouse.current.x / (staticity / circle.magnetism) - circle.translateX) / ease;
            circle.translateY +=
                (mouse.current.y / (staticity / circle.magnetism) - circle.translateY) / ease;

            // Wrap around the canvas
            if (circle.x < -circle.size) circle.x = canvasSize.current.w + circle.size;
            if (circle.x > canvasSize.current.w + circle.size) circle.x = -circle.size;
            if (circle.y < -circle.size) circle.y = canvasSize.current.h + circle.size;
            if (circle.y > canvasSize.current.h + circle.size) circle.y = -circle.size;

            drawCircle(circle, true);
        });
        window.requestAnimationFrame(animate);
    }, [clearContext, drawCircle, staticity, ease]);

    const initCanvas = useCallback(() => {
        if (!canvasContainerRef.current || !canvasRef.current) return;

        circles.current = [];
        canvasSize.current.w = canvasContainerRef.current.offsetWidth;
        canvasSize.current.h = canvasContainerRef.current.offsetHeight;
        canvasRef.current.width = canvasSize.current.w * dpr;
        canvasRef.current.height = canvasSize.current.h * dpr;
        canvasRef.current.style.width = `${canvasSize.current.w}px`;
        canvasRef.current.style.height = `${canvasSize.current.h}px`;
        context.current = canvasRef.current.getContext("2d");
        if (context.current) {
            context.current.scale(dpr, dpr);
        }
        drawParticles();
    }, [dpr, drawParticles]);

    const onMouseMove = useCallback((e: MouseEvent) => {
        if (canvasRef.current) {
            const rect = canvasRef.current.getBoundingClientRect();
            const { w, h } = canvasSize.current;
            const x = e.clientX - rect.left - w / 2;
            const y = e.clientY - rect.top - h / 2;
            const inside = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
            if (inside) {
                mouse.current.x = x;
                mouse.current.y = y;
            }
        }
    }, []);

    useEffect(() => {
        if (mounted) {
            initCanvas();
            animate();
            window.addEventListener("resize", initCanvas);
            window.addEventListener("mousemove", onMouseMove);

            return () => {
                window.removeEventListener("resize", initCanvas);
                window.removeEventListener("mousemove", onMouseMove);
            };
        }
    }, [mounted, initCanvas, animate, onMouseMove]);

    useEffect(() => {
        if (mounted) {
            initCanvas();
        }
    }, [refresh, resolvedTheme, mounted, initCanvas]);

    if (!mounted) return null;

    return (
        <div className={className} ref={canvasContainerRef} aria-hidden="true">
            <canvas ref={canvasRef} />
        </div>
    );
}
