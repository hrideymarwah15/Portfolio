import {
    getSkills,
    getVisibleProjects,
} from "@/lib/db";
import WorkPageClient from "./WorkPageClient";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "Work | Hridey Marwah",
    description: "My skills, projects, and coding activity.",
};

export default async function WorkPage() {
    const [skills, projects] = await Promise.all([
        getSkills(),
        getVisibleProjects(),
    ]);

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
        <WorkPageClient
            skills={skills}
            projects={projectsData}
            githubUsername="hrideymarwah15"
            leetcodeUsername="Hridey15"
        />
    );
}
