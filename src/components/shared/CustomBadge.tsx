import React from "react";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import { OrderStatus } from "@/lib/definitions";

const orderStatusStyles: Record<OrderStatus, string> = {
  pending: "bg-[#FEF3C7] text-[#B45309] border border-[#F59E0B]",
  processing: "bg-[#DBEAFE] text-[#1D4ED8] border border-[#3B82F6]",
  shipped: "bg-[#E0E7FF] text-[#4338CA] border border-[#6366F1]",
  delivered: "bg-[#F3F0FF] text-[#5B4AE6] border border-[#7C6CF0]",
  cancelled: "bg-[#FEE2E2] text-[#B91C1C] border border-[#EF4444]",
};

interface CustomBadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: "secondary" | "destructive" | "outline" | "default";
  status?: OrderStatus;
}

const CustomBadge = ({
  children,
  className = "",
  variant = "default",
  status,
}: CustomBadgeProps) => {
  return (
    <Badge
      className={cn(
        "py-1 px-3 rounded-[20px] tabular-nums font-medium",
        status
          ? orderStatusStyles[status]
          : variant === "default" && "bg-purple text-white",
        !status && variant === "secondary" && "bg-light-purple text-white",
        !status && variant === "destructive" && "bg-red text-white",
        !status &&
          variant === "outline" &&
          "bg-white border border-purple text-purple",
        className
      )}
      variant={status ? "outline" : variant}
    >
      {children}
    </Badge>
  );
};

export default CustomBadge;
