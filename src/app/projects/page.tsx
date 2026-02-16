import { getVisibleProjects } from "@/lib/db";
import ProjectsPageClient from "./ProjectsPageClient";
import PageTransition from "@/components/PageTransition";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "Projects | Hridey Marwah",
    description: "Featured projects and work samples.",
};

export default async function ProjectsPage() {
    const projects = await getVisibleProjects();

    const projectsData = projects.map((p) => ({
        id: p.id,
        title: p.title,
        problem: p.problem,
        outcome: p.outcome,
        tag: p.tag,
        tagColor: p.tagColor,
        link: p.link,
        githubRepo: p.githubRepo,
        githubStars: p.githubStars,
    }));

    return (
        <PageTransition>
            <ProjectsPageClient projects={projectsData} />
        </PageTransition>
    );
}
