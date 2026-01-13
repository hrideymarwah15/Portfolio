"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { Suspense } from "react";

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const errorMessages: Record<string, string> = {
    AccessDenied: "You do not have permission to access the dashboard. Only administrators can sign in.",
    AuthError: "There was an error during authentication. Please try again.",
    Default: "An unexpected error occurred. Please try again.",
  };

  const message = errorMessages[error || "Default"] || errorMessages.Default;

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="max-w-md w-full mx-4">
        <div className="border-2 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full border-2 border-red-500 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
          </div>

          <h1 className="font-mono font-bold text-2xl mb-4 text-center">
            AUTHENTICATION ERROR
          </h1>

          <p className="text-gray-600 text-center mb-8 font-mono text-sm">
            {message}
          </p>

          <div className="flex gap-4">
            <Link
              href="/"
              className="flex-1 text-center px-6 py-3 border-2 border-black font-mono font-bold hover:bg-gray-100 transition-colors"
            >
              HOME
            </Link>
            <Link
              href="/auth/signin"
              className="flex-1 text-center px-6 py-3 bg-black text-white font-mono font-bold border-2 border-black hover:bg-gray-800 transition-colors"
            >
              TRY AGAIN
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="font-mono">Loading...</div>
      </div>
    }>
      <ErrorContent />
    </Suspense>
  );
}
