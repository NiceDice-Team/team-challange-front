import Navbar from "@/components/layout/Navbar";
import React from "react";
import logo from "../../../public/icons/Logo.svg";
import Image from "next/image";
import { CustomButton } from "@/components/shared/CustomButton";
import { LogOut } from "lucide-react";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-row justify-between items-center px-8 lg:px-16 py-6">
        <Image src={logo} alt="logo" />
        <CustomButton className="flex justify-center items-center gap-3 bg-white hover:bg-gray-50 border border-purple w-[116px] text-purple hover:text-gray-900">
          <LogOut />
          log out
        </CustomButton>
      </div>
      <main>{children}</main>
    </div>
  );
}
