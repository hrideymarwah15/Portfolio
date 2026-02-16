"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "light";

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
    mounted: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Enforce light theme
        document.documentElement.setAttribute("data-theme", "light");
        setMounted(true);
    }, []);

    const setTheme = () => {
        // No-op
    };

    const toggleTheme = () => {
        // No-op
    };

    return (
        <ThemeContext.Provider value={{ theme: "light", setTheme, toggleTheme, mounted }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
