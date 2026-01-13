"use client";

import { useState, useEffect, useCallback } from "react";
import {
    MessageSquare,
    Mail,
    Clock,
    Check,
    Trash2,
    RefreshCw,
    Inbox,
    Eye,
    EyeOff,
} from "lucide-react";

interface Message {
    id: string;
    name: string;
    email: string | null;
    message: string;
    read: boolean;
    created_at: string;
}

export default function MessagesClient() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

    const fetchMessages = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/messages");
            if (!response.ok) throw new Error("Failed to fetch messages");
            const data = await response.json();
            setMessages(data.messages || []);
            setError(null);
        } catch (err) {
            setError("Failed to load messages");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMessages();
    }, [fetchMessages]);

    const handleMarkRead = async (id: string, read: boolean) => {
        try {
            const response = await fetch("/api/messages", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, read }),
            });
            if (response.ok) {
                setMessages((prev) =>
                    prev.map((m) => (m.id === id ? { ...m, read } : m))
                );
            }
        } catch (err) {
            console.error("Failed to update message:", err);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this message?")) return;
        try {
            const response = await fetch(`/api/messages?id=${id}`, {
                method: "DELETE",
            });
            if (response.ok) {
                setMessages((prev) => prev.filter((m) => m.id !== id));
            }
        } catch (err) {
            console.error("Failed to delete message:", err);
        }
    };

    const filteredMessages = messages.filter((m) => {
        if (filter === "unread") return !m.read;
        if (filter === "read") return m.read;
        return true;
    });

    const unreadCount = messages.filter((m) => !m.read).length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-mono font-bold flex items-center gap-3">
                        <MessageSquare size={28} />
                        MESSAGES
                        {unreadCount > 0 && (
                            <span className="px-2 py-1 text-sm bg-red-500 text-white rounded-full">
                                {unreadCount}
                            </span>
                        )}
                    </h1>
                    <p className="text-gray-500 font-mono text-sm mt-1">
                        Visitor messages from your portfolio
                    </p>
                </div>
                <button
                    onClick={fetchMessages}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 border-2 border-black font-mono text-sm font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-black hover:text-white hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50"
                >
                    <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                    REFRESH
                </button>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
                {(["all", "unread", "read"] as const).map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 font-mono text-sm font-bold border-2 border-black transition-all ${filter === f
                                ? "bg-black text-white"
                                : "bg-white hover:bg-gray-100"
                            }`}
                    >
                        {f.toUpperCase()}
                        {f === "unread" && unreadCount > 0 && (
                            <span className="ml-2 text-xs">({unreadCount})</span>
                        )}
                    </button>
                ))}
            </div>

            {/* Messages List */}
            {error && (
                <div className="p-4 bg-red-50 border-2 border-red-500 font-mono text-sm text-red-700">
                    {error}
                </div>
            )}

            {!loading && filteredMessages.length === 0 && (
                <div className="text-center py-16 border-2 border-dashed border-gray-300">
                    <Inbox size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="font-mono text-gray-400">No messages yet</p>
                </div>
            )}

            <div className="space-y-4">
                {filteredMessages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`border-2 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${!msg.read ? "border-l-4 border-l-blue-500" : ""
                            }`}
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                                {/* Header */}
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="font-mono font-bold text-lg">{msg.name}</span>
                                    {!msg.read && (
                                        <span className="px-2 py-0.5 text-xs font-mono bg-blue-100 text-blue-700 border border-blue-300">
                                            NEW
                                        </span>
                                    )}
                                </div>

                                {/* Email */}
                                {msg.email && (
                                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                                        <Mail size={14} />
                                        <a
                                            href={`mailto:${msg.email}`}
                                            className="hover:text-black hover:underline"
                                        >
                                            {msg.email}
                                        </a>
                                    </div>
                                )}

                                {/* Message */}
                                <p className="text-gray-700 whitespace-pre-wrap">{msg.message}</p>

                                {/* Timestamp */}
                                <div className="flex items-center gap-2 mt-4 text-xs text-gray-400 font-mono">
                                    <Clock size={12} />
                                    {new Date(msg.created_at).toLocaleString()}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={() => handleMarkRead(msg.id, !msg.read)}
                                    className="p-2 border-2 border-black bg-white hover:bg-gray-100 transition-colors"
                                    title={msg.read ? "Mark as unread" : "Mark as read"}
                                >
                                    {msg.read ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                                <button
                                    onClick={() => handleDelete(msg.id)}
                                    className="p-2 border-2 border-red-500 text-red-500 bg-white hover:bg-red-50 transition-colors"
                                    title="Delete message"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Stats */}
            {messages.length > 0 && (
                <div className="flex gap-4 text-xs font-mono text-gray-400 pt-4 border-t border-dashed border-gray-300">
                    <span>Total: {messages.length}</span>
                    <span>Unread: {unreadCount}</span>
                    <span>Read: {messages.length - unreadCount}</span>
                </div>
            )}
        </div>
    );
}
