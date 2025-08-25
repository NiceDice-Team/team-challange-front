"use client";

import { LogOut } from "lucide-react";
import { useTransition } from "react";
import { logoutAction } from "@/app/actions/logout";
import { useAuthStore } from "@/store/auth";
import { useUserStore } from "@/store/user";
import { CustomButton } from "@/components/shared/CustomButton";
import { clearTokens as clearTokensFromCookies } from "@/lib/tokenManager";

interface LogoutButtonProps {
  className?: string;
  styleType?: "linkButton" | "whiteButton";
  showIcon?: boolean;
  showText?: boolean;
}

export function LogoutButton({
  showIcon = true,
  showText = true,
}: LogoutButtonProps) {
  const [isPending, startTransition] = useTransition();
  const { clearTokens } = useAuthStore();
  const { clearAllUserData } = useUserStore();

  const handleLogout = () => {
    startTransition(async () => {
      try {
        clearTokens();
        clearTokensFromCookies();
        clearAllUserData();
        await logoutAction();
      } catch (error) {
        console.error("Error during logout:", error);
      }
    });
  };

  return (
    <CustomButton
      className={`flex justify-center items-center gap-2 bg-white p-0 text-purple border-0 hover:text-gray-900 text-sm normal-case shadow-0 no-underline`}
      onClick={handleLogout}
      disabled={isPending}
      styleType="linkButton"
      loading={isPending}
    >
      {!isPending && showIcon && <LogOut className="w-4 h-4" />}
      {showText && (isPending ? "Log out..." : "Log out")}
    </CustomButton>
  );
}
