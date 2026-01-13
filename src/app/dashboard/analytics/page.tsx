import { getAnalyticsSummary, getPageViewsOverTime } from "@/lib/analytics";
import AnalyticsDashboard from "@/components/dashboard/AnalyticsDashboard";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const [summary, pageViewsOverTime] = await Promise.all([
    getAnalyticsSummary(30),
    getPageViewsOverTime(30),
  ]);

  // Calculate time-based metrics
  const now = new Date();
  const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const last7DaysViews = pageViewsOverTime
    .filter((d) => new Date(d.date) >= last7Days)
    .reduce((sum, d) => sum + d.count, 0);

  const dashboardSummary = {
    totalPageViews: summary.totalPageViews,
    uniqueVisitors: summary.uniqueVisitors,
    last7DaysViews,
    last30DaysViews: summary.totalPageViews,
    topPages: summary.topPages.map((p) => ({
      path: p.page,
      count: p.count,
    })),
    eventsByType: summary.eventsByType,
    pageViewsOverTime,
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-mono font-bold mb-2">ANALYTICS</h1>
        <p className="text-gray-600 font-mono">
          Track page views, visitor engagement, and site activity.
        </p>
      </div>

      <AnalyticsDashboard summary={dashboardSummary} recentEvents={summary.recentEvents} />
    </div>
  );
}
