export interface ProjectDB {
  id: string;
  title: string;
  slug: string;
  description: string;
  problem: string;
  outcome: string;
  tech_stack: string[]; // Array of strings in DB
  tag: string; // Primary tag
  tag_color: string;
  link: string | null;
  github_repo: string | null;
  github_stars: number | null;
  cover_image: string | null;
  featured: boolean;
  visible: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface BlogPostDB {
  id: string;
  title: string;
  slug: string;
  content_mdx: string;
  excerpt: string | null;
  cover_image: string | null;
  tags: string[];
  published: boolean;
  published_at: string | null;
  updated_at: string;
  author_id: string | null;
  created_at: string;
}

export interface LogDB {
  id: string;
  content: string;
  type: "commit" | "note" | "release";
  link: string | null;
  created_at: string;
}

export interface MessageDB {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

// Application Types (CamelCase)
export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  problem: string;
  outcome: string;
  techStack: string[];
  tag: string;
  tagColor: string;
  link: string | null;
  githubRepo: string | null;
  githubStars: number | null;
  coverImage: string | null;
  featured: boolean;
  visible: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  contentMdx: string;
  excerpt: string | null;
  coverImage: string | null;
  tags: string[];
  published: boolean;
  publishedAt: string | null;
  updatedAt: string;
  authorId: string | null;
  createdAt: string;
}

export interface Log {
  id: string;
  content: string;
  type: "commit" | "note" | "release";
  link: string | null;
  createdAt: string;
}
