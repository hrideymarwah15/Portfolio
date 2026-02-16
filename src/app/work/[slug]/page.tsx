
import { projectsService } from "@/lib/server/services/projects.service";
import CaseStudyClient from "./CaseStudyClient";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const projects = await projectsService.getVisible();
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  // Await params here (Next.js 15+ requirement, good practice generally)
  const { slug } = await params;
  const project = await projectsService.getBySlug(slug);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: `${project.title} | Case Study`,
    description: project.description,
  };
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
   const { slug } = await params;
  const project = await projectsService.getBySlug(slug);

  if (!project) {
    notFound();
  }

  return <CaseStudyClient project={project} />;
}
