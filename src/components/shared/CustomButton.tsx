"use client";

import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { FC } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  loading?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  styleType?: "linkButton" | "whiteButton" | "productCart" | "wishlist" | "navigation";
}

export const CustomButton: FC<ButtonProps> = ({
  children,
  styleType,
  className = "",
  loading = false,
  disabled = false,
  ...props
}) => {
  return (
    <Button
      className={cn(
        "w-full h-12 bg-purple text-white py-4 px-8 text-base font-medium uppercase rounded-none hover:bg-light-purple-2 transition-all duration-150 leading-none",
        "disabled:bg-gray-2 disabled:cursor-auto focus-visible:ring-0 focus-visible:outline-none cursor-pointer",
        styleType === "linkButton" &&
          "size-fit text-purple disabled:text-disabled bg-transparent hover:text-light-purple hover:bg-transparent p-0 underline shadow-none",
        styleType === "whiteButton" &&
          "bg-white text-purple shadow-none hover:hover:bg-gray-100 py-4 px-8",
        styleType === "productCart" &&
          "w-full border-2 border-[#494791] bg-transparent text-[#494791] hover:bg-gray-100 py-2 h-10 font-medium transition shadow-none disabled:bg-[#494791]/70 disabled:text-white disabled:cursor-not-allowed",
        styleType === "wishlist" &&
          "w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors shadow-none p-0",
        styleType === "navigation" &&
          "w-20 h-1 transition-colors bg-gray-300 hover:bg-[#494791]/70 p-0 rounded-none shadow-none",
        className
      )}
      disabled={disabled}
      {...props}
    >
      {loading ? "loader" : children}
    </Button>
  );
};
