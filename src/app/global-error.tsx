"use client";

import Link from "next/link";
import { useEffect } from "react";

interface GlobalErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalErrorPage({
  error,
  reset,
}: GlobalErrorPageProps): React.ReactElement {
  const isProduction = process.env.NODE_ENV === "production";

  useEffect(() => {
    if (!isProduction) {
      console.error(error);
    }
  }, [error, isProduction]);

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center gap-6 bg-white px-4 py-16 text-center font-sans text-black antialiased">
        <h1 className="text-4xl font-bold">Something went wrong</h1>
        <p className="max-w-xl text-base text-gray-600">
          {isProduction
            ? "An unexpected error occurred. Please try again or return to the homepage."
            : error.message || "An unexpected error occurred."}
        </p>
        {!isProduction && error.digest && (
          <p className="text-sm text-gray-500">Error digest: {error.digest}</p>
        )}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={reset}
            className="bg-orange-500 px-6 py-3 text-sm uppercase text-white transition-opacity hover:opacity-90"
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-6 py-3 text-sm uppercase text-indigo-700 underline underline-offset-4"
          >
            Go back home
          </Link>
        </div>
      </body>
    </html>
  );
}
