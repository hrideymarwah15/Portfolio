"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface LeetCodeStats {
    username: string;
    totalSolved: number;
    easySolved: number;
    mediumSolved: number;
    hardSolved: number;
    streak: number;
    totalActiveDays: number;
    submissionCalendar: { [timestamp: string]: number };
    isEmpty?: boolean;
    error?: string;
}

interface ProblemSolvingSectionProps {
    username: string;
}

// Amber color scale for activity grid (never themed - per design system)
const getIntensityColor = (count: number): string => {
    if (count === 0) return "bg-gray-100 border-gray-200";
    if (count === 1) return "bg-amber-100 border-amber-200";
    if (count <= 3) return "bg-amber-200 border-amber-300";
    if (count <= 5) return "bg-amber-300 border-amber-400";
    return "bg-amber-400 border-amber-500";
};

// Process submission calendar into weeks for display
const getWeeksData = (submissionCalendar: { [timestamp: string]: number }) => {
    const weeks: { date: string; count: number }[][] = [];
    const today = new Date();
    const oneYearAgo = new Date(today);
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    // Create a map from date string to count for easier lookup
    const dateToCount: { [dateStr: string]: number } = {};

    // LeetCode returns timestamps in seconds (Unix epoch)
    Object.entries(submissionCalendar).forEach(([timestamp, count]) => {
        const date = new Date(parseInt(timestamp) * 1000);
        const dateStr = date.toISOString().split("T")[0];
        dateToCount[dateStr] = (dateToCount[dateStr] || 0) + count;
    });

    // Start from Sunday of the week one year ago
    const startDate = new Date(oneYearAgo);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    let currentWeek: { date: string; count: number }[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= today) {
        const dateStr = currentDate.toISOString().split("T")[0];
        const count = dateToCount[dateStr] || 0;

        currentWeek.push({ date: dateStr, count });

        if (currentDate.getDay() === 6) {
            weeks.push(currentWeek);
            currentWeek = [];
        }

        currentDate.setDate(currentDate.getDate() + 1);
    }

    if (currentWeek.length > 0) {
        weeks.push(currentWeek);
    }

    // Ensure we show last 52 weeks
    return weeks.slice(-52);
};

const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function ProblemSolvingSection({ username }: ProblemSolvingSectionProps) {
    const [stats, setStats] = useState<LeetCodeStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch(`/api/leetcode/stats?username=${username}`);
                const data = await response.json();
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch problem solving stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [username]);

    // Loading state
    if (loading) {
        return (
            <div
                className="relative bg-[var(--background)] border-2 border-[var(--border)] p-8 shadow-hard"
                style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}
            >
                <div className="flex items-center gap-3">
                    <motion.div
                        className="w-5 h-5 border-2 border-[var(--foreground)] border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <span className="font-mono text-[var(--muted)] text-sm">LOADING ACTIVITY...</span>
                </div>
            </div>
        );
    }

    // Empty state per plan: "Enable section only after solving at least 5-10 problems"
    // Graceful empty state: hide section entirely if no meaningful data
    if (!stats || stats.isEmpty || stats.totalSolved < 5) {
        return null;
    }

    const weeks = getWeeksData(stats.submissionCalendar);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative bg-[var(--background)] border-2 border-[var(--border)] p-6 md:p-8 shadow-hard"
            style={{ borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px" }}
        >
            {/* Tape decoration */}
            <div className="absolute -top-3 left-8 w-16 h-5 bg-amber-100/80 rotate-[-2deg] border border-amber-200 z-10" />

            {/* Stats Grid - Per plan: Total, Easy/Medium/Hard, Streak */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {/* Total Solved */}
                <div className="bg-[var(--card-bg)] border-2 border-[var(--border)] p-4 shadow-hard-sm">
                    <span className="font-mono text-xs text-[var(--muted)] uppercase tracking-wider">SOLVED</span>
                    <p className="font-mono font-black text-2xl md:text-3xl text-[var(--foreground)]">{stats.totalSolved}</p>
                </div>

                {/* Streak - Sticky note style (never themed per design system) */}
                <div className="sticky-note p-4">
                    <span className="font-mono text-xs text-gray-500 uppercase tracking-wider">STREAK</span>
                    <p className="font-mono font-black text-2xl md:text-3xl text-black">{stats.streak}</p>
                </div>

                {/* Active Days */}
                <div className="bg-[var(--card-bg)] border-2 border-[var(--border)] p-4 shadow-hard-sm">
                    <span className="font-mono text-xs text-[var(--muted)] uppercase tracking-wider">ACTIVE</span>
                    <p className="font-mono font-black text-2xl md:text-3xl text-[var(--foreground)]">{stats.totalActiveDays}</p>
                </div>

                {/* Placeholder for balance */}
                <div className="hidden md:block" />
            </div>

            {/* Difficulty Breakdown - Per plan: Easy/Medium/Hard with colors (never themed) */}
            <div className="flex flex-wrap gap-3 mb-8">
                {/* Easy - Green */}
                <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border-2 border-green-300 shadow-hard-sm">
                    <span className="font-mono text-xs text-gray-500 uppercase">EASY</span>
                    <span className="font-mono font-bold text-green-700">{stats.easySolved}</span>
                </div>

                {/* Medium - Amber */}
                <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border-2 border-amber-300 shadow-hard-sm">
                    <span className="font-mono text-xs text-gray-500 uppercase">MEDIUM</span>
                    <span className="font-mono font-bold text-amber-700">{stats.mediumSolved}</span>
                </div>

                {/* Hard - Red */}
                <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border-2 border-red-300 shadow-hard-sm">
                    <span className="font-mono text-xs text-gray-500 uppercase">HARD</span>
                    <span className="font-mono font-bold text-red-700">{stats.hardSolved}</span>
                </div>
            </div>

            {/* Activity Grid - Per plan: 52-week heatmap with amber theme */}
            <div className="overflow-x-auto">
                <div className="min-w-[700px]">
                    {/* Month Labels */}
                    <div className="flex mb-1 text-xs font-mono text-[var(--muted)]">
                        <div className="w-8" /> {/* Spacer for day labels */}
                        {weeks.map((week, weekIndex) => {
                            const firstDay = new Date(week[0]?.date);
                            const showLabel = firstDay.getDate() <= 7 && weekIndex > 0;
                            return (
                                <div key={weekIndex} className="w-3 text-center">
                                    {showLabel && <span>{monthLabels[firstDay.getMonth()]}</span>}
                                </div>
                            );
                        })}
                    </div>

                    {/* Grid */}
                    <div className="flex">
                        {/* Day Labels */}
                        <div className="flex flex-col gap-[2px] mr-1 text-xs font-mono text-[var(--muted)]">
                            <span className="h-3 leading-3">S</span>
                            <span className="h-3 leading-3">M</span>
                            <span className="h-3 leading-3">T</span>
                            <span className="h-3 leading-3">W</span>
                            <span className="h-3 leading-3">T</span>
                            <span className="h-3 leading-3">F</span>
                            <span className="h-3 leading-3">S</span>
                        </div>

                        {/* Weeks */}
                        <div className="flex gap-[2px]">
                            {weeks.map((week, weekIndex) => (
                                <div key={weekIndex} className="flex flex-col gap-[2px]">
                                    {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => {
                                        const day = week[dayIndex];
                                        if (!day) {
                                            return <div key={dayIndex} className="w-3 h-3" />;
                                        }
                                        return (
                                            <div
                                                key={dayIndex}
                                                className={`w-3 h-3 border ${getIntensityColor(day.count)} transition-colors`}
                                                title={`${day.date}: ${day.count} submissions`}
                                            />
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="flex items-center justify-end gap-1 mt-3 text-xs font-mono text-[var(--muted)]">
                        <span>LESS</span>
                        <div className="w-3 h-3 bg-gray-100 border border-gray-200" />
                        <div className="w-3 h-3 bg-amber-100 border border-amber-200" />
                        <div className="w-3 h-3 bg-amber-200 border border-amber-300" />
                        <div className="w-3 h-3 bg-amber-300 border border-amber-400" />
                        <div className="w-3 h-3 bg-amber-400 border border-amber-500" />
                        <span>MORE</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
