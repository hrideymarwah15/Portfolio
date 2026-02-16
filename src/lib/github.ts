import { Octokit } from "octokit";

// Initialize Octokit with or without an auth token
// Without a token, rate limits are lower (60 requests/hour related to IP address)
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

export interface CommitData {
  sha: string;
  message: string;
  date: string;
  author: string;
  repo: string;
  url: string;
}

export async function getRecentCommits(username: string = "hrideymarwah15", limit: number = 10): Promise<CommitData[]> {
  try {
    // 1. Get user's public events
    const { data: events } = await octokit.request("GET /users/{username}/events/public", {
      username,
      per_page: 30, // Fetch more to filter down to PushEvents
    });

    const commits: CommitData[] = [];

    // 2. Filter for PushEvents and extract commit info
    for (const event of events) {
      const payload = event.payload as any;
      if (event.type === "PushEvent" && payload && payload.commits) {
        const repoName = event.repo.name.split("/")[1]; // extract repo name from "owner/repo"

        // Iterate through commits in this push (most recent first)
        // @ts-ignore - Octokit types for events payload can be complex
        for (const commit of event.payload.commits.reverse()) {
          if (commits.length >= limit) break;

          commits.push({
            sha: commit.sha,
            message: commit.message,
            date: event.created_at || new Date().toISOString(),
            author: event.actor.login,
            repo: repoName,
            url: `https://github.com/${event.repo.name}/commit/${commit.sha}`,
          });
        }
      }
      if (commits.length >= limit) break;
    }

    return commits;
  } catch (error) {
    console.error("Error fetching GitHub commits:", error);
    return [];
  }
}

export async function getUserStats(username: string = "hrideymarwah15") {
    try {
        const { data: user } = await octokit.request("GET /users/{username}", {
            username,
        });
        
        return {
            publicRepos: user.public_repos,
            followers: user.followers,
            following: user.following,
            url: user.html_url,
            avatar: user.avatar_url
        };
    } catch (error) {
        console.error("Error fetching GitHub user stats:", error);
        return null;
    }
}

export async function getTopRepos(username: string = "hrideymarwah15", limit: number = 6) {
    try {
        const { data: repos } = await octokit.request("GET /users/{username}/repos", {
            username,
            sort: "pushed",
            direction: "desc",
            per_page: 100,
        });

        // Filter out forks and sort by stars/pushed
        const topRepos = repos
            .filter(repo => !repo.fork && repo.description) // Only source repos with descriptions
            .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0)) // Sort by stars
            .slice(0, limit);

        return topRepos.map(repo => ({
            name: repo.name,
            description: repo.description,
            url: repo.html_url,
            stars: repo.stargazers_count,
            language: repo.language,
            topics: repo.topics,
            homepage: repo.homepage,
            updatedAt: repo.updated_at,
        }));
    } catch (error) {
        console.error("Error fetching top repos:", error);
        return [];
    }
}

export async function getFullGitHubStats(username: string = "hrideymarwah15") {
  try {
    const query = `
      query($username: String!) {
        user(login: $username) {
          contributionsCollection {
            totalCommitContributions
            totalPullRequestContributions
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
          repositories(first: 0) {
            totalCount
          }
          # Organizations user is a member of
          organizations(first: 6) {
            nodes {
              name
              avatarUrl
              url
            }
          }
           # Recent PRs to find organizations contributed to
          pullRequests(first: 100, orderBy: {field: CREATED_AT, direction: DESC}) {
            nodes {
              repository {
                owner {
                  ... on Organization {
                    name
                    avatarUrl
                    url
                  }
                }
              }
            }
          }
          followers {
            totalCount
          }
        }
      }
    `;

    // @ts-ignore - Octokit graphql types
    const response = await octokit.graphql(query, {
      username,
    });

    const user = (response as any).user;
    
    // Extract organizations from PRs
    const prOrgs = user.pullRequests.nodes
        .map((pr: any) => pr.repository.owner)
        .filter((owner: any) => owner && owner.url) // ensure it's an org (has url/avatar)
        .filter((org: any, index: number, self: any[]) => 
            index === self.findIndex((o) => o.name === org.name)
        );

    // Merge member orgs and PR orgs, removing duplicates
    const memberOrgs = user.organizations.nodes || [];
    const allOrgs = [...memberOrgs, ...prOrgs].filter((org, index, self) =>
        index === self.findIndex((o) => o.name === org.name)
    ).slice(0, 6); // Limit to 6

    return {
      totalContributions: user.contributionsCollection.contributionCalendar.totalContributions,
      totalPullRequests: user.contributionsCollection.totalPullRequestContributions,
      totalRepositories: user.repositories.totalCount,
      followers: user.followers.totalCount,
      organizations: allOrgs,
      contributionCalendar: user.contributionsCollection.contributionCalendar,
    };
  } catch (error) {
    console.error("Error fetching GitHub GraphQL stats:", error);
    
    // Fallback Mock Data if token is missing or error
    // This ensures the "previous data" look is preserved even without a valid token for now
    return {
        totalContributions: 482,
        totalPullRequests: 12,
        totalRepositories: 24,
        followers: 4,
        organizations: [],
        contributionCalendar: generateMockCalendar() 
    };
  }
}

function generateMockCalendar() {
    // Generate a similar pattern to real GitHub for visual consistency
    const weeks = [];
    const today = new Date();
    for (let i = 0; i < 52; i++) {
        const days = [];
        for (let j = 0; j < 7; j++) {
            days.push({
                contributionCount: Math.random() > 0.7 ? Math.floor(Math.random() * 5) : 0,
                date: new Date().toISOString(),
                color: "#ebedf0"
            });
        }
        weeks.push({ contributionDays: days });
    }
    return {
        totalContributions: 482,
        weeks
    };
}
