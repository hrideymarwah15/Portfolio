"use client";

import { motion } from "framer-motion";
import BuildLogs from "@/components/BuildLogs";
import Link from "next/link";
import { ArrowLeft, RefreshCw, CheckCircle, AlertCircle } from "lucide-react";
import { useState } from "react";

export default function Dashboard() {
  const [syncing, setSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<"idle" | "success" | "error">("idle");

  const triggerSync = async () => {
    setSyncing(true);
    setSyncStatus("idle");
    try {
        const res = await fetch("/api/cron/sync-projects");
        if (!res.ok) throw new Error("Sync failed");
        setSyncStatus("success");
    } catch (error) {
        console.error(error);
        setSyncStatus("error");
    } finally {
        setSyncing(false);
        // Reset status after 3s
        setTimeout(() => setSyncStatus("idle"), 3000);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] py-20 px-6">
       {/* Grid Background */}
       <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="mb-12">
            <Link 
                href="/" 
                className="inline-flex items-center gap-2 font-mono text-xs text-[var(--muted)] hover:text-[var(--foreground)] mb-6 transition-colors"
            >
                <ArrowLeft size={14} />
                Back to Portfolio
            </Link>
            
            <h1 className="font-mono font-black text-4xl md:text-5xl mb-4">
                ENGINEERING <span className="marker-yellow">DASHBOARD</span>.
            </h1>
            <p className="font-mono text-[var(--muted)]">
                Internal metrics, shipping logs, and automation status.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Build Logs */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <BuildLogs />
            </motion.div>

            {/* Right Column: Future Analytics */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-8"
            >
                <div className="p-6 border-2 border-[var(--border)] bg-[var(--card-bg)] shadow-hard">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-mono font-bold text-lg">Automation Status</h3>
                    </div>
                    
                    <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-dashed border-[var(--border)]">
                            <span className="font-mono text-sm">Project Sync</span>
                            <div className="flex items-center gap-2">
                                {syncStatus === "success" && <CheckCircle size={14} className="text-green-600" />}
                                {syncStatus === "error" && <AlertCircle size={14} className="text-red-600" />}
                                <button 
                                    onClick={triggerSync}
                                    disabled={syncing}
                                    className="flex items-center gap-1.5 px-2 py-1 bg-[var(--foreground)] text-[var(--background)] text-xs font-mono font-bold rounded hover:opacity-80 disabled:opacity-50 transition-all"
                                >
                                    <RefreshCw size={10} className={syncing ? "animate-spin" : ""} />
                                    {syncing ? "SYNCING..." : "SYNC NOW"}
                                </button>
                            </div>
                        </div>

                        <StatusItem label="Blog Auto-Publish" status="Pending" />
                        <StatusItem label="SEO Health" status="98/100" type="success" />
                    </div>
                </div>

                <div className="p-6 border-2 border-[var(--border)] bg-[var(--accent)] shadow-hard items-center justify-center flex flex-col text-center">
                    <p className="font-mono text-xs text-[var(--muted)] mb-2">Total Contributions (YTD)</p>
                    <div className="text-4xl font-black">482</div>
                </div>
            </motion.div>
        </div>
      </div>
    </main>
  );
}

function StatusItem({ label, status, type = "neutral" }: { label: string, status: string, type?: "neutral" | "success" | "error" }) {
    const colors = {
        neutral: "bg-gray-200 text-gray-700",
        success: "bg-green-100 text-green-700 border-green-200",
        error: "bg-red-100 text-red-700 border-red-200"
    };

    return (
        <div className="flex justify-between items-center py-2 border-b border-dashed border-[var(--border)] last:border-0">
            <span className="font-mono text-sm">{label}</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded border ${colors[type]}`}>
                {status}
            </span>
        </div>
    )
}
