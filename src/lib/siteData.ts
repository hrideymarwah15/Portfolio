// Site data types and default values
export interface HeroData {
  headline1: string;
  headline2: string;
  highlightWord: string;
  description: string;
  ctaText: string;
}

export interface AboutData {
  name: string;
  description: string;
  photoUrl: string;
  stats: {
    label: string;
    value: string;
  }[];
}

export interface Project {
  id: string;
  title: string;
  problem: string;
  outcome: string;
  tag: string;
  tagColor: string;
  link: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  topics: string[];
  updated_at: string;
}

export interface ContactData {
  availabilityText: string;
  isAvailable: boolean;
  description: string;
  email: string;
  github: string;
  linkedin: string;
}

export interface SiteMetaData {
  siteTitle: string;
  siteDescription: string;
  footerText: string;
}

export interface SiteData {
  hero: HeroData;
  about: AboutData;
  projects: Project[];
  skills: string[];
  contact: ContactData;
  meta: SiteMetaData;
  githubUsername: string;
  selectedGitHubRepos: GitHubRepo[];
}

export const defaultSiteData: SiteData = {
  hero: {
    headline1: "I BUILD SOFTWARE",
    headline2: "THAT",
    highlightWord: "WORKS",
    description: "Full-stack engineer focused on reliable systems, clear interfaces, and production-grade code.",
    ctaText: "EXPLORE MY WORK",
  },
  about: {
    name: "HRIDEY MARWAH",
    description: "I approach problems systematically. Requirements are clarified before code is written. Interfaces are designed before systems are built. Trade-offs are documented and revisited.",
    photoUrl: "",
    stats: [
      { label: "Years", value: "4+" },
      { label: "Projects", value: "20+" },
      { label: "Stack", value: "Full" },
      { label: "Status", value: "Open" },
    ],
  },
  projects: [
    {
      id: "1",
      title: "Nyaay Saathi",
      problem: "Legal aid platform connecting underserved communities with lawyers.",
      outcome: "Reduced case intake from days to minutes.",
      tag: "ACTIVE",
      tagColor: "text-green-600",
      link: "#",
    },
    {
      id: "2",
      title: "Infrastructure Monitoring",
      problem: "Real-time alerting for distributed cloud services.",
      outcome: "Sub-minute detection across 500+ services.",
      tag: "BUILD",
      tagColor: "text-blue-600",
      link: "#",
    },
    {
      id: "3",
      title: "Document Processing",
      problem: "Automated extraction for enterprise documents.",
      outcome: "10M+ docs/month at 99.7% accuracy.",
      tag: "RESEARCH",
      tagColor: "text-gray-600",
      link: "#",
    },
    {
      id: "4",
      title: "API Gateway",
      problem: "Unified auth, rate limiting, and routing.",
      outcome: "Consolidated 12 legacy endpoints.",
      tag: "BUILD",
      tagColor: "text-blue-600",
      link: "#",
    },
  ],
  skills: [
    "TypeScript", "React", "Node.js", "Python",
    "PostgreSQL", "AWS", "Docker", "System Design",
    "Next.js", "GraphQL", "Redis", "Kubernetes"
  ],
  contact: {
    availabilityText: "Available for new projects",
    isAvailable: true,
    description: "Open to discussing opportunities or interesting problems.",
    email: "hridey@example.com",
    github: "https://github.com/hridey",
    linkedin: "https://linkedin.com/in/hridey",
  },
  meta: {
    siteTitle: "Hridey Marwah",
    siteDescription: "Software engineer building reliable systems and clear interfaces.",
    footerText: "HRIDEY MARWAH",
  },
  githubUsername: "",
  selectedGitHubRepos: [],
};

const STORAGE_KEY = "portfolio_site_data";

export function getSiteData(): SiteData {
  if (typeof window === "undefined") {
    return defaultSiteData;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...defaultSiteData, ...JSON.parse(stored) };
    }
  } catch (e) {
    console.error("Error reading site data:", e);
  }

  return defaultSiteData;
}

export function saveSiteData(data: SiteData): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Error saving site data:", e);
  }
}

export function resetSiteData(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
