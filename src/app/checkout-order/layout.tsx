"use client";

import React from "react";
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
          <Navbar />
        </div>

        <main>{children}</main>
        <Footer />
      </div>
    </>
  );
}
