"use client";

import { Eye, Users, TrendingUp, Clock, Activity } from "lucide-react";
import type { AnalyticsEvent } from "@/lib/analytics";

interface AnalyticsSummary {
  totalPageViews: number;
  uniqueVisitors: number;
  last7DaysViews: number;
  last30DaysViews: number;
  topPages: { path: string; count: number }[];
  eventsByType: { type: string; count: number }[];
  pageViewsOverTime: { date: string; count: number }[];
}

interface AnalyticsDashboardProps {
  summary: AnalyticsSummary;
  recentEvents: AnalyticsEvent[];
}

export default function AnalyticsDashboard({
  summary,
  recentEvents,
}: AnalyticsDashboardProps) {
  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Page Views"
          value={summary.totalPageViews}
          icon={<Eye size={24} />}
          color="bg-blue-100 text-blue-600"
        />
        <StatCard
          title="Unique Visitors"
          value={summary.uniqueVisitors}
          icon={<Users size={24} />}
          color="bg-green-100 text-green-600"
        />
        <StatCard
          title="Last 7 Days"
          value={summary.last7DaysViews}
          icon={<TrendingUp size={24} />}
          color="bg-purple-100 text-purple-600"
        />
        <StatCard
          title="Last 30 Days"
          value={summary.last30DaysViews}
          icon={<Activity size={24} />}
          color="bg-orange-100 text-orange-600"
        />
      </div>

      {/* Page Views Chart */}
      {summary.pageViewsOverTime.length > 0 && (
        <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6">
          <h3 className="font-mono font-bold text-lg mb-4">PAGE VIEWS OVER TIME</h3>
          <div className="h-40 flex items-end gap-1">
            {summary.pageViewsOverTime.slice(-14).map((day, i) => {
              const maxCount = Math.max(...summary.pageViewsOverTime.map(d => d.count), 1);
              const height = (day.count / maxCount) * 100;
              return (
                <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-black transition-all hover:bg-gray-700"
                    style={{ height: `${Math.max(height, 2)}%` }}
                    title={`${day.date}: ${day.count} views`}
                  />
                  {i % 2 === 0 && (
                    <span className="text-[10px] font-mono text-gray-400 rotate-45 origin-left">
                      {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Top Pages & Events by Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6">
          <h3 className="font-mono font-bold text-lg mb-4">TOP PAGES</h3>
          <div className="space-y-3">
            {summary.topPages.length > 0 ? (
              summary.topPages.map((page, i) => (
                <div
                  key={page.path}
                  className="flex items-center justify-between py-2 border-b border-dashed border-gray-200 last:border-0"
                >
                  <span className="font-mono text-sm">
                    <span className="text-gray-400 mr-2">#{i + 1}</span>
                    {page.path}
                  </span>
                  <span className="font-mono font-bold">{page.count}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 font-mono text-sm">No data yet</p>
            )}
          </div>
        </div>

        <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6">
          <h3 className="font-mono font-bold text-lg mb-4">EVENTS BY TYPE</h3>
          <div className="space-y-3">
            {summary.eventsByType.length > 0 ? (
              summary.eventsByType.map((event, i) => (
                <div
                  key={event.type}
                  className="flex items-center justify-between py-2 border-b border-dashed border-gray-200 last:border-0"
                >
                  <span className="font-mono text-sm">
                    <span className="text-gray-400 mr-2">#{i + 1}</span>
                    {event.type}
                  </span>
                  <span className="font-mono font-bold">{event.count}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 font-mono text-sm">No data yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Events */}
      <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6">
        <h3 className="font-mono font-bold text-lg mb-4">RECENT ACTIVITY</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-black">
                <th className="text-left py-2 font-mono text-xs text-gray-500 uppercase">
                  Event
                </th>
                <th className="text-left py-2 font-mono text-xs text-gray-500 uppercase">
                  Page
                </th>
                <th className="text-left py-2 font-mono text-xs text-gray-500 uppercase">
                  Referrer
                </th>
                <th className="text-left py-2 font-mono text-xs text-gray-500 uppercase">
                  Time
                </th>
              </tr>
            </thead>
            <tbody>
              {recentEvents.length > 0 ? (
                recentEvents.map((event) => (
                  <tr
                    key={event.id}
                    className="border-b border-dashed border-gray-200 hover:bg-gray-50"
                  >
                    <td className="py-2 font-mono text-sm">
                      <EventBadge type={event.event_type} />
                    </td>
                    <td className="py-2 font-mono text-sm">{event.page || "-"}</td>
                    <td className="py-2 font-mono text-sm text-gray-500 truncate max-w-[200px]">
                      {event.referrer || "-"}
                    </td>
                    <td className="py-2 font-mono text-sm text-gray-500">
                      <TimeAgo date={event.created_at} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-500 font-mono">
                    No events recorded yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6">
      <div className="flex items-center gap-4">
        <div className={`p-3 ${color}`}>{icon}</div>
        <div>
          <p className="text-xs font-mono text-gray-500 uppercase">{title}</p>
          <p className="text-3xl font-mono font-bold">{value.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}

function EventBadge({ type }: { type: string }) {
  const colorMap: Record<string, string> = {
    page_view: "bg-blue-100 text-blue-700",
    project_click: "bg-green-100 text-green-700",
    blog_view: "bg-purple-100 text-purple-700",
    contact_click: "bg-orange-100 text-orange-700",
  };

  const color = colorMap[type] || "bg-gray-100 text-gray-700";
  const label = type.replace(/_/g, " ").toUpperCase();

  return (
    <span className={`px-2 py-0.5 text-xs font-mono ${color}`}>
      {label}
    </span>
  );
}

function TimeAgo({ date }: { date: string }) {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return <span>Just now</span>;
  if (minutes < 60) return <span>{minutes}m ago</span>;
  if (hours < 24) return <span>{hours}h ago</span>;
  return <span>{days}d ago</span>;
}
