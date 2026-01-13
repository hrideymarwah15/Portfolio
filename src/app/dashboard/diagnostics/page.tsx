import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DiagnosticsClient from "./DiagnosticsClient";

// Force dynamic rendering
export const dynamic = "force-dynamic";

interface SecurityIssue {
    id: string;
    severity: "critical" | "high" | "medium" | "low" | "info";
    category: string;
    title: string;
    description: string;
    recommendation: string;
    status: "open" | "resolved" | "acknowledged";
}

interface SystemHealth {
    database: "healthy" | "degraded" | "down";
    api: "healthy" | "degraded" | "down";
    auth: "healthy" | "degraded" | "down";
    analytics: "healthy" | "degraded" | "down";
}

async function checkSystemHealth(): Promise<SystemHealth> {
    const supabase = await createClient();
    const health: SystemHealth = {
        database: "healthy",
        api: "healthy",
        auth: "healthy",
        analytics: "healthy",
    };

    // Check database
    try {
        const { error } = await supabase.from("projects").select("id").limit(1);
        if (error) health.database = "degraded";
    } catch {
        health.database = "down";
    }

    // Check auth
    try {
        const { error } = await supabase.auth.getUser();
        if (error) health.auth = "degraded";
    } catch {
        health.auth = "down";
    }

    // Check analytics
    try {
        const { error } = await supabase.from("analytics_events").select("id").limit(1);
        if (error) health.analytics = "degraded";
    } catch {
        health.analytics = "down";
    }

    return health;
}

function getSecurityAudit(): SecurityIssue[] {
    // Static security audit results - in production, this could be from a stored scan
    return [
        {
            id: "sec-001",
            severity: "info",
            category: "Authentication",
            title: "IP-Based Session Tracking",
            description: "Sessions are tracked using SHA-256 hashed IP addresses, providing privacy while preventing abuse.",
            recommendation: "Current implementation is secure. Consider adding rate limiting headers.",
            status: "resolved",
        },
        {
            id: "sec-002",
            severity: "low",
            category: "Content Security",
            title: "Markdown HTML Rendering",
            description: "Blog posts use dangerouslySetInnerHTML with marked library for markdown rendering.",
            recommendation: "Consider using DOMPurify to sanitize HTML output for additional XSS protection.",
            status: "acknowledged",
        },
        {
            id: "sec-003",
            severity: "info",
            category: "Dependencies",
            title: "No Known Vulnerabilities",
            description: "npm audit reports 0 vulnerabilities across 457 dependencies.",
            recommendation: "Continue running npm audit regularly and update dependencies.",
            status: "resolved",
        },
        {
            id: "sec-004",
            severity: "info",
            category: "API Security",
            title: "Owner-Only API Access",
            description: "Sensitive API routes (GitHub repos, AI analysis) are restricted to owner email.",
            recommendation: "Consider adding role-based access control for future admin expansion.",
            status: "resolved",
        },
        {
            id: "sec-005",
            severity: "medium",
            category: "Rate Limiting",
            title: "No Rate Limiting on Analytics",
            description: "The analytics tracking endpoint doesn't have explicit rate limiting.",
            recommendation: "Add rate limiting middleware to prevent abuse and DoS attacks.",
            status: "open",
        },
        {
            id: "sec-006",
            severity: "low",
            category: "Environment",
            title: "Environment Variables Configuration",
            description: "Supabase credentials are properly stored in .env file with public anon key exposed (expected).",
            recommendation: "Ensure .env is in .gitignore and secrets are never committed.",
            status: "resolved",
        },
        {
            id: "sec-007",
            severity: "info",
            category: "AI/Analysis",
            title: "Local Pattern Matching",
            description: "Project analysis uses local pattern matching instead of external AI APIs.",
            recommendation: "No external data exposure. Consider adding OpenAI/Gemini for enhanced analysis.",
            status: "acknowledged",
        },
    ];
}

interface Recommendation {
    id: string;
    priority: "high" | "medium" | "low";
    category: string;
    title: string;
    description: string;
    effort: "Low" | "Medium" | "High";
}

function getRecommendations(): Recommendation[] {
    return [
        {
            id: "rec-001",
            priority: "high",
            category: "Performance",
            title: "Add Image Optimization",
            description: "Use Next.js Image component for project and blog images to improve loading times.",
            effort: "Low",
        },
        {
            id: "rec-002",
            priority: "medium",
            category: "Security",
            title: "Implement Rate Limiting",
            description: "Add rate limiting to API routes to prevent abuse and protect against DoS attacks.",
            effort: "Medium",
        },
        {
            id: "rec-003",
            priority: "medium",
            category: "Analytics",
            title: "Add Error Tracking",
            description: "Integrate Sentry or similar for real-time error monitoring and reporting.",
            effort: "Low",
        },
        {
            id: "rec-004",
            priority: "low",
            category: "SEO",
            title: "Add Structured Data",
            description: "Implement JSON-LD structured data for better search engine visibility.",
            effort: "Medium",
        },
        {
            id: "rec-005",
            priority: "medium",
            category: "UX",
            title: "Add Loading States",
            description: "Implement skeleton loaders for better perceived performance during data fetching.",
            effort: "Medium",
        },
        {
            id: "rec-006",
            priority: "low",
            category: "Content",
            title: "Add Blog RSS Feed",
            description: "Generate RSS feed for blog posts to allow syndication and subscriptions.",
            effort: "Low",
        },
    ];
}

export default async function DiagnosticsPage() {
    const supabase = await createClient();

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/auth/login");
    }

    // Verify owner access
    const OWNER_EMAIL = "hrideymarwah2907@gmail.com";
    if (user.email !== OWNER_EMAIL) {
        redirect("/dashboard");
    }

    const systemHealth = await checkSystemHealth();
    const securityIssues = getSecurityAudit();
    const recommendations = getRecommendations();

    // Get recent errors from console (simulated - in production, integrate with error tracking)
    const recentErrors: { timestamp: string; message: string; source: string }[] = [];

    return (
        <DiagnosticsClient
            systemHealth={systemHealth}
            securityIssues={securityIssues}
            recommendations={recommendations}
            recentErrors={recentErrors}
            lastAuditDate={new Date().toISOString()}
        />
    );
}
