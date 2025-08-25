"use client";

import { useUserStore } from "@/store/user";
import React from "react";
import { ProtectedRoute } from "@/components/auth/RouteGuards";
import ProfileSVG from "@/assets/svg-components/ProfileSVG";
import { CustomButton } from "@/components/shared/CustomButton";
import mail from "@/assets/icons/mail.svg";
import Image from "next/image";
import { CustomBreadcrumb } from "@/components/shared/CustomBreadcrumb";
import { LogoutButton } from "@/components/auth/LogoutButton";

const breadcrumbItems = [
  { label: "Home", href: "/" },
  { label: "My account", current: true },
];

function ProfileContent() {
  const user = useUserStore((state) => state.userData);

  return (
    <div className="py-8 min-h-screen">
      <div className="flex justify-between items-center">
        <CustomBreadcrumb items={breadcrumbItems} />
        <LogoutButton showText={true} showIcon={true} />
      </div>
      <h3 className="mb-4 text-title uppercase">
        Welcome, {user?.first_name}!
      </h3>
      <p>
        🧩 Your account dashboard - manage your profile, track orders, and
        update your preferences
      </p>
      <div className="flex flex-row justify-between items-center gap-6 mt-6">
        <div className="flex flex-col gap-6 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.05)] pb-6 w-1/3">
          <div className="flex flex-col bg-purple p-6 text-white">
            <div className="flex items-center gap-2 text-xl uppercase">
              <ProfileSVG color="white" />
              Your Profile
            </div>
            <div className="text-base">Quick view of your account details</div>
          </div>
          <div className="flex flex-col gap-2 px-7 text-black">
            <p className="text-sm uppercase">NAME</p>
            <p className="text-gray-2">
              {user?.first_name} {user?.last_name}
            </p>
          </div>
          <div className="flex flex-col gap-2 px-7 text-black">
            <p className="text-sm uppercase">EMAIL</p>
            <p className="flex items-center gap-2 text-gray-2">
              <Image src={mail} alt="mail" className="w-5 h-5" />
              {user?.email}
            </p>
          </div>
          <CustomButton>EDIT PROFILE</CustomButton>
          <CustomButton styleType="whiteButton">CHANGE PASSWORD</CustomButton>
        </div>

        <div className="flex flex-col gap-4 w-2/3">ProfileTabs</div>
      </div>
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
