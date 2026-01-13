import { getAllProjects } from "@/lib/db";
import ProjectsManager from "@/components/dashboard/ProjectsManager";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projects = await getAllProjects();

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-mono font-bold text-3xl mb-2">Projects</h1>
        <p className="text-gray-600">Manage your portfolio projects. Link GitHub repos for automatic updates.</p>
      </div>

      <ProjectsManager initialProjects={projects} />
    </div>
  );
}
