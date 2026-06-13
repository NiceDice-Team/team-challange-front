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

const solidButtonClasses =
  "w-full h-12 border border-purple bg-purple px-8 py-4 text-base font-medium leading-[19px] text-white uppercase rounded-none shadow-none transition-colors duration-150 cursor-pointer hover:border-light-purple-2 hover:bg-light-purple-2 focus:border-light-purple-2 focus:bg-light-purple-2 focus:outline-none focus-visible:border-light-purple-2 focus-visible:bg-light-purple-2 focus-visible:ring-0 focus-visible:outline-none disabled:pointer-events-auto disabled:cursor-not-allowed disabled:border-gray-2 disabled:bg-gray-2 disabled:text-white disabled:opacity-100";

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
        solidButtonClasses,
        styleType === "linkButton" &&
          "size-fit border-0 bg-transparent p-0 text-purple underline shadow-none hover:bg-transparent hover:text-light-purple focus:bg-transparent focus:text-light-purple focus-visible:bg-transparent focus-visible:text-light-purple disabled:bg-transparent disabled:text-disabled",
        styleType === "whiteButton" &&
          "border-purple bg-white text-purple shadow-none hover:bg-gray-100 focus:bg-gray-100 focus-visible:bg-gray-100",
        styleType === "productCart" &&
          "border-purple bg-purple text-white hover:border-light-purple-2 hover:bg-light-purple-2 focus:border-light-purple-2 focus:bg-light-purple-2 focus-visible:border-light-purple-2 focus-visible:bg-light-purple-2 disabled:border-gray-2 disabled:bg-gray-2 disabled:text-white",
        styleType === "wishlist" &&
          "w-8 h-8 border-0 bg-white rounded-full flex items-center justify-center hover:bg-gray-50 focus:bg-gray-50 focus-visible:bg-gray-50 transition-colors shadow-none p-0 disabled:bg-white disabled:opacity-50",
        styleType === "navigation" &&
          "w-20 h-1 border-0 transition-colors bg-gray-300 hover:bg-[#494791]/70 focus:bg-[#494791]/70 focus-visible:bg-[#494791]/70 p-0 rounded-none shadow-none disabled:bg-gray-300 disabled:opacity-50",
        className
      )}
      disabled={disabled}
      {...props}
    >
      {loading ? "loader" : children}
    </Button>
  );
};
