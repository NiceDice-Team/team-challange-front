"use client";

import React from "react";
import { LogoutButton } from "@/components/auth/LogoutButton";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex flex-col mx-auto min-h-screen container">
        <div className="px-8 lg:px-16 py-6">
          <Navbar isPagination={false} />
        </div>
        <LogoutButton
          className="bg-white hover:bg-gray-50 border border-purple w-[116px] text-purple hover:text-gray-900"
          showText={true}
          showIcon={true}
        />
        <main>{children}</main>
        <Footer />
      </div>
      
    </>
  );
}
