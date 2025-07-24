"use client";

import { useUserStore } from "@/store/user";
import React from "react";

export default function ProfilePage() {
  const user = useUserStore((state) => state.userData);

  return (
    <div className="py-8 min-h-screen">
      <div className="text-title uppercase">Welcome, {user?.first_name}!</div>
    </div>
  );
}
