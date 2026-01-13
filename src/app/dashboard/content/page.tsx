import { getHero, getAbout, getContact, getMeta, getSkills, getAvailability } from "@/lib/db";
import ContentEditor from "@/components/dashboard/ContentEditor";

export const dynamic = "force-dynamic";

export default async function ContentPage() {
  const [hero, about, contact, meta, skills, availability] = await Promise.all([
    getHero(),
    getAbout(),
    getContact(),
    getMeta(),
    getSkills(),
    getAvailability(),
  ]);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-mono font-bold text-3xl mb-2">Content Management</h1>
        <p className="text-gray-600">Edit your site content. Changes are saved to the database and reflected immediately.</p>
      </div>

      <ContentEditor
        initialHero={hero}
        initialAbout={about}
        initialContact={contact}
        initialMeta={meta}
        initialSkills={skills}
        initialAvailability={{
          isAvailable: availability?.isAvailable ?? true,
          message: availability?.message ?? "Available for new opportunities",
        }}
      />
    </div>
  );
}
