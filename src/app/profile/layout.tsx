"use client";

import React from "react";
import logo from "../../../public/icons/Logo.svg";
import Image from "next/image";
import Link from "next/link";
import { LogoutButton } from "@/components/auth/LogoutButton";
import Navbar from "@/components/layout/Navbar";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col mx-auto min-h-screen container">
      <div className="px-8 lg:px-16 py-6">
        <Navbar isPagination={false} />
      </div>
      <main>{children}</main>
    </div>
  );
}
