"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const CustomInput = ({ className, error, ...props }) => {
  return (
    <Input
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
