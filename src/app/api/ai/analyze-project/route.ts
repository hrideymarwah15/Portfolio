import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface AnalysisRequest {
  repoUrl: string;
  readme: string;
  description: string;
  language: string;
  topics: string[];
}

// Simple AI-powered analysis using pattern matching and keyword extraction
function analyzeProject(data: AnalysisRequest): {
  problem: string;
  outcome: string;
  tag: string;
  tagColor: string;
} {
  const { readme, description, language, topics } = data;
  const content = (readme + " " + description).toLowerCase();

  // Extract problem statement
  let problem = description || "Project information not available";
  
  // Look for problem indicators in README
  const problemPatterns = [
    /(?:problem|challenge|issue|solves?|addresses?)[:\s]+([^.\n]{20,150})/i,
    /(?:why|motivation|background)[:\s]+([^.\n]{20,150})/i,
    /(?:built to|designed to|created to|aims to)[:\s]+([^.\n]{20,150})/i,
  ];

  for (const pattern of problemPatterns) {
    const match = readme.match(pattern);
    if (match && match[1]) {
      problem = match[1].trim();
      break;
    }
  }

  // If no problem found, use description
  if (problem === description && description) {
    problem = description.substring(0, 150);
  }

  // Extract outcome/features
  let outcome = "Explore the project to learn more";
  
  const outcomePatterns = [
    /(?:features|capabilities|functionality|provides|includes?)[:\s]+([^.\n]{20,150})/i,
    /(?:built with|uses|powered by)[:\s]+([^.\n]{20,150})/i,
    /(?:result|outcome|achievement)[:\s]+([^.\n]{20,150})/i,
  ];

  for (const pattern of outcomePatterns) {
    const match = readme.match(pattern);
    if (match && match[1]) {
      outcome = match[1].trim();
      break;
    }
  }

  // Determine tag and color based on content analysis
  let tag = "Build";
  let tagColor = "text-blue-600";

  // Active/Production
  if (
    content.includes("production") ||
    content.includes("live") ||
    content.includes("deployed") ||
    topics.includes("production")
  ) {
    tag = "Active";
    tagColor = "text-green-600";
  }
  // Research/Experimental
  else if (
    content.includes("research") ||
    content.includes("experiment") ||
    content.includes("prototype") ||
    content.includes("poc") ||
    topics.includes("research") ||
    topics.includes("experimental")
  ) {
    tag = "Research";
    tagColor = "text-gray-600";
  }
  // AI/ML
  else if (
    language === "Python" &&
    (content.includes("machine learning") ||
      content.includes("deep learning") ||
      content.includes("neural network") ||
      topics.some((t) => ["ml", "ai", "machine-learning", "tensorflow", "pytorch"].includes(t)))
  ) {
    tag = "AI/ML";
    tagColor = "text-purple-600";
  }
  // Web/Frontend
  else if (
    ["JavaScript", "TypeScript", "HTML", "CSS"].includes(language || "") ||
    topics.some((t) => ["react", "vue", "angular", "nextjs", "frontend", "web"].includes(t))
  ) {
    tag = "Web";
    tagColor = "text-blue-600";
  }
  // Backend/API
  else if (
    topics.some((t) => ["api", "backend", "server", "database"].includes(t)) ||
    content.includes("api") ||
    content.includes("backend")
  ) {
    tag = "Backend";
    tagColor = "text-orange-600";
  }

  return {
    problem: problem.length > 200 ? problem.substring(0, 197) + "..." : problem,
    outcome: outcome.length > 200 ? outcome.substring(0, 197) + "..." : outcome,
    tag,
    tagColor,
  };
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // Verify owner access
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const OWNER_EMAIL = "hrideymarwah2907@gmail.com";
    if (user.email !== OWNER_EMAIL) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const data: AnalysisRequest = await request.json();

    // Validate input
    if (!data.repoUrl) {
      return NextResponse.json({ error: "Repository URL is required" }, { status: 400 });
    }

    // Perform analysis
    const analysis = analyzeProject(data);

    return NextResponse.json({
      success: true,
      analysis,
    });
  } catch (error) {
    console.error("Error analyzing project:", error);
    return NextResponse.json({ error: "Failed to analyze project" }, { status: 500 });
  }
}
