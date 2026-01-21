"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/tokenManager";

export function ProtectedRoute({ children }) {
  const router = useRouter();
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    const authenticated = isAuthenticated();

    if (!authenticated) {
      const currentPath =
        window.location.pathname + window.location.search;
      router.replace(
        `/login?returnUrl=${encodeURIComponent(currentPath)}`
      );
      return;
    }

    setAllowed(true);
  }, [router]);

  if (allowed === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-b-2 rounded-full border-purple animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}


export function PublicRoute({ children }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const authenticated = isAuthenticated();

    if (authenticated) {
      const params = new URLSearchParams(window.location.search);
      const returnUrl = params.get("returnUrl");
      router.replace(returnUrl ? decodeURIComponent(returnUrl) : "/");
      return;
    }

    setReady(true);
  }, [router]);

  if (!ready) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-b-2 rounded-full border-purple animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
