"use client";

import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileFooter from "@/components/layout/MobileFooter";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex flex-col mx-auto min-h-screen container">
        <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-6">
          <Navbar />
        </div>

        <main>{children}</main>
        <div className="hidden sm:block">
          <Footer />
        </div>
        <MobileFooter />
      </div>
    </>
  );
}
