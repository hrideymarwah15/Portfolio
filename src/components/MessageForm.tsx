"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export default function MessageForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");
    const [isPending, startTransition] = useTransition();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("idle");
        setErrorMessage("");

        startTransition(async () => {
            try {
                const response = await fetch("/api/messages", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, email, message }),
                });

                const data = await response.json();

                if (!response.ok) {
                    setStatus("error");
                    setErrorMessage(data.error || "Failed to send message");
                    return;
                }

                setStatus("success");
                setName("");
                setEmail("");
                setMessage("");

                // Reset status after 5 seconds
                setTimeout(() => setStatus("idle"), 5000);
            } catch {
                setStatus("error");
                setErrorMessage("Network error. Please try again.");
            }
        });
    };

    return (
        <div
            className="relative bg-[var(--card-bg)] border-2 border-[var(--border)] p-6 shadow-hard"
            style={{
                borderRadius: "15px 255px 15px 225px / 225px 15px 255px 15px",
            }}
        >
            {/* Tape decoration */}
            <div className="absolute -top-3 right-8 w-20 h-6 bg-gray-200/80 rotate-[3deg] border border-gray-300 z-10" />

            <h3 className="font-mono font-bold text-lg mb-4 text-[var(--foreground)]">DROP A MESSAGE</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name Input */}
                <div>
                    <label className="block font-mono text-xs text-[var(--muted)] uppercase tracking-wider mb-1">
                        Name *
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        minLength={2}
                        maxLength={100}
                        disabled={isPending}
                        className="w-full px-4 py-2 border-2 border-[var(--border)] bg-[var(--input-bg)] text-[var(--foreground)] font-mono text-sm shadow-hard-sm focus:shadow-hard focus:outline-none transition-shadow disabled:opacity-50 placeholder:text-[var(--muted)]"
                        placeholder="Your name"
                    />
                </div>

                {/* Email Input (Optional) */}
                <div>
                    <label className="block font-mono text-xs text-[var(--muted)] uppercase tracking-wider mb-1">
                        Email <span className="text-[var(--muted-foreground)]">(optional)</span>
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isPending}
                        className="w-full px-4 py-2 border-2 border-dashed border-[var(--muted)] bg-[var(--input-bg)] text-[var(--foreground)] font-mono text-sm focus:border-[var(--border)] focus:border-solid focus:outline-none transition-all disabled:opacity-50 placeholder:text-[var(--muted)]"
                        placeholder="your@email.com"
                    />
                </div>

                {/* Message Textarea */}
                <div>
                    <label className="block font-mono text-xs text-[var(--muted)] uppercase tracking-wider mb-1">
                        Message *
                    </label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        minLength={10}
                        maxLength={2000}
                        rows={4}
                        disabled={isPending}
                        className="w-full px-4 py-3 border-2 border-[var(--border)] bg-[var(--input-bg)] text-[var(--foreground)] font-mono text-sm shadow-hard-sm focus:shadow-hard focus:outline-none resize-none transition-shadow disabled:opacity-50 placeholder:text-[var(--muted)]"
                        placeholder="Write your message here..."
                    />
                    <p className="text-xs font-mono text-[var(--muted)] mt-1 text-right">
                        {message.length}/2000
                    </p>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isPending || status === "success"}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[var(--foreground)] text-[var(--background)] font-mono font-bold text-sm border-2 border-[var(--border)] shadow-hard-sm hover:bg-[var(--background)] hover:text-[var(--foreground)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[var(--foreground)] disabled:hover:text-[var(--background)] disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-hard-sm"
                >
                    {isPending ? (
                        <>
                            <Loader2 size={16} className="animate-spin" />
                            SENDING...
                        </>
                    ) : (
                        <>
                            <Send size={16} />
                            SEND MESSAGE
                        </>
                    )}
                </button>
            </form>

            {/* Status Messages */}
            <AnimatePresence>
                {status === "success" && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-4 p-3 bg-green-50 border-2 border-green-500 flex items-center gap-2"
                    >
                        <CheckCircle size={18} className="text-green-600" />
                        <span className="font-mono text-sm text-green-700">
                            Message sent successfully!
                        </span>
                    </motion.div>
                )}

                {status === "error" && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-4 p-3 bg-red-50 border-2 border-red-500 flex items-center gap-2"
                    >
                        <AlertCircle size={18} className="text-red-600" />
                        <span className="font-mono text-sm text-red-700">{errorMessage}</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
