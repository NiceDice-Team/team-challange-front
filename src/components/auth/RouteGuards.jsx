"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/tokenManager";

export function ProtectedRoute({ children }) {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
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


export function PublicRoute({ children }) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      if (authenticated) {
        const urlParams = new URLSearchParams(window.location.search);
        const returnUrl = urlParams.get('returnUrl');
        
        if (returnUrl) {
          router.push(decodeURIComponent(returnUrl));
        } else {
          router.push('/');
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
