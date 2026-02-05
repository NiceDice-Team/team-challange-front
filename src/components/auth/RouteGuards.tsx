"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/tokenManager";

interface RouteGuardProps {
  children: React.ReactNode;
}

/**
 * Protected route guard component
 * Redirects to login page if user is not authenticated
 */
export function ProtectedRoute({ children }: RouteGuardProps): React.ReactElement {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = (): void => {
      if (!isAuthenticated()) {
        const currentPath = window.location.pathname + window.location.search;
        const loginUrl = `/login?returnUrl=${encodeURIComponent(currentPath)}`;
        router.push(loginUrl);
      }
    };

    checkAuth();
  }, [router]);

  if (!isAuthenticated()) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="border-purple border-b-2 rounded-full w-8 h-8 animate-spin"></div>
      </div>
    );
  }

  return <>{children}</>;
}

/**
 * Public route guard component
 * Redirects to home or returnUrl if user is already authenticated
 */
export function PublicRoute({ children }: RouteGuardProps): React.ReactElement {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = (): void => {
      const authenticated = isAuthenticated();
      if (authenticated) {
        const urlParams = new URLSearchParams(window.location.search);
        const returnUrl = urlParams.get("returnUrl");

        if (returnUrl) {
          router.push(decodeURIComponent(returnUrl));
        } else {
          router.push("/");
        }
      } else {
        setIsChecking(false);
      }
    };

    const timeout = setTimeout(() => {
      checkAuth();
    }, 100);

    return () => clearTimeout(timeout);
  }, [router]);

  if (isChecking) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="border-purple border-b-2 rounded-full w-8 h-8 animate-spin"></div>
      </div>
    );
  }

  return <>{children}</>;
}
