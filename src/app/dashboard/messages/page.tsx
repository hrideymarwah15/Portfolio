import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import MessagesClient from "./MessagesClient";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
    const supabase = await createClient();

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/auth/login");
    }

    // Verify owner access
    const OWNER_EMAIL = "hrideymarwah2907@gmail.com";
    if (user.email !== OWNER_EMAIL) {
        redirect("/dashboard");
    }

    return <MessagesClient />;
}
