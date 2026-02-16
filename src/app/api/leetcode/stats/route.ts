import { NextResponse } from "next/server";

interface LeetCodeStats {
    username: string;
    totalSolved: number;
    easySolved: number;
    mediumSolved: number;
    hardSolved: number;
    streak: number;
    totalActiveDays: number;
    submissionCalendar: { [timestamp: string]: number };
}

interface LeetCodeResponse {
    data: {
        matchedUser: {
            username: string;
            submitStatsGlobal: {
                acSubmissionNum: { difficulty: string; count: number }[];
            };
            userCalendar: {
                streak: number;
                totalActiveDays: number;
                submissionCalendar: string;
            };
        } | null;
    };
    errors?: { message: string }[];
}

const LEETCODE_GRAPHQL_URL = "https://leetcode.com/graphql";

const STATS_QUERY = `
  query userProfile($username: String!) {
    matchedUser(username: $username) {
      username
      submitStatsGlobal {
        acSubmissionNum {
          difficulty
          count
        }
      }
      userCalendar {
        streak
        totalActiveDays
        submissionCalendar
      }
    }
  }
`;

// Cache for 24 hours per plan specification
let cachedData: { data: LeetCodeStats; timestamp: number; username: string } | null = null;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in ms

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    if (!username) {
        return NextResponse.json(
            { error: "Username is required" },
            { status: 400 }
        );
    }

    // Check cache (username-specific)
    if (
        cachedData &&
        cachedData.username === username &&
        Date.now() - cachedData.timestamp < CACHE_DURATION
    ) {
        return NextResponse.json(cachedData.data);
    }

    try {
        const response = await fetch(LEETCODE_GRAPHQL_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Referer": "https://leetcode.com",
                "Origin": "https://leetcode.com",
            },
            body: JSON.stringify({
                query: STATS_QUERY,
                variables: { username },
            }),
        });

        if (!response.ok) {
            throw new Error(`LeetCode API error: ${response.status}`);
        }

        const result: LeetCodeResponse = await response.json();

        if (result.errors) {
            console.error("LeetCode GraphQL errors:", result.errors);
            throw new Error(result.errors[0]?.message || "GraphQL query failed");
        }

        const user = result.data?.matchedUser;
        if (!user) {
            // Graceful empty state per plan
            return NextResponse.json({
                username,
                totalSolved: 0,
                easySolved: 0,
                mediumSolved: 0,
                hardSolved: 0,
                streak: 0,
                totalActiveDays: 0,
                submissionCalendar: {},
                isEmpty: true,
            });
        }

        // Parse submission stats by difficulty
        const acStats = user.submitStatsGlobal.acSubmissionNum;
        const easySolved = acStats.find(s => s.difficulty === "Easy")?.count || 0;
        const mediumSolved = acStats.find(s => s.difficulty === "Medium")?.count || 0;
        const hardSolved = acStats.find(s => s.difficulty === "Hard")?.count || 0;
        const totalSolved = acStats.find(s => s.difficulty === "All")?.count || (easySolved + mediumSolved + hardSolved);

        // Parse submission calendar (JSON string to object)
        let submissionCalendar: { [timestamp: string]: number } = {};
        try {
            submissionCalendar = JSON.parse(user.userCalendar.submissionCalendar || "{}");
        } catch {
            console.error("Failed to parse submission calendar");
        }

        const statsData: LeetCodeStats = {
            username: user.username,
            totalSolved,
            easySolved,
            mediumSolved,
            hardSolved,
            streak: user.userCalendar.streak,
            totalActiveDays: user.userCalendar.totalActiveDays,
            submissionCalendar,
        };

        // Update cache
        cachedData = { data: statsData, timestamp: Date.now(), username };

        return NextResponse.json(statsData);
    } catch (error) {
        console.error("Failed to fetch LeetCode stats:", error);

        // Return graceful empty state on error
        return NextResponse.json({
            username,
            totalSolved: 0,
            easySolved: 0,
            mediumSolved: 0,
            hardSolved: 0,
            streak: 0,
            totalActiveDays: 0,
            submissionCalendar: {},
            isEmpty: true,
            error: error instanceof Error ? error.message : "Failed to fetch stats",
        });
    }
}
