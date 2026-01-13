import { createClient } from "@/lib/supabase/server";

export interface AnalyticsEvent {
  id: string;
  event_type: string;
  page: string | null;
  referrer: string | null;
  user_agent: string | null;
  ip_hash: string | null;
  session_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface AnalyticsSummary {
  totalPageViews: number;
  uniqueVisitors: number;
  topPages: { page: string; count: number }[];
  eventsByType: { type: string; count: number }[];
  recentEvents: AnalyticsEvent[];
}

// Track an analytics event
export async function trackEvent(
  eventType: string,
  data: {
    page?: string;
    referrer?: string;
    userAgent?: string;
    ipHash?: string;
    sessionId?: string;
    metadata?: Record<string, unknown>;
  }
): Promise<void> {
  const supabase = await createClient();
  
  await supabase.from("analytics_events").insert({
    event_type: eventType,
    page: data.page || null,
    referrer: data.referrer || null,
    user_agent: data.userAgent || null,
    ip_hash: data.ipHash || null,
    session_id: data.sessionId || null,
    metadata: data.metadata || {},
  });
}

// Track a page view
export async function trackPageView(
  page: string,
  data?: {
    referrer?: string;
    userAgent?: string;
    ipHash?: string;
    sessionId?: string;
  }
): Promise<void> {
  await trackEvent("page_view", { page, ...data });
}

// Get analytics summary for dashboard
export async function getAnalyticsSummary(
  days: number = 30
): Promise<AnalyticsSummary> {
  const supabase = await createClient();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  // Get all events in date range
  const { data: events, error } = await supabase
    .from("analytics_events")
    .select("*")
    .gte("created_at", startDate.toISOString())
    .order("created_at", { ascending: false });

  if (error || !events) {
    return {
      totalPageViews: 0,
      uniqueVisitors: 0,
      topPages: [],
      eventsByType: [],
      recentEvents: [],
    };
  }

  // Calculate metrics
  const pageViews = events.filter((e) => e.event_type === "page_view");
  const uniqueSessionIds = new Set(events.map((e) => e.session_id).filter(Boolean));

  // Count pages
  const pageCounts: Record<string, number> = {};
  pageViews.forEach((e) => {
    if (e.page) {
      pageCounts[e.page] = (pageCounts[e.page] || 0) + 1;
    }
  });

  // Count event types
  const typeCounts: Record<string, number> = {};
  events.forEach((e) => {
    typeCounts[e.event_type] = (typeCounts[e.event_type] || 0) + 1;
  });

  return {
    totalPageViews: pageViews.length,
    uniqueVisitors: uniqueSessionIds.size,
    topPages: Object.entries(pageCounts)
      .map(([page, count]) => ({ page, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10),
    eventsByType: Object.entries(typeCounts)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count),
    recentEvents: events.slice(0, 50),
  };
}

// Get page views over time
export async function getPageViewsOverTime(
  days: number = 30
): Promise<{ date: string; count: number }[]> {
  const supabase = await createClient();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data: events, error } = await supabase
    .from("analytics_events")
    .select("created_at")
    .eq("event_type", "page_view")
    .gte("created_at", startDate.toISOString());

  if (error || !events) return [];

  // Group by date
  const dateCounts: Record<string, number> = {};
  events.forEach((e) => {
    const date = new Date(e.created_at).toISOString().split("T")[0];
    dateCounts[date] = (dateCounts[date] || 0) + 1;
  });

  // Fill in missing dates
  const result: { date: string; count: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    result.push({
      date: dateStr,
      count: dateCounts[dateStr] || 0,
    });
  }

  return result;
}
