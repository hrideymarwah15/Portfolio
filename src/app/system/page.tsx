
import { githubService } from "@/lib/server/services/github.service";
import SystemDashboardClient from "./SystemDashboardClient";

export const metadata = {
  title: "Engineering Dashboard | Hridey",
  description: "Live system metrics and engineering activity.",
};

export const revalidate = 3600; // Revalidate every hour

export default async function SystemPage() {
  const githubStats = await githubService.getStats("hrideymarwah15");

  return <SystemDashboardClient githubStats={githubStats} />;
}
