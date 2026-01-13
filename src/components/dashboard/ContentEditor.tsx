"use client";

import { useState, useTransition } from "react";
import { Save, Check, X, Plus, Trash2 } from "lucide-react";
import {
  updateHeroAction,
  updateAboutAction,
  updateContactAction,
  updateMetaAction,
  updateSkillsAction,
  updateAvailabilityAction,
} from "@/lib/actions";
import type { HeroData, AboutData, ContactData, MetaData } from "@/lib/db";

interface ContentEditorProps {
  initialHero: HeroData;
  initialAbout: AboutData;
  initialContact: ContactData;
  initialMeta: MetaData;
  initialSkills: string[];
  initialAvailability: { isAvailable: boolean; message: string };
}

type TabId = "hero" | "about" | "contact" | "meta" | "skills" | "availability";

export default function ContentEditor({
  initialHero,
  initialAbout,
  initialContact,
  initialMeta,
  initialSkills,
  initialAvailability,
}: ContentEditorProps) {
  const [activeTab, setActiveTab] = useState<TabId>("hero");
  const [isPending, startTransition] = useTransition();
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  // Form states
  const [hero, setHero] = useState(initialHero);
  const [about, setAbout] = useState(initialAbout);
  const [contact, setContact] = useState(initialContact);
  const [meta, setMeta] = useState(initialMeta);
  const [skills, setSkills] = useState(initialSkills);
  const [availability, setAvailability] = useState(initialAvailability);
  const [newSkill, setNewSkill] = useState("");

  const tabs: { id: TabId; label: string }[] = [
    { id: "hero", label: "Hero" },
    { id: "about", label: "About" },
    { id: "contact", label: "Contact" },
    { id: "meta", label: "Site Meta" },
    { id: "skills", label: "Skills" },
    { id: "availability", label: "Availability" },
  ];

  const handleSave = async () => {
    setSaveStatus("saving");
    
    startTransition(async () => {
      try {
        switch (activeTab) {
          case "hero":
            await updateHeroAction(hero);
            break;
          case "about":
            await updateAboutAction(about);
            break;
          case "contact":
            await updateContactAction(contact);
            break;
          case "meta":
            await updateMetaAction(meta);
            break;
          case "skills":
            await updateSkillsAction(skills);
            break;
          case "availability":
            await updateAvailabilityAction(availability.isAvailable, availability.message);
            break;
        }
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2000);
      } catch {
        setSaveStatus("error");
        setTimeout(() => setSaveStatus("idle"), 2000);
      }
    });
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const updateStat = (index: number, field: "label" | "value", value: string) => {
    const newStats = [...about.stats];
    newStats[index] = { ...newStats[index], [field]: value };
    setAbout({ ...about, stats: newStats });
  };

  return (
    <div className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      {/* Tabs */}
      <div className="flex border-b-2 border-black overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 font-mono text-sm font-bold whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? "bg-black text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Hero Tab */}
        {activeTab === "hero" && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-gray-500 uppercase mb-1">
                Headline 1
              </label>
              <input
                type="text"
                value={hero.headline1}
                onChange={(e) => setHero({ ...hero, headline1: e.target.value })}
                className="w-full px-3 py-2 border-2 border-black font-mono focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-500 uppercase mb-1">
                Headline 2
              </label>
              <input
                type="text"
                value={hero.headline2}
                onChange={(e) => setHero({ ...hero, headline2: e.target.value })}
                className="w-full px-3 py-2 border-2 border-black font-mono focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-500 uppercase mb-1">
                Highlight Word
              </label>
              <input
                type="text"
                value={hero.highlightWord}
                onChange={(e) => setHero({ ...hero, highlightWord: e.target.value })}
                className="w-full px-3 py-2 border-2 border-black font-mono focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-500 uppercase mb-1">
                Description
              </label>
              <textarea
                value={hero.description}
                onChange={(e) => setHero({ ...hero, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border-2 border-black font-mono focus:outline-none focus:ring-2 focus:ring-black resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-500 uppercase mb-1">
                CTA Text
              </label>
              <input
                type="text"
                value={hero.ctaText}
                onChange={(e) => setHero({ ...hero, ctaText: e.target.value })}
                className="w-full px-3 py-2 border-2 border-black font-mono focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>
        )}

        {/* About Tab */}
        {activeTab === "about" && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-gray-500 uppercase mb-1">
                Name
              </label>
              <input
                type="text"
                value={about.name}
                onChange={(e) => setAbout({ ...about, name: e.target.value })}
                className="w-full px-3 py-2 border-2 border-black font-mono focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-500 uppercase mb-1">
                Description
              </label>
              <textarea
                value={about.description}
                onChange={(e) => setAbout({ ...about, description: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border-2 border-black font-mono focus:outline-none focus:ring-2 focus:ring-black resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-500 uppercase mb-1">
                Photo URL
              </label>
              <input
                type="text"
                value={about.photoUrl}
                onChange={(e) => setAbout({ ...about, photoUrl: e.target.value })}
                className="w-full px-3 py-2 border-2 border-black font-mono focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-500 uppercase mb-2">
                Stats
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {about.stats.map((stat, index) => (
                  <div key={index} className="p-3 border-2 border-dashed border-gray-300">
                    <input
                      type="text"
                      value={stat.label}
                      onChange={(e) => updateStat(index, "label", e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 font-mono text-xs mb-2 focus:outline-none focus:border-black"
                      placeholder="Label"
                    />
                    <input
                      type="text"
                      value={stat.value}
                      onChange={(e) => updateStat(index, "value", e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 font-mono font-bold focus:outline-none focus:border-black"
                      placeholder="Value"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Contact Tab */}
        {activeTab === "contact" && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-gray-500 uppercase mb-1">
                Description
              </label>
              <textarea
                value={contact.description}
                onChange={(e) => setContact({ ...contact, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border-2 border-black font-mono focus:outline-none focus:ring-2 focus:ring-black resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-500 uppercase mb-1">
                Email
              </label>
              <input
                type="email"
                value={contact.email}
                onChange={(e) => setContact({ ...contact, email: e.target.value })}
                className="w-full px-3 py-2 border-2 border-black font-mono focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-500 uppercase mb-1">
                GitHub URL
              </label>
              <input
                type="url"
                value={contact.github}
                onChange={(e) => setContact({ ...contact, github: e.target.value })}
                className="w-full px-3 py-2 border-2 border-black font-mono focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-500 uppercase mb-1">
                LinkedIn URL
              </label>
              <input
                type="url"
                value={contact.linkedin}
                onChange={(e) => setContact({ ...contact, linkedin: e.target.value })}
                className="w-full px-3 py-2 border-2 border-black font-mono focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>
        )}

        {/* Meta Tab */}
        {activeTab === "meta" && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-gray-500 uppercase mb-1">
                Footer Text
              </label>
              <input
                type="text"
                value={meta.footerText}
                onChange={(e) => setMeta({ ...meta, footerText: e.target.value })}
                className="w-full px-3 py-2 border-2 border-black font-mono focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>
        )}

        {/* Skills Tab */}
        {activeTab === "skills" && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-gray-500 uppercase mb-2">
                Add Skill
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addSkill()}
                  className="flex-1 px-3 py-2 border-2 border-black font-mono focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Enter skill name..."
                />
                <button
                  onClick={addSkill}
                  className="px-4 py-2 bg-black text-white font-mono font-bold border-2 border-black hover:bg-white hover:text-black transition-colors"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="flex items-center gap-2 px-3 py-1 border-2 border-black font-mono text-sm bg-gray-50"
                >
                  {skill}
                  <button
                    onClick={() => removeSkill(skill)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Availability Tab */}
        {activeTab === "availability" && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-gray-500 uppercase mb-2">
                Status
              </label>
              <div className="flex gap-4">
                <button
                  onClick={() => setAvailability({ ...availability, isAvailable: true })}
                  className={`flex-1 px-4 py-3 font-mono font-bold border-2 border-black transition-colors ${
                    availability.isAvailable
                      ? "bg-green-500 text-white"
                      : "bg-white text-black hover:bg-gray-100"
                  }`}
                >
                  AVAILABLE
                </button>
                <button
                  onClick={() => setAvailability({ ...availability, isAvailable: false })}
                  className={`flex-1 px-4 py-3 font-mono font-bold border-2 border-black transition-colors ${
                    !availability.isAvailable
                      ? "bg-red-500 text-white"
                      : "bg-white text-black hover:bg-gray-100"
                  }`}
                >
                  UNAVAILABLE
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-500 uppercase mb-1">
                Status Text
              </label>
              <input
                type="text"
                value={availability.message}
                onChange={(e) => setAvailability({ ...availability, message: e.target.value })}
                className="w-full px-3 py-2 border-2 border-black font-mono focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Available for new projects"
              />
            </div>
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="p-6 border-t-2 border-black flex justify-end">
        <button
          onClick={handleSave}
          disabled={isPending}
          className={`flex items-center gap-2 px-6 py-3 font-mono font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all ${
            saveStatus === "saved"
              ? "bg-green-500 text-white"
              : saveStatus === "error"
              ? "bg-red-500 text-white"
              : "bg-black text-white hover:bg-white hover:text-black hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          }`}
        >
          {saveStatus === "saving" ? (
            <>
              <span className="animate-spin">⟳</span>
              SAVING...
            </>
          ) : saveStatus === "saved" ? (
            <>
              <Check size={18} />
              SAVED
            </>
          ) : saveStatus === "error" ? (
            <>
              <X size={18} />
              ERROR
            </>
          ) : (
            <>
              <Save size={18} />
              SAVE CHANGES
            </>
          )}
        </button>
      </div>
    </div>
  );
}
