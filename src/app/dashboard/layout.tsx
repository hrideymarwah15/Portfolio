import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardNav from "@/components/dashboard/DashboardNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/auth/signin?callbackUrl=/dashboard");
  }
  
  // Restrict dashboard to owner only
  const OWNER_EMAIL = "hrideymarwah2907@gmail.com";
  if (user.email !== OWNER_EMAIL) {
    redirect("/auth/error?error=Unauthorized");
  }
  
  // Get profile data
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, email, full_name, avatar_url")
    .eq("id", user.id)
    .single();

  const userData = {
    name: profile?.full_name || user.email?.split("@")[0] || "Admin",
    email: profile?.email || user.email,
    image: profile?.avatar_url,
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Grid Background */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }}
      />
      
      <div className="relative z-10 flex">
        <DashboardNav user={userData} />
        <main className="flex-1 ml-64 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
