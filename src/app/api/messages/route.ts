import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import { createHash } from "crypto";

// Rate limiting map (in production, use Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT = 5; // max messages per hour
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in ms

function checkRateLimit(ipHash: string): boolean {
    const now = Date.now();
    const record = rateLimitMap.get(ipHash);

    if (!record || now > record.resetTime) {
        rateLimitMap.set(ipHash, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
        return true;
    }

    if (record.count >= RATE_LIMIT) {
        return false;
    }

    record.count++;
    return true;
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const { name, email, message } = data;

        // Validation
        if (!name || typeof name !== "string" || name.trim().length < 2) {
            return NextResponse.json(
                { error: "Name is required (min 2 characters)" },
                { status: 400 }
            );
        }

        if (!message || typeof message !== "string" || message.trim().length < 10) {
            return NextResponse.json(
                { error: "Message is required (min 10 characters)" },
                { status: 400 }
            );
        }

        if (message.length > 2000) {
            return NextResponse.json(
                { error: "Message too long (max 2000 characters)" },
                { status: 400 }
            );
        }

        // Email validation (optional field)
        if (email && typeof email === "string" && email.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email.trim())) {
                return NextResponse.json(
                    { error: "Invalid email format" },
                    { status: 400 }
                );
            }
        }

        // Rate limiting
        const headersList = await headers();
        const forwardedFor = headersList.get("x-forwarded-for");
        const ip = forwardedFor?.split(",")[0] || "unknown";
        const ipHash = createHash("sha256").update(ip).digest("hex").slice(0, 16);

        if (!checkRateLimit(ipHash)) {
            return NextResponse.json(
                { error: "Too many messages. Please try again later." },
                { status: 429 }
            );
        }

        // Save to Supabase
        const supabase = await createClient();

        const { error } = await supabase.from("messages").insert({
            name: name.trim(),
            email: email?.trim() || null,
            message: message.trim(),
            read: false,
        });

        if (error) {
            console.error("Error saving message:", error);
            return NextResponse.json(
                { error: "Failed to send message" },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Message API error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// GET - Retrieve messages (authenticated only)
export async function GET() {
    try {
        const supabase = await createClient();

        // Verify authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Verify owner
        const OWNER_EMAIL = "hrideymarwah2907@gmail.com";
        if (user.email !== OWNER_EMAIL) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const { data: messages, error } = await supabase
            .from("messages")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching messages:", error);
            return NextResponse.json(
                { error: "Failed to fetch messages" },
                { status: 500 }
            );
        }

        return NextResponse.json({ messages });
    } catch (error) {
        console.error("Messages GET error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// PATCH - Mark message as read
export async function PATCH(request: Request) {
    try {
        const supabase = await createClient();

        // Verify authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const OWNER_EMAIL = "hrideymarwah2907@gmail.com";
        if (user.email !== OWNER_EMAIL) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const { id, read } = await request.json();

        if (!id) {
            return NextResponse.json({ error: "Message ID required" }, { status: 400 });
        }

        const { error } = await supabase
            .from("messages")
            .update({ read: read ?? true })
            .eq("id", id);

        if (error) {
            return NextResponse.json(
                { error: "Failed to update message" },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Message PATCH error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// DELETE - Delete a message
export async function DELETE(request: Request) {
    try {
        const supabase = await createClient();

        // Verify authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const OWNER_EMAIL = "hrideymarwah2907@gmail.com";
        if (user.email !== OWNER_EMAIL) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Message ID required" }, { status: 400 });
        }

        const { error } = await supabase
            .from("messages")
            .delete()
            .eq("id", id);

        if (error) {
            return NextResponse.json(
                { error: "Failed to delete message" },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Message DELETE error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
