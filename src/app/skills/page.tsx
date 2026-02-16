import { getSkills } from "@/lib/db";
import SkillsPageClient from "./SkillsPageClient";
import PageTransition from "@/components/PageTransition";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "Skills | Hridey Marwah",
    description: "Technical skills and tools I work with.",
};

export default async function SkillsPage() {
    const skills = await getSkills();

    return (
        <PageTransition>
            <SkillsPageClient skills={skills} />
        </PageTransition>
    );
}
