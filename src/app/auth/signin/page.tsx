"use client";

import { createClient } from "@/lib/supabase/client";
import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { Github } from "lucide-react";

function SignInContent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const handleGitHubSignIn = async () => {
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(callbackUrl)}`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="max-w-md w-full mx-4">
        <div className="border-2 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h1 className="font-mono font-bold text-3xl mb-2 text-center">
            ADMIN LOGIN
          </h1>
          <p className="text-gray-600 text-center mb-8 font-mono text-sm">
            Sign in to access the dashboard
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-500 text-red-700 font-mono text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleGitHubSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-black text-white font-mono font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-white hover:text-black hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Github size={20} />
            {loading ? "SIGNING IN..." : "SIGN IN WITH GITHUB"}
          </button>

          <p className="mt-6 text-center text-gray-500 font-mono text-xs">
            Only authorized administrators can access the dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="font-mono">Loading...</div>
      </div>
    }>
      <SignInContent />
    </Suspense>
  );
}
