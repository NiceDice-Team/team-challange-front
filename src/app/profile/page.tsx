"use client";

import { useUserStore } from "@/store/user";
import React from "react";
import { ProtectedRoute } from "@/components/auth/RouteGuards";

function ProfileContent() {
  const user = useUserStore((state) => state.userData);

  return (
    <div className="py-8 min-h-screen">
      <div className="text-title uppercase">Welcome, {user?.first_name}!</div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
