import React from "react";
import {
  ArrowUpRight,
  ArrowUp,
  ArrowRight,
  Plus,
  BracketsCurly,
  Database,
  Brain,
  BezierCurve,
  GitBranch,
  Terminal,
  Check,
  BookOpen,
  GraduationCap,
  Trophy,
  Code,
  ArrowDown,
} from "@phosphor-icons/react";
const GH = "https://github.com/hrideymarwah15/";
export const projectDetails = {
  "coding-harness": {
    role: "Solo build",
    focus: "Agent orchestration",
    proof: "8-stage engineering loop",
    facts: [
      [
        "Own the loop",
        "Orchestration, context compaction, tool execution, patching, recovery, and verification live in the harness. The model handles reasoning.",
      ],
      [
        "Meet the developer where they work",
        "A pnpm monorepo connects the core, server, CLI, and VS Code extension.",
      ],
      [
        "Make progress inspectable",
        "Explicit stages turn a task into a repeatable engineering workflow.",
      ],
    ],
    flow: [
      "Understand",
      "Explore",
      "Plan",
      "Act",
      "Observe",
      "Recover",
      "Verify",
      "Report",
    ],
  },
  StudyAssistant: {
    role: "Solo build",
    focus: "Local-first AI",
    proof: "On-device RAG & voice",
    facts: [
      [
        "Keep the knowledge local",
        "Ollama runs Mixtral and Qwen locally. Qdrant stores document embeddings for offline question answering.",
      ],
      [
        "Bring lectures into the workspace",
        "Whisper transcribes audio; sentence-transformers creates embeddings.",
      ],
      [
        "Connect the whole product",
        "A Next.js interface and Firebase authentication sit above a FastAPI service, with a Groq fallback.",
      ],
    ],
    flow: [
      "Documents / audio",
      "Embed / transcribe",
      "Retrieve",
      "Local answer",
    ],
  },
  "law3-ai": {
    role: "Backend engineering",
    focus: "Real-time services",
    proof: "124 REST endpoints",
    facts: [
      [
        "Build the service layer",
        "124 endpoints cover discovery, booking, chat, case tracking, notifications, and administration.",
      ],
      [
        "Make the conversation work",
        "Socket.io supports messaging, file sharing, and read receipts. Jitsi powers video consultations.",
      ],
      [
        "Connect access and guidance",
        "Supabase authentication, Postgres, Redis, Razorpay, and bilingual Gemini-powered guidance.",
      ],
    ],
    flow: ["Discover", "Book", "Consult", "Track a case"],
  },
  "ai-agency-os": {
    role: "Solo build",
    focus: "Multi-agent automation",
    proof: "Rules, roles & approval limits",
    facts: [
      [
        "Coordinate specialised agents",
        "Departments cover discovery, qualification, negotiation, contracts, delivery, and payment collection.",
      ],
      [
        "Keep the owner in control",
        "Services, pricing rules, brand guidelines, legal templates, and approval limits define the operating boundaries.",
      ],
      [
        "Build the infrastructure",
        "FastAPI, PostgreSQL, SQLAlchemy, and Alembic provide the application and data layer.",
      ],
    ],
    flow: ["Discover", "Qualify", "Negotiate", "Deliver"],
  },
  "sc-disruption": {
    role: "Solo build",
    focus: "Graph algorithms",
    proof: "Event-driven disruption modelling",
    facts: [
      [
        "Model the network",
        "Suppliers, warehouses, distribution, and retailers form a connected graph.",
      ],
      [
        "Follow the consequences",
        "An introduced disruption propagates through an event-driven simulation.",
      ],
      [
        "Explore recovery",
        "Inventory analysis and recovery optimisation help examine what happens next.",
      ],
    ],
    flow: ["Supplier", "Warehouse", "Distribution", "Retailer"],
  },
  "ai-harness": {
    role: "Solo build",
    focus: "Agent evaluation",
    proof: "Sandboxed execution & benchmarks",
    facts: [
      [
        "Make the agent measurable",
        "An evaluator runs against SWE-bench Verified and Lite and reports pass rate, token efficiency, resolution time, and auto-heal rate.",
      ],
      [
        "Put execution inside boundaries",
        "Docker, E2B, or bubblewrap sandbox execution. Human approval gates protect destructive changes.",
      ],
      [
        "Keep a record",
        "MCP integration, JSONL traces, and a deterministic mock runner support inspection and repeatable CI runs.",
      ],
    ],
    flow: ["Reason", "Act", "Learn", "Plan", "Heal"],
  },
};
export function BuildDetails({ slug, stack, compact = false }) {
  const d = projectDetails[slug];
  return (
    <details className={"build-details " + (compact ? "compact" : "")}>
      <summary>
        <span>Project details</span>
        <Plus size={17} />
      </summary>
      <div className="build-details-body">
        <p className="build-overview">{d.role} · {d.proof}</p>
        {stack && <p className="build-overview">{stack}</p>}
        {!compact && <p className="artwork-attribution">Project visual created for this portfolio.</p>}
        <div className="build-facts">
          {d.facts.map(([title, body]) => (
            <div key={title}>
              <strong>{title}</strong>
              <p>{body}</p>
            </div>
          ))}
        </div>
        <div className="build-flow" aria-label="Project architecture">
          {d.flow.map((s, i) => (
            <React.Fragment key={s}>
              <span>{s}</span>
              {i < d.flow.length - 1 && (
                <ArrowRight size={12} aria-hidden="true" />
              )}
            </React.Fragment>
          ))}
        </div>
        <a
          href={GH + slug}
          target="_blank"
          rel="noreferrer"
          className="text-link"
        >
          Read the code
          <ArrowUpRight size={15} />
        </a>
      </div>
    </details>
  );
}
const journey = [
  {
    Icon: GraduationCap,
    period: "2025 — 2029",
    name: "Computer Science, with an AI lens.",
    org: "Newton School of Technology · Rishihood University",
    body: "B.Tech in Computer Science & Engineering (AI), Sonipat. Studying the foundations while building full-stack systems and applied AI projects.",
  },
  {
    Icon: GitBranch,
    period: "Open source · Ongoing",
    name: "Learning inside JAX.",
    org: "Contributor · Numerical computing & machine learning",
    body: "Reading performance-oriented systems code, contributing to an open-source numerical computing framework, and exploring optimisation in ML pipelines.",
  },
  {
    Icon: Code,
    period: "2025 — Present",
    name: "Tech Head, Sports Club.",
    org: "Hanumaant Sports Fest · Damru Fest",
    body: "Owned digital systems and technical infrastructure for two campus fests, connecting communication, event operations, and multiple teams.",
  },
  {
    Icon: Trophy,
    period: "2025",
    name: "Building under a deadline.",
    org: "IIIT Gwalior InfoTsav ’25 · IISc Bangalore · Decode by NST",
    body: "Hackathon finalist at IIIT Gwalior InfoTsav ’25, IISc Bangalore, and Decode by NST.",
  },
];
export function Journey() {
  return (
    <div className="background-milestones shell">
      {journey.slice(0, 3).map(({ Icon, period, name, org }) => (
        <details className="milestone" key={name}>
          <summary><Icon size={25} aria-hidden="true"/><h3>{name}</h3><Plus size={18}/></summary>
          <div><p>{org}</p><p>{period}</p></div>
        </details>
      ))}
    </div>
  );
}
export function EarlierWork() {
  const work = [
    {
      name: "Medical OCR System",
      slug: "Aushadhi_OCR",
      stack: "Python · OpenCV · AI",
      body: "Prescription and record digitisation, from noise reduction and thresholding to AI-assisted text corrections and structured data.",
      scope: "Computer vision / Data extraction",
    },
    {
      name: "Legal Issue Management",
      slug: "v0-legal-issue-reporting",
      stack: "Next.js · Supabase",
      body: "Issue reporting, role-based access, case lifecycles, and real-time database workflows in a full-stack legal platform.",
      scope: "Access control / Workflow design",
    },
    {
      name: "SaaS Life Tracker",
      slug: null,
      stack: "React · State management",
      body: "Tasks, notes, and scheduling in one productivity system, with relational state across connected workflows.",
      scope: "Product thinking / Application state",
    },
  ];
  return (
    <details className="earlier-work"><summary>Earlier projects <Plus size={18}/></summary><div className="archive-content">
      <div className="earlier-list">
        {work.map((p) => (
          <article key={p.name}>
            <div className="earlier-name">
              <h3>
                {p.slug ? (
                  <a href={GH + p.slug} target="_blank" rel="noreferrer">
                    {p.name}
                    <ArrowUpRight size={18} />
                  </a>
                ) : (
                  p.name
                )}
              </h3>
              <span>{p.stack}</span>
            </div>

          </article>
        ))}
      </div>
    </div></details>
  );
}
