import React from "react";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";

interface CustomBadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: "secondary" | "destructive" | "outline" | "default";
}

const CustomBadge = ({
  children,
  className = "",
  variant = "default",
}: CustomBadgeProps) => {
  return (
    <Badge
      className={cn(
        "py-1 px-3 rounded-[20px] tabular-nums",
        variant === "default" && "bg-purple text-white",
        variant === "secondary" && "bg-light-purple text-white",
        variant === "destructive" && "bg-red text-white",
        variant === "outline" && "bg-white border border-purple text-purple"
      )}
      variant={variant}
    >
      {children}
    </Badge>
  );
};

export default CustomBadge;
