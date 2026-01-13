"use client";

import { useState } from "react";
import {
    Shield,
    AlertTriangle,
    CheckCircle,
    Info,
    AlertCircle,
    Activity,
    Database,
    Server,
    Lock,
    BarChart3,
    Lightbulb,
    ChevronDown,
    ChevronUp,
    Clock,
    Zap,
    RefreshCw,
} from "lucide-react";

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

interface Recommendation {
    id: string;
    priority: "high" | "medium" | "low";
    category: string;
    title: string;
    description: string;
    effort: "Low" | "Medium" | "High";
}

interface DiagnosticsClientProps {
    systemHealth: SystemHealth;
    securityIssues: SecurityIssue[];
    recommendations: Recommendation[];
    recentErrors: { timestamp: string; message: string; source: string }[];
    lastAuditDate: string;
}

const severityColors = {
    critical: "bg-red-100 text-red-800 border-red-300",
    high: "bg-orange-100 text-orange-800 border-orange-300",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-300",
    low: "bg-blue-100 text-blue-800 border-blue-300",
    info: "bg-gray-100 text-gray-800 border-gray-300",
};

const statusColors = {
    open: "bg-red-500",
    resolved: "bg-green-500",
    acknowledged: "bg-yellow-500",
};

const priorityColors = {
    high: "bg-red-100 text-red-800",
    medium: "bg-yellow-100 text-yellow-800",
    low: "bg-blue-100 text-blue-800",
};

const healthIcon = {
    healthy: <CheckCircle className="text-green-500" size={20} />,
    degraded: <AlertTriangle className="text-yellow-500" size={20} />,
    down: <AlertCircle className="text-red-500" size={20} />,
};

export default function DiagnosticsClient({
    systemHealth,
    securityIssues,
    recommendations,
    recentErrors,
    lastAuditDate,
}: DiagnosticsClientProps) {
    const [expandedIssue, setExpandedIssue] = useState<string | null>(null);
    const [filterSeverity, setFilterSeverity] = useState<string>("all");

    const filteredIssues =
        filterSeverity === "all"
            ? securityIssues
            : securityIssues.filter((issue) => issue.severity === filterSeverity);

    const openIssues = securityIssues.filter((i) => i.status === "open").length;
    const resolvedIssues = securityIssues.filter((i) => i.status === "resolved").length;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-mono font-bold">DIAGNOSTICS</h1>
                    <p className="text-gray-500 font-mono text-sm mt-1">
                        System health, security audit, and recommendations
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-xs font-mono text-gray-400">Last audit</p>
                    <p className="font-mono text-sm">
                        {new Date(lastAuditDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                        })}
                    </p>
                </div>
            </div>

            {/* System Health Grid */}
            <section
                className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                style={{ borderRadius: "8px 20px 8px 20px" }}
            >
                <h2 className="font-mono font-bold text-lg mb-4 flex items-center gap-2">
                    <Activity size={20} />
                    SYSTEM HEALTH
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <HealthCard
                        icon={<Database size={24} />}
                        label="Database"
                        status={systemHealth.database}
                    />
                    <HealthCard
                        icon={<Server size={24} />}
                        label="API"
                        status={systemHealth.api}
                    />
                    <HealthCard
                        icon={<Lock size={24} />}
                        label="Authentication"
                        status={systemHealth.auth}
                    />
                    <HealthCard
                        icon={<BarChart3 size={24} />}
                        label="Analytics"
                        status={systemHealth.analytics}
                    />
                </div>
            </section>

            {/* Security Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-red-100 border-2 border-black">
                            <AlertCircle size={20} className="text-red-600" />
                        </div>
                        <span className="text-3xl font-mono font-black">{openIssues}</span>
                    </div>
                    <p className="font-mono text-sm text-gray-600">Open Issues</p>
                </div>

                <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-green-100 border-2 border-black">
                            <CheckCircle size={20} className="text-green-600" />
                        </div>
                        <span className="text-3xl font-mono font-black">{resolvedIssues}</span>
                    </div>
                    <p className="font-mono text-sm text-gray-600">Resolved</p>
                </div>

                <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-100 border-2 border-black">
                            <Lightbulb size={20} className="text-blue-600" />
                        </div>
                        <span className="text-3xl font-mono font-black">{recommendations.length}</span>
                    </div>
                    <p className="font-mono text-sm text-gray-600">Recommendations</p>
                </div>
            </div>

            {/* Security Issues */}
            <section
                className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                style={{ borderRadius: "8px 20px 8px 20px" }}
            >
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-mono font-bold text-lg flex items-center gap-2">
                        <Shield size={20} />
                        SECURITY AUDIT
                    </h2>
                    <select
                        value={filterSeverity}
                        onChange={(e) => setFilterSeverity(e.target.value)}
                        className="px-3 py-1 border-2 border-black font-mono text-sm bg-white"
                    >
                        <option value="all">All Severities</option>
                        <option value="critical">Critical</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                        <option value="info">Info</option>
                    </select>
                </div>

                <div className="space-y-3">
                    {filteredIssues.map((issue) => (
                        <div
                            key={issue.id}
                            className={`border-2 border-black ${expandedIssue === issue.id ? "bg-gray-50" : "bg-white"
                                }`}
                        >
                            <button
                                onClick={() =>
                                    setExpandedIssue(expandedIssue === issue.id ? null : issue.id)
                                }
                                className="w-full p-4 flex items-center justify-between text-left"
                            >
                                <div className="flex items-center gap-3">
                                    <span
                                        className={`w-3 h-3 rounded-full ${statusColors[issue.status]}`}
                                        title={issue.status}
                                    />
                                    <span
                                        className={`px-2 py-0.5 text-xs font-mono font-bold border ${severityColors[issue.severity]
                                            }`}
                                    >
                                        {issue.severity.toUpperCase()}
                                    </span>
                                    <span className="font-mono font-bold">{issue.title}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-mono text-gray-500">
                                        {issue.category}
                                    </span>
                                    {expandedIssue === issue.id ? (
                                        <ChevronUp size={16} />
                                    ) : (
                                        <ChevronDown size={16} />
                                    )}
                                </div>
                            </button>

                            {expandedIssue === issue.id && (
                                <div className="px-4 pb-4 border-t border-dashed border-gray-300">
                                    <div className="pt-4 space-y-3">
                                        <div>
                                            <p className="text-xs font-mono text-gray-500 uppercase mb-1">
                                                Description
                                            </p>
                                            <p className="text-sm">{issue.description}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-mono text-gray-500 uppercase mb-1">
                                                Recommendation
                                            </p>
                                            <p className="text-sm text-gray-700">{issue.recommendation}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-mono text-gray-500">Status:</span>
                                            <span
                                                className={`px-2 py-0.5 text-xs font-mono font-bold ${issue.status === "resolved"
                                                        ? "bg-green-100 text-green-800"
                                                        : issue.status === "acknowledged"
                                                            ? "bg-yellow-100 text-yellow-800"
                                                            : "bg-red-100 text-red-800"
                                                    }`}
                                            >
                                                {issue.status.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* Recommendations */}
            <section
                className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                style={{ borderRadius: "8px 20px 8px 20px" }}
            >
                <h2 className="font-mono font-bold text-lg mb-4 flex items-center gap-2">
                    <Lightbulb size={20} />
                    RECOMMENDATIONS
                </h2>

                <div className="space-y-3">
                    {recommendations.map((rec) => (
                        <div
                            key={rec.id}
                            className="p-4 border-2 border-black bg-white hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span
                                            className={`px-2 py-0.5 text-xs font-mono font-bold ${priorityColors[rec.priority]
                                                }`}
                                        >
                                            {rec.priority.toUpperCase()}
                                        </span>
                                        <span className="text-xs font-mono text-gray-500">
                                            {rec.category}
                                        </span>
                                    </div>
                                    <h3 className="font-mono font-bold mb-1">{rec.title}</h3>
                                    <p className="text-sm text-gray-600">{rec.description}</p>
                                </div>
                                <div className="ml-4 text-right">
                                    <p className="text-xs font-mono text-gray-400">Effort</p>
                                    <p className="font-mono text-sm font-bold">{rec.effort}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Recent Errors */}
            <section
                className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                style={{ borderRadius: "8px 20px 8px 20px" }}
            >
                <h2 className="font-mono font-bold text-lg mb-4 flex items-center gap-2">
                    <AlertTriangle size={20} />
                    RECENT ERRORS
                </h2>

                {recentErrors.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                        <CheckCircle size={48} className="mx-auto mb-4 text-green-400" />
                        <p className="font-mono text-sm">No recent errors detected</p>
                        <p className="font-mono text-xs mt-1">
                            Consider integrating Sentry for real-time error tracking
                        </p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {recentErrors.map((error, index) => (
                            <div key={index} className="p-3 bg-red-50 border-l-4 border-red-500">
                                <div className="flex items-center gap-2 mb-1">
                                    <Clock size={12} className="text-gray-400" />
                                    <span className="text-xs font-mono text-gray-500">
                                        {new Date(error.timestamp).toLocaleString()}
                                    </span>
                                    <span className="text-xs font-mono bg-gray-200 px-1">
                                        {error.source}
                                    </span>
                                </div>
                                <p className="text-sm font-mono text-red-800">{error.message}</p>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* AI Info */}
            <section
                className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                style={{ borderRadius: "8px 20px 8px 20px" }}
            >
                <h2 className="font-mono font-bold text-lg mb-4 flex items-center gap-2">
                    <Zap size={20} />
                    AI ANALYSIS ENGINE
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <p className="text-xs font-mono text-gray-500 uppercase mb-1">Type</p>
                        <p className="font-mono font-bold">Local Pattern Matching</p>
                        <p className="text-sm text-gray-600 mt-1">
                            Uses regex patterns and keyword extraction for project analysis
                        </p>
                    </div>
                    <div>
                        <p className="text-xs font-mono text-gray-500 uppercase mb-1">Privacy</p>
                        <p className="font-mono font-bold text-green-700">No External API Calls</p>
                        <p className="text-sm text-gray-600 mt-1">
                            All analysis happens locally - no data sent to third-party AI services
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}

// Health Card Component
function HealthCard({
    icon,
    label,
    status,
}: {
    icon: React.ReactNode;
    label: string;
    status: "healthy" | "degraded" | "down";
}) {
    const statusText = {
        healthy: "Operational",
        degraded: "Degraded",
        down: "Down",
    };

    const bgColor = {
        healthy: "bg-green-50",
        degraded: "bg-yellow-50",
        down: "bg-red-50",
    };

    return (
        <div
            className={`p-4 border-2 border-black ${bgColor[status]} flex flex-col items-center text-center`}
        >
            <div className="mb-2 text-gray-700">{icon}</div>
            <p className="font-mono font-bold text-sm mb-1">{label}</p>
            <div className="flex items-center gap-1">
                {healthIcon[status]}
                <span className="text-xs font-mono">{statusText[status]}</span>
            </div>
        </div>
    );
}
