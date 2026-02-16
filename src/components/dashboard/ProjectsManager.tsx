"use client";

import { useState, useTransition } from "react";
import {
  Plus,
  Trash2,
  Save,
  Eye,
  EyeOff,
  Github,
  RefreshCw,
  Star,
  ExternalLink,
  GripVertical,
  ChevronDown,
  ChevronUp,
  Search,
  X,
} from "lucide-react";
import {
  createProjectAction,
  updateProjectAction,
  deleteProjectAction,
  syncProjectGitHubAction,
  syncAllProjectsGitHubAction,
} from "@/lib/actions";
import type { Project } from "@/lib/types";

interface GitHubRepo {
  id: number;
  name: string;
  fullName: string;
  description: string;
  htmlUrl: string;
  stars: number;
  language: string;
  topics: string[];
  updatedAt: string;
}

interface ProjectsManagerProps {
  initialProjects: Project[];
}

const tagColors = [
  { value: "text-green-600", label: "Green (Active)" },
  { value: "text-blue-600", label: "Blue (Build)" },
  { value: "text-gray-600", label: "Gray (Research)" },
  { value: "text-purple-600", label: "Purple" },
  { value: "text-orange-600", label: "Orange" },
  { value: "text-red-600", label: "Red" },
];

export default function ProjectsManager({ initialProjects }: ProjectsManagerProps) {
  const [projects, setProjects] = useState(initialProjects);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [showRepoModal, setShowRepoModal] = useState(false);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [repoSearch, setRepoSearch] = useState("");

  const fetchGitHubRepos = async () => {
    setLoadingRepos(true);
    try {
      const response = await fetch("/api/github/repos");
      if (!response.ok) {
        const error = await response.json();
        alert(error.error || "Failed to fetch repositories");
        return;
      }
      const data = await response.json();
      setRepos(data);
      setShowRepoModal(true);
    } catch (error) {
      alert("Failed to fetch repositories");
    } finally {
      setLoadingRepos(false);
    }
  };

  const handleImportRepo = async (repo: GitHubRepo) => {
    startTransition(async () => {
      try {
        // Fetch README to analyze
        let readmeContent = "";
        try {
          const readmeResponse = await fetch(
            `https://api.github.com/repos/${repo.fullName}/readme`,
            {
              headers: { Accept: "application/vnd.github.v3.raw" },
            }
          );
          if (readmeResponse.ok) {
            readmeContent = await readmeResponse.text();
          }
        } catch (error) {
          console.error("Failed to fetch README:", error);
        }

        // Call AI analysis API
        let aiAnalysis = null;
        try {
          const analysisResponse = await fetch("/api/ai/analyze-project", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              repoUrl: repo.htmlUrl,
              readme: readmeContent,
              description: repo.description || "",
              language: repo.language || "",
              topics: repo.topics || [],
            }),
          });

          if (analysisResponse.ok) {
            const data = await analysisResponse.json();
            aiAnalysis = data.analysis;
          }
        } catch (error) {
          console.error("AI analysis failed:", error);
        }

        // Create project with AI-analyzed data
        const result = await createProjectAction({
          title: repo.name,
          slug: repo.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          description: repo.description || "Imported project",
          problem: aiAnalysis?.problem || repo.description || "Add project description here...",
          outcome: aiAnalysis?.outcome || "",
          techStack: [repo.language || "TypeScript"],
          tag: aiAnalysis?.tag || repo.language || "PROJECT",
          tagColor: aiAnalysis?.tagColor || "text-blue-600",
          link: repo.htmlUrl,
          githubRepo: repo.fullName,
          githubStars: repo.stars,
          featured: false,
        });

        if (result.success && result.project) {
          setProjects([...projects, result.project]);
          setExpandedId(result.project.id);
          setShowRepoModal(false);
        }
      } catch (error) {
        console.error("Failed to import repo:", error);
      }
    });
  };

  const filteredRepos = repos.filter(
    (repo) =>
      repo.name.toLowerCase().includes(repoSearch.toLowerCase()) ||
      repo.description.toLowerCase().includes(repoSearch.toLowerCase())
  );

  const handleCreate = () => {
    startTransition(async () => {
      const result = await createProjectAction({
        title: "New Project",
        slug: "new-project",
        description: "Project description",
        problem: "Describe your project here...",
        outcome: "",
        techStack: ["React", "TypeScript"],
        tag: "BUILD",
        tagColor: "text-blue-600",
        featured: false,
      });

      if (result.success && result.project) {
        setProjects([...projects, result.project]);
        setExpandedId(result.project.id);
      }
    });
  };

  const handleUpdate = (id: string, data: Partial<Project>) => {
    startTransition(async () => {
      // @ts-ignore
      const result = await updateProjectAction(id, data);

      if (result.success && result.project) {
        setProjects(projects.map((p) => (p.id === id ? result.project! : p)));
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this project?")) return;

    startTransition(async () => {
      const result = await deleteProjectAction(id);

      if (result.success) {
        setProjects(projects.filter((p) => p.id !== id));
      }
    });
  };

  const handleSyncProject = (id: string) => {
    setSyncingId(id);
    startTransition(async () => {
      const result = await syncProjectGitHubAction(id);

      if (result.success && result.project) {
        setProjects(projects.map((p) => (p.id === id ? result.project! : p)));
      }
      setSyncingId(null);
    });
  };

  const handleSyncAll = () => {
    startTransition(async () => {
      await syncAllProjectsGitHubAction();
      window.location.reload();
    });
  };

  return (
    <div>
      {/* Actions Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-3">
          <button
            onClick={handleCreate}
            disabled={isPending}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white font-mono font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-white hover:text-black hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            <Plus size={18} />
            ADD PROJECT
          </button>

          <button
            onClick={fetchGitHubRepos}
            disabled={isPending || loadingRepos}
            className="flex items-center gap-2 px-4 py-2 bg-white text-black font-mono font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-100 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            <Github size={18} />
            {loadingRepos ? "LOADING..." : "IMPORT FROM GITHUB"}
          </button>
        </div>

        <button
          onClick={handleSyncAll}
          disabled={isPending}
          className="flex items-center gap-2 px-4 py-2 bg-white text-black font-mono font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-100 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
        >
          <RefreshCw size={18} className={isPending ? "animate-spin" : ""} />
          SYNC ALL GITHUB
        </button>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            isExpanded={expandedId === project.id}
            onToggle={() => setExpandedId(expandedId === project.id ? null : project.id)}
            onUpdate={(data) => handleUpdate(project.id, data)}
            onDelete={() => handleDelete(project.id)}
            onSync={() => handleSyncProject(project.id)}
            isSyncing={syncingId === project.id}
            isPending={isPending}
          />
        ))}

        {projects.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="font-mono">No projects yet. Create your first project!</p>
          </div>
        )}
      </div>

      {/* GitHub Repo Modal */}
      {showRepoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-4xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b-2 border-black">
              <h2 className="text-2xl font-mono font-bold">SELECT GITHUB REPO</h2>
              <button
                onClick={() => setShowRepoModal(false)}
                className="p-2 hover:bg-gray-100 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 border-b-2 border-black">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={repoSearch}
                  onChange={(e) => setRepoSearch(e.target.value)}
                  placeholder="Search repositories..."
                  className="w-full pl-10 pr-4 py-3 border-2 border-black font-mono focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-3">
                {filteredRepos.length === 0 ? (
                  <p className="text-center text-gray-500 font-mono py-8">
                    {repoSearch ? "No repositories found" : "No repositories available"}
                  </p>
                ) : (
                  filteredRepos.map((repo) => (
                    <button
                      key={repo.id}
                      onClick={() => handleImportRepo(repo)}
                      disabled={isPending}
                      className="w-full p-4 border-2 border-black hover:bg-gray-50 transition-colors text-left disabled:opacity-50"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-mono font-bold text-lg">{repo.name}</h3>
                            {repo.language && (
                              <span className="px-2 py-0.5 bg-gray-100 border border-gray-300 text-xs font-mono">
                                {repo.language}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 font-mono mb-2">
                            {repo.description || "No description"}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-500 font-mono">
                            <span className="flex items-center gap-1">
                              <Star size={14} className="text-yellow-500" />
                              {repo.stars}
                            </span>
                            <span>{repo.fullName}</span>
                          </div>
                        </div>
                        <Github size={24} className="text-gray-400 flex-shrink-0" />
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface ProjectCardProps {
  project: Project;
  isExpanded: boolean;
  onToggle: () => void;
  onUpdate: (data: Partial<Project>) => void;
  onDelete: () => void;
  onSync: () => void;
  isSyncing: boolean;
  isPending: boolean;
}

function ProjectCard({
  project,
  isExpanded,
  onToggle,
  onUpdate,
  onDelete,
  onSync,
  isSyncing,
  isPending,
}: ProjectCardProps) {
  const [localData, setLocalData] = useState(project);

  const handleSave = () => {
    onUpdate({
      title: localData.title,
      slug: localData.slug,
      description: localData.description,
      problem: localData.problem,
      outcome: localData.outcome,
      techStack: localData.techStack,
      tag: localData.tag,
      tagColor: localData.tagColor,
      link: localData.link || undefined,
      githubRepo: localData.githubRepo || undefined,
      featured: localData.featured,
      visible: localData.visible,
    });
  };

  return (
    <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      {/* Header */}
      <div
        className="flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={onToggle}
      >
        <GripVertical className="text-gray-400" size={20} />

        <div className="flex-1">
          <div className="flex items-center gap-3">
             <h3 className="font-mono font-bold">{project.title}</h3>
             {project.featured && <Star size={16} className="text-yellow-500 fill-yellow-500" />}
             <span className={`text-xs font-mono ${project.tagColor}`}>
                [{project.tag}]
             </span>
          </div>
          {project.githubRepo && (
            <p className="text-xs text-gray-500 font-mono mt-1">
              <Github size={12} className="inline mr-1" />
              {project.githubRepo}
              {project.githubStars !== null && (
                <span className="ml-2">
                  <Star size={12} className="inline mr-1" />
                  {project.githubStars}
                </span>
              )}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onUpdate({ visible: !project.visible });
            }}
            className={`p-2 border-2 border-black transition-colors ${project.visible
              ? "bg-green-100 text-green-600"
              : "bg-gray-100 text-gray-400"
              }`}
          >
            {project.visible ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>

          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-4 border-t-2 border-black space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-gray-500 uppercase mb-1">
                Title
              </label>
              <input
                type="text"
                value={localData.title}
                onChange={(e) => setLocalData({ ...localData, title: e.target.value })}
                className="w-full px-3 py-2 border-2 border-black font-mono focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-500 uppercase mb-1">
                Slug (URL)
              </label>
              <input
                type="text"
                value={localData.slug}
                onChange={(e) => setLocalData({ ...localData, slug: e.target.value })}
                className="w-full px-3 py-2 border-2 border-black font-mono focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-gray-500 uppercase mb-1">
              Short Description
            </label>
            <input
              type="text"
              value={localData.description}
              onChange={(e) => setLocalData({ ...localData, description: e.target.value })}
              className="w-full px-3 py-2 border-2 border-black font-mono focus:outline-none focus:ring-2 focus:ring-black"
             />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-gray-500 uppercase mb-1">
                Tag
              </label>
              <input
                type="text"
                value={localData.tag}
                onChange={(e) => setLocalData({ ...localData, tag: e.target.value })}
                className="w-full px-3 py-2 border-2 border-black font-mono focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
             <div>
                <label className="block text-xs font-mono text-gray-500 uppercase mb-1">
                  Tag Color
                </label>
                <select
                  value={localData.tagColor}
                  onChange={(e) => setLocalData({ ...localData, tagColor: e.target.value })}
                  className="w-full px-3 py-2 border-2 border-black font-mono focus:outline-none focus:ring-2 focus:ring-black"
                >
                  {tagColors.map((color) => (
                    <option key={color.value} value={color.value}>
                      {color.label}
                    </option>
                  ))}
                </select>
             </div>
          </div>

           <div>
              <label className="block text-xs font-mono text-gray-500 uppercase mb-1">
                Tech Stack (comma separated)
              </label>
              <input
                type="text"
                value={localData.techStack.join(", ")}
                onChange={(e) => setLocalData({ ...localData, techStack: e.target.value.split(",").map(t => t.trim()) })}
                className="w-full px-3 py-2 border-2 border-black font-mono focus:outline-none focus:ring-2 focus:ring-black"
              />
           </div>

          <div>
            <label className="block text-xs font-mono text-gray-500 uppercase mb-1">
              Case Study: Problem
            </label>
            <textarea
              value={localData.problem || ""}
              onChange={(e) => setLocalData({ ...localData, problem: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border-2 border-black font-mono focus:outline-none focus:ring-2 focus:ring-black resize-none"
              placeholder="Describe the problem..."
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-gray-500 uppercase mb-1">
              Case Study: Outcome / Solution
            </label>
            <textarea
              value={localData.outcome || ""}
              onChange={(e) => setLocalData({ ...localData, outcome: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border-2 border-black font-mono focus:outline-none focus:ring-2 focus:ring-black resize-none"
              placeholder="Describe the outcome..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-gray-500 uppercase mb-1">
                Project Link (repo/code)
              </label>
              <input
                type="url"
                value={localData.link || ""}
                onChange={(e) => setLocalData({ ...localData, link: e.target.value })}
                className="w-full px-3 py-2 border-2 border-black font-mono focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="https://github.com/..."
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-500 uppercase mb-1">
                GitHub Repo (owner/repo)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={localData.githubRepo || ""}
                  onChange={(e) => setLocalData({ ...localData, githubRepo: e.target.value })}
                  className="flex-1 px-3 py-2 border-2 border-black font-mono focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="username/repo"
                />
                <button
                  onClick={onSync}
                  disabled={isPending || !project.githubRepo}
                  className="px-3 py-2 border-2 border-black hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                  <RefreshCw size={18} className={isSyncing ? "animate-spin" : ""} />
                </button>
              </div>
            </div>
          </div>

          {/* GitHub Stats & Featured */}
          <div className="grid grid-cols-2 gap-4">
             {project.githubStars !== null && (
               <div className="p-3 bg-gray-50 border-2 border-dashed border-gray-300">
                 <p className="text-xs font-mono text-gray-500 uppercase mb-2">GitHub Stats</p>
                 <div className="flex gap-4 text-sm font-mono">
                   <span>
                     <Star size={14} className="inline mr-1 text-yellow-500" />
                     {project.githubStars} stars
                   </span>
                 </div>
               </div>
             )}
             <div className="flex items-center gap-2 p-3 border-2 border-dashed border-gray-300">
                <input
                  type="checkbox"
                  id={`featured-${project.id}`}
                  checked={localData.featured}
                  onChange={(e) => setLocalData({ ...localData, featured: e.target.checked })}
                  className="w-4 h-4 border-2 border-black"
                />
                <label htmlFor={`featured-${project.id}`} className="font-mono text-sm cursor-pointer">Featured Project</label>
             </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-dashed border-gray-300">
            <button
              onClick={onDelete}
              disabled={isPending}
              className="flex items-center gap-2 px-4 py-2 text-red-600 font-mono font-bold border-2 border-red-600 hover:bg-red-50 transition-colors"
            >
              <Trash2 size={16} />
              DELETE
            </button>

            <div className="flex gap-2">
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 font-mono border-2 border-gray-300 hover:border-black transition-colors"
                >
                  <ExternalLink size={16} />
                  VIEW
                </a>
              )}
              <button
                onClick={handleSave}
                disabled={isPending}
                className="flex items-center gap-2 px-4 py-2 bg-black text-white font-mono font-bold border-2 border-black hover:bg-white hover:text-black transition-colors"
              >
                <Save size={16} />
                SAVE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
