
const GITHUB_GRAPHQL_URL = "https://api.github.com/graphql";

// Types for GitHub API response
interface GitHubStatsResponse {
  totalContributions: number;
  totalPullRequests: number;
  totalRepositories: number;
  contributionCalendar: any;
}

export class GitHubService {
  private token: string;

  constructor() {
    this.token = process.env.GITHUB_TOKEN || "";
  }

  async getStats(username: string): Promise<GitHubStatsResponse | null> {
    if (!this.token) return null;

    const query = `
      query($username: String!) {
        user(login: $username) {
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  contributionCount
                  date
                  color
                }
              }
            }
          }
          pullRequests(first: 1) {
            totalCount
          }
          repositories(first: 1, ownerAffiliations: OWNER) {
            totalCount
          }
        }
      }
    `;

    try {
      const response = await fetch(GITHUB_GRAPHQL_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          variables: { username },
        }),
        next: { revalidate: 3600 }, // Cache for 1 hour
      });

      const result = await response.json();
      if (result.errors) throw new Error(result.errors[0].message);

      const user = result.data.user;
      return {
        totalContributions: user.contributionsCollection.contributionCalendar.totalContributions,
        totalPullRequests: user.pullRequests.totalCount,
        totalRepositories: user.repositories.totalCount,
        contributionCalendar: user.contributionsCollection.contributionCalendar,
      };
    } catch (error) {
      console.error("GitHub Service Error:", error);
      return null;
    }
  }

  async getRecentActivity(username: string) {
    // Implementation for public logs/activity
    // This would typically fetch events from the REST API
    return [];
  }
}

export const githubService = new GitHubService();
