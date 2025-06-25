"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type InputPros = {
  className?: string;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  error?: boolean;
};

export const CustomInput = ({
  className = "",
  type = "text",
  placeholder = "",
  error,
  ...props
}: InputPros) => {
  return (
    <Input
      type={type}
      placeholder={placeholder}
      className={cn(
        "w-full h-12 md:flex-1 p-4 bg-white text-purple rounded-none outline-none focus:outline-none focus-visible:otline-none placeholder:text-placeholder",
        "focus-visible:ring-0 focus-visible:shadow-none focus-visible:border-0",
        error && "border-red-500 focus:ring-red-500",
        className
      )}
      {...props}
    />
  );
};
