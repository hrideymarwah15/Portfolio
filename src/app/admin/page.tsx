"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Save, RotateCcw, Eye, Plus, Trash2, ChevronDown, ChevronUp,
  Home, User, Briefcase, Code, Mail, Settings, X, Check,
  GripVertical, ExternalLink
} from "lucide-react";
import { SiteData, getSiteData, saveSiteData, defaultSiteData, Project } from "@/lib/siteData";
import Link from "next/link";

type TabId = "hero" | "about" | "projects" | "skills" | "contact" | "meta";

interface Tab {
  id: TabId;
  label: string;
  icon: React.ReactNode;
}

const tabs: Tab[] = [
  { id: "hero", label: "Hero", icon: <Home size={18} /> },
  { id: "about", label: "About", icon: <User size={18} /> },
  { id: "projects", label: "Projects", icon: <Briefcase size={18} /> },
  { id: "skills", label: "Skills", icon: <Code size={18} /> },
  { id: "contact", label: "Contact", icon: <Mail size={18} /> },
  { id: "meta", label: "Site Meta", icon: <Settings size={18} /> },
];

const tagColors = [
  { value: "text-green-600", label: "Green (Active)" },
  { value: "text-blue-600", label: "Blue (Build)" },
  { value: "text-gray-600", label: "Gray (Research)" },
  { value: "text-purple-600", label: "Purple" },
  { value: "text-orange-600", label: "Orange" },
  { value: "text-red-600", label: "Red" },
];

export default function AdminPage() {
  const [data, setData] = useState<SiteData>(defaultSiteData);
  const [activeTab, setActiveTab] = useState<TabId>("hero");
  const [hasChanges, setHasChanges] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  const [newSkill, setNewSkill] = useState("");

  useEffect(() => {
    const stored = getSiteData();
    setData(stored);
  }, []);

  const updateField = <K extends keyof SiteData>(
    section: K,
    field: keyof SiteData[K],
    value: SiteData[K][keyof SiteData[K]]
  ) => {
    setData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      }
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    saveSiteData(data);
    setHasChanges(false);
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 2000);
  };

  const handleReset = () => {
    if (confirm("Reset all data to defaults? This cannot be undone.")) {
      setData(defaultSiteData);
      saveSiteData(defaultSiteData);
      setHasChanges(false);
    }
  };

  // Project management
  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      title: "New Project",
      problem: "Describe the problem...",
      outcome: "Describe the outcome...",
      tag: "BUILD",
      tagColor: "text-blue-600",
      link: "#",
    };
    setData(prev => ({
      ...prev,
      projects: [...prev.projects, newProject],
    }));
    setExpandedProject(newProject.id);
    setHasChanges(true);
  };

  const updateProject = (id: string, field: keyof Project, value: string) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.map(p => 
        p.id === id ? { ...p, [field]: value } : p
      ),
    }));
    setHasChanges(true);
  };

  const deleteProject = (id: string) => {
    if (confirm("Delete this project?")) {
      setData(prev => ({
        ...prev,
        projects: prev.projects.filter(p => p.id !== id),
      }));
      setHasChanges(true);
    }
  };

  // Skills management
  const addSkill = () => {
    if (newSkill.trim() && !data.skills.includes(newSkill.trim())) {
      setData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill("");
      setHasChanges(true);
    }
  };

  const removeSkill = (skill: string) => {
    setData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill),
    }));
    setHasChanges(true);
  };

  // Stats management
  const updateStat = (index: number, field: "label" | "value", value: string) => {
    setData(prev => ({
      ...prev,
      about: {
        ...prev.about,
        stats: prev.about.stats.map((stat, i) =>
          i === index ? { ...stat, [field]: value } : stat
        ),
      },
    }));
    setHasChanges(true);
  };

  return (
    <div className="min-h-screen bg-[#f4f4f4]">
      {/* Grid Background */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
      />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b-2 border-black">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="font-mono font-black text-xl tracking-tight">
              // ADMIN PANEL
            </h1>
            <span className="px-2 py-1 bg-yellow-200 text-xs font-mono font-bold border border-black">
              SKETCH OS
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-2 px-3 py-2 font-mono text-sm font-bold border-2 border-black bg-white hover:bg-gray-100 transition-colors"
            >
              <Eye size={16} />
              PREVIEW
              <ExternalLink size={12} />
            </Link>

            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-3 py-2 font-mono text-sm font-bold border-2 border-black bg-white hover:bg-red-50 hover:border-red-500 hover:text-red-600 transition-colors"
            >
              <RotateCcw size={16} />
              RESET
            </button>

            <button
              onClick={handleSave}
              disabled={!hasChanges}
              className={`flex items-center gap-2 px-4 py-2 font-mono text-sm font-bold border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all ${
                hasChanges
                  ? "bg-black text-white hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed shadow-none"
              }`}
            >
              <Save size={16} />
              SAVE CHANGES
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="w-56 flex-shrink-0">
            <nav className="sticky top-24 space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 font-mono text-sm font-bold border-2 transition-all ${
                    activeTab === tab.id
                      ? "border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                      : "border-transparent bg-transparent hover:bg-white hover:border-gray-300"
                  }`}
                >
                  {tab.icon}
                  {tab.label.toUpperCase()}
                </button>
              ))}
            </nav>
          </aside>

          {/* Content Area */}
          <main className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="bg-white border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6"
              >
                {/* Hero Section */}
                {activeTab === "hero" && (
                  <div className="space-y-6">
                    <SectionHeader title="Hero Section" description="The main headline and intro text" />
                    
                    <InputField
                      label="Headline Line 1"
                      value={data.hero.headline1}
                      onChange={(v) => updateField("hero", "headline1", v)}
                      placeholder="I BUILD SOFTWARE"
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <InputField
                        label="Headline Line 2 (before highlight)"
                        value={data.hero.headline2}
                        onChange={(v) => updateField("hero", "headline2", v)}
                        placeholder="THAT"
                      />
                      <InputField
                        label="Highlighted Word"
                        value={data.hero.highlightWord}
                        onChange={(v) => updateField("hero", "highlightWord", v)}
                        placeholder="WORKS"
                      />
                    </div>

                    <TextareaField
                      label="Description"
                      value={data.hero.description}
                      onChange={(v) => updateField("hero", "description", v)}
                      placeholder="Full-stack engineer focused on..."
                      rows={3}
                    />

                    <InputField
                      label="Button Text"
                      value={data.hero.ctaText}
                      onChange={(v) => updateField("hero", "ctaText", v)}
                      placeholder="EXPLORE MY WORK"
                    />
                  </div>
                )}

                {/* About Section */}
                {activeTab === "about" && (
                  <div className="space-y-6">
                    <SectionHeader title="About Section" description="Your bio and stats" />
                    
                    <InputField
                      label="Name"
                      value={data.about.name}
                      onChange={(v) => updateField("about", "name", v)}
                      placeholder="HRIDEY MARWAH"
                    />

                    <TextareaField
                      label="Bio"
                      value={data.about.description}
                      onChange={(v) => updateField("about", "description", v)}
                      placeholder="I approach problems systematically..."
                      rows={4}
                    />

                    <InputField
                      label="Photo URL (optional)"
                      value={data.about.photoUrl}
                      onChange={(v) => updateField("about", "photoUrl", v)}
                      placeholder="/profile.jpg or https://..."
                    />

                    {/* Stats */}
                    <div>
                      <label className="block font-mono font-bold text-sm uppercase tracking-wider mb-3">
                        Stats
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {data.about.stats.map((stat, index) => (
                          <div
                            key={index}
                            className="border-2 border-dashed border-gray-300 p-3 space-y-2"
                          >
                            <input
                              type="text"
                              value={stat.label}
                              onChange={(e) => updateStat(index, "label", e.target.value)}
                              className="w-full px-2 py-1 text-xs font-mono border border-gray-300 focus:border-black focus:outline-none"
                              placeholder="Label"
                            />
                            <input
                              type="text"
                              value={stat.value}
                              onChange={(e) => updateStat(index, "value", e.target.value)}
                              className="w-full px-2 py-1 text-lg font-mono font-black border border-gray-300 focus:border-black focus:outline-none text-center"
                              placeholder="Value"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Projects Section */}
                {activeTab === "projects" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <SectionHeader title="Projects" description="Your portfolio work" />
                      <button
                        onClick={addProject}
                        className="flex items-center gap-2 px-4 py-2 font-mono text-sm font-bold border-2 border-black bg-white hover:bg-black hover:text-white transition-colors"
                      >
                        <Plus size={16} />
                        ADD PROJECT
                      </button>
                    </div>

                    <div className="space-y-3">
                      {data.projects.map((project) => (
                        <div
                          key={project.id}
                          className="border-2 border-black bg-gray-50"
                        >
                          <button
                            onClick={() => setExpandedProject(
                              expandedProject === project.id ? null : project.id
                            )}
                            className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <GripVertical size={16} className="text-gray-400" />
                              <span className="font-mono font-bold">{project.title}</span>
                              <span className={`px-2 py-0.5 text-xs font-mono font-bold border border-black ${project.tagColor}`}>
                                [{project.tag}]
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteProject(project.id);
                                }}
                                className="p-1 hover:bg-red-100 hover:text-red-600 rounded transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                              {expandedProject === project.id ? (
                                <ChevronUp size={16} />
                              ) : (
                                <ChevronDown size={16} />
                              )}
                            </div>
                          </button>

                          <AnimatePresence>
                            {expandedProject === project.id && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <div className="px-4 pb-4 pt-2 space-y-4 border-t border-dashed border-gray-300">
                                  <InputField
                                    label="Title"
                                    value={project.title}
                                    onChange={(v) => updateProject(project.id, "title", v)}
                                  />
                                  <TextareaField
                                    label="Problem"
                                    value={project.problem}
                                    onChange={(v) => updateProject(project.id, "problem", v)}
                                    rows={2}
                                  />
                                  <TextareaField
                                    label="Outcome"
                                    value={project.outcome}
                                    onChange={(v) => updateProject(project.id, "outcome", v)}
                                    rows={2}
                                  />
                                  <div className="grid grid-cols-2 gap-4">
                                    <InputField
                                      label="Tag"
                                      value={project.tag}
                                      onChange={(v) => updateProject(project.id, "tag", v)}
                                      placeholder="ACTIVE, BUILD, RESEARCH..."
                                    />
                                    <div>
                                      <label className="block font-mono font-bold text-xs uppercase tracking-wider mb-2">
                                        Tag Color
                                      </label>
                                      <select
                                        value={project.tagColor}
                                        onChange={(e) => updateProject(project.id, "tagColor", e.target.value)}
                                        className="w-full px-3 py-2 font-mono text-sm border-2 border-black focus:outline-none bg-white"
                                      >
                                        {tagColors.map((color) => (
                                          <option key={color.value} value={color.value}>
                                            {color.label}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                  </div>
                                  <InputField
                                    label="Link URL"
                                    value={project.link}
                                    onChange={(v) => updateProject(project.id, "link", v)}
                                    placeholder="https://..."
                                  />
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Skills Section */}
                {activeTab === "skills" && (
                  <div className="space-y-6">
                    <SectionHeader title="Skills" description="Your tech stack and expertise" />

                    {/* Add new skill */}
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addSkill()}
                        placeholder="Add a skill..."
                        className="flex-1 px-4 py-2 font-mono border-2 border-black focus:outline-none"
                      />
                      <button
                        onClick={addSkill}
                        disabled={!newSkill.trim()}
                        className="px-4 py-2 font-mono font-bold border-2 border-black bg-black text-white hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus size={18} />
                      </button>
                    </div>

                    {/* Skills list */}
                    <div className="flex flex-wrap gap-2">
                      {data.skills.map((skill) => (
                        <motion.div
                          key={skill}
                          layout
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className="flex items-center gap-2 px-3 py-2 border-2 border-black bg-white font-mono text-sm font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                        >
                          {skill}
                          <button
                            onClick={() => removeSkill(skill)}
                            className="hover:text-red-600 transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </motion.div>
                      ))}
                    </div>

                    {data.skills.length === 0 && (
                      <p className="text-gray-500 font-mono text-sm text-center py-8 border-2 border-dashed border-gray-300">
                        No skills added yet. Add some above!
                      </p>
                    )}
                  </div>
                )}

                {/* Contact Section */}
                {activeTab === "contact" && (
                  <div className="space-y-6">
                    <SectionHeader title="Contact Section" description="Your contact information" />

                    <div className="flex items-center gap-4 p-4 border-2 border-dashed border-gray-300 bg-gray-50">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={data.contact.isAvailable}
                            onChange={(e) => updateField("contact", "isAvailable", e.target.checked)}
                            className="sr-only"
                          />
                          <div className={`w-12 h-6 rounded-full transition-colors ${
                            data.contact.isAvailable ? "bg-green-500" : "bg-gray-300"
                          }`}>
                            <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full border-2 border-black transition-transform ${
                              data.contact.isAvailable ? "translate-x-6" : "translate-x-0.5"
                            }`} />
                          </div>
                        </div>
                        <span className="font-mono font-bold text-sm">
                          {data.contact.isAvailable ? "AVAILABLE" : "NOT AVAILABLE"}
                        </span>
                      </label>
                    </div>

                    <InputField
                      label="Availability Text"
                      value={data.contact.availabilityText}
                      onChange={(v) => updateField("contact", "availabilityText", v)}
                      placeholder="Available for new projects"
                    />

                    <TextareaField
                      label="Description"
                      value={data.contact.description}
                      onChange={(v) => updateField("contact", "description", v)}
                      rows={2}
                    />

                    <InputField
                      label="Email"
                      value={data.contact.email}
                      onChange={(v) => updateField("contact", "email", v)}
                      placeholder="you@example.com"
                      type="email"
                    />

                    <InputField
                      label="GitHub URL"
                      value={data.contact.github}
                      onChange={(v) => updateField("contact", "github", v)}
                      placeholder="https://github.com/username"
                    />

                    <InputField
                      label="LinkedIn URL"
                      value={data.contact.linkedin}
                      onChange={(v) => updateField("contact", "linkedin", v)}
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                )}

                {/* Meta Section */}
                {activeTab === "meta" && (
                  <div className="space-y-6">
                    <SectionHeader title="Site Metadata" description="SEO and general site settings" />

                    <InputField
                      label="Site Title"
                      value={data.meta.siteTitle}
                      onChange={(v) => updateField("meta", "siteTitle", v)}
                      placeholder="Your Name"
                    />

                    <TextareaField
                      label="Site Description (SEO)"
                      value={data.meta.siteDescription}
                      onChange={(v) => updateField("meta", "siteDescription", v)}
                      rows={2}
                      placeholder="A short description for search engines..."
                    />

                    <InputField
                      label="Footer Copyright Text"
                      value={data.meta.footerText}
                      onChange={(v) => updateField("meta", "footerText", v)}
                      placeholder="YOUR NAME"
                    />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* Save Toast */}
      <AnimatePresence>
        {showSavedToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 flex items-center gap-3 px-5 py-3 bg-black text-white font-mono font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(100,100,100,1)]"
          >
            <Check size={18} className="text-green-400" />
            Changes saved!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Helper Components
function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-6">
      <h2 className="font-mono font-black text-2xl tracking-tight mb-1">{title}</h2>
      <p className="text-gray-500 text-sm">{description}</p>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  placeholder = "",
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block font-mono font-bold text-xs uppercase tracking-wider mb-2">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 font-mono border-2 border-black focus:outline-none focus:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-shadow"
      />
    </div>
  );
}

function TextareaField({
  label,
  value,
  onChange,
  placeholder = "",
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <div>
      <label className="block font-mono font-bold text-xs uppercase tracking-wider mb-2">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-4 py-3 font-mono border-2 border-black focus:outline-none focus:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-shadow resize-none"
      />
    </div>
  );
}
