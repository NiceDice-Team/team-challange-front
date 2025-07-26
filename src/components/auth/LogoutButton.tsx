"use client";

import { LogOut } from "lucide-react";
import { useTransition } from "react";
import { logoutAction } from "@/app/actions/logout";
import { useAuthStore } from "@/store/auth";
import { useUserStore } from "@/store/user";
import { CustomButton } from "@/components/shared/CustomButton";

interface LogoutButtonProps {
  className?: string;
  styleType?: "linkButton" | "whiteButton";
  showIcon?: boolean;
  showText?: boolean;
}

export function LogoutButton({
  className = "",
  styleType,
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
        clearAllUserData();
        await logoutAction();
      } catch (error) {
        console.error("Error during logout:", error);
      }
    });
  };

  return (
    <CustomButton
      className={`flex justify-center items-center gap-2 ${className}`}
      onClick={handleLogout}
      disabled={isPending}
      styleType={styleType}
      loading={isPending}
    >
      {!isPending && showIcon && <LogOut className="w-4 h-4" />}
      {showText && (isPending ? "Выход..." : "Выйти")}
    </CustomButton>
  );
}
