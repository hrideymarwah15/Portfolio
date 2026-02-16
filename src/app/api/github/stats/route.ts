import { getFullGitHubStats } from "@/lib/github";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username") || "hrideymarwah15";

  const stats = await getFullGitHubStats(username);

  return NextResponse.json(stats);
}
