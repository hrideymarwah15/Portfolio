import { NextResponse } from "next/server";
import {
  getHero,
  getAbout,
  getContact,
  getMeta,
  getSkills,
  getAvailability,
  getVisibleProjects,
} from "@/lib/db";

// Public API to get site data (for SSR/ISR)
export async function GET() {
  try {
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

    const data = {
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
      })),
    };
    
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("Error fetching site data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
