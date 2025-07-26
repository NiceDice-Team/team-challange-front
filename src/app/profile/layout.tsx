"use client";

import React from "react";
import logo from "../../../public/icons/Logo.svg";
import Image from "next/image";
import Link from "next/link";
import { LogoutButton } from "@/components/auth/LogoutButton";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col mx-auto min-h-screen container">
      <div className="flex flex-row justify-between items-center shadow-header px-8 lg:px-16 py-6">
        <Link href="/">
          <Image src={logo} alt="logo" />
        </Link>
        <LogoutButton
          className="bg-white hover:bg-gray-50 border border-purple w-[116px] text-purple hover:text-gray-900"
          showText={true}
          showIcon={true}
        />
      </div>
      <main>{children}</main>
    </div>
  );
}
