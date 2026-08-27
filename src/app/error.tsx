"use client";

import Link from "next/link";
import { useEffect } from "react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({
  error,
  reset,
}: ErrorPageProps): React.ReactElement {
  const isProduction = process.env.NODE_ENV === "production";

  useEffect(() => {
    if (!isProduction) {
      console.error(error);
    }
  }, [error, isProduction]);

  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 py-16 text-center">
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
          className="bg-[var(--color-orange)] px-6 py-3 text-sm uppercase text-white transition-opacity hover:opacity-90"
        >
          Try again
        </button>
        <Link
          href="/"
          className="px-6 py-3 text-sm uppercase text-[var(--color-purple)] underline underline-offset-4"
        >
          Go back home
        </Link>
      </div>
    </section>
  );
}
