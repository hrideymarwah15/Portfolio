import {
  getHero,
  getAbout,
  getContact,
  getMeta,
  getSkills,
  getAvailability,
  getVisibleProjects,
} from "@/lib/db";
import HomeClient from "@/components/HomeClient";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [hero, about, contact, meta, skills, availability, projects] =
    await Promise.all([
      getHero(),
      getAbout(),
      getContact(),
      getMeta(),
      getSkills(),
      getAvailability(),
      getVisibleProjects(),
    ]);

  const siteData = {
    hero,
    about,
    contact,
    meta,
    skills,
    availability: availability
      ? { isAvailable: availability.isAvailable, message: availability.message }
      : { isAvailable: true, message: "Available for new opportunities" },
    projects: projects.map((p) => ({
      id: p.id,
      title: p.title,
      problem: p.problem,
      outcome: p.outcome,
      tag: p.tag,
      tagColor: p.tagColor,
      link: p.link,
      githubRepo: p.githubRepo,
      githubStars: p.githubStars,
    })),
  };

  return <HomeClient data={siteData} />;
}
