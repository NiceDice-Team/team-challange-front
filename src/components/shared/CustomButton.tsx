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
  styleType?: "linkButton" | "whiteButton";
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
          "bg-white text-purple shadow-none hover:hover:bg-gray-100 py-4 px-8 border border-purple",
        className
      )}
      disabled={disabled}
      {...props}
    >
      {loading ? "loader" : children}
    </Button>
  );
};
