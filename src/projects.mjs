export const completedProjects = [
  {
    name: 'RoleReady AI', kind: 'roadmap', url: 'https://github.com/hrideymarwah15/roleready-ai',
    context: 'IISc Bangalore Hackathon · 2025',
    description: 'From a résumé and job description to a focused learning roadmap, shaped around the skills a person needs next.',
    details: ['Skill-gap analysis', 'Readiness scoring', 'Prerequisite-aware learning paths'],
    stack: 'Python / FastAPI / Sentence Transformers / NetworkX',
  },
  {
    name: 'Aushadhi OCR', kind: 'medicine',
    url: 'https://github.com/hrideymarwah15/Aushadhi_OCR',
    context: 'Medicine verification · OCR',
    description: 'Reads medicine packaging and prescriptions with OCR, then checks extracted details against stored verification records.',
    details: ['Packaging and prescription intake', 'Batch and expiry extraction', 'Scan history and verification records'],
    stack: 'Next.js / TypeScript / Three.js / Supabase',
  },
  {
    name: 'Supply Chain Simulator', kind: 'graph',
    url: 'https://github.com/sharmaaaditi/sc-disruption',
    context: 'Disruption modelling · Recovery planning',
    description: 'Models how supply disruptions spread, then compares alternative routes, suppliers and inventory recovery strategies.',
    details: ['Event-driven disruption simulation', 'Interactive network graphs', 'Recovery and cost analysis'],
    stack: 'React / Node.js / Socket.IO / PostgreSQL',
  },
];

export const activeProjects = [
  {
    name: 'AeroHarness', kind: 'aero', status: 'In development',
    url: 'https://github.com/hrideymarwah15/ai-harness',
    description: 'An agent harness exploring sandboxed execution, human approval gates and benchmark evaluation.',
    details: ['Controlled tool execution', 'Human review and verification', 'Agent evaluation'],
    stack: 'TypeScript / MCP / SQLite',
  },
  {
    name: 'Brain Architecture', kind: 'brain', status: 'Active research', url: null,
    description: 'Exploring how specialised agents, memory, planning and verification can work together in a shared cognitive workflow.',
    details: ['Multi-agent coordination and shared memory', 'Planning, tool use and failure recovery', 'Local and frontier model experiments'],
    question: 'How can specialised cognitive components coordinate to complete complex tasks more reliably and autonomously?',
    stack: 'Cognitive AI / Agent orchestration / Experimental systems',
  },
];
