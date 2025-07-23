"use client";

import { useUserStore } from "@/store/user";
import React from "react";

export default function ProfilePage() {
  const user = useUserStore((state) => state.userData);

  return (
    <div className="bg-gray-50 py-8 min-h-screen">
      <p>{user?.first_name}</p>
    </div>
  );
}
