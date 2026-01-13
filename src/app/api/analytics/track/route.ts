import { NextResponse } from "next/server";
import { trackEvent, trackPageView } from "@/lib/analytics";
import { headers } from "next/headers";
import { createHash } from "crypto";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { type, page, ...metadata } = data;
    
    // Input validation
    if (!type || typeof type !== "string") {
      return NextResponse.json(
        { error: "Invalid event type" },
        { status: 400 }
      );
    }
    
    // Sanitize type to prevent injection
    const allowedTypes = ["page_view", "click", "form_submit", "download", "search"];
    if (!allowedTypes.includes(type)) {
      return NextResponse.json(
        { error: "Invalid event type" },
        { status: 400 }
      );
    }
    
    if (page && typeof page !== "string") {
      return NextResponse.json(
        { error: "Invalid page value" },
        { status: 400 }
      );
    }
    
    // Get request headers for tracking
    const headersList = await headers();
    const userAgent = headersList.get("user-agent") || undefined;
    const referrer = headersList.get("referer") || undefined;
    const forwardedFor = headersList.get("x-forwarded-for");
    const ip = forwardedFor?.split(",")[0] || "unknown";
    const ipHash = createHash("sha256").update(ip).digest("hex").slice(0, 16);
    
    // Generate session ID from IP + User Agent
    const sessionId = createHash("sha256")
      .update(`${ip}-${userAgent}`)
      .digest("hex")
      .slice(0, 16);
    
    if (type === "page_view") {
      await trackPageView(page, {
        referrer,
        userAgent,
        ipHash,
        sessionId,
      });
    } else {
      await trackEvent(type, {
        page,
        referrer,
        userAgent,
        ipHash,
        sessionId,
        metadata,
      });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
