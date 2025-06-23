"use client";

import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

export const CustomButton = ({ className, ...props }) => {
  return (
    <Button
      className={cn(
        "w-full bg-white text-purple py-4 px-8text-lg text-base font-medium uppercase rounded-none hover:hover:bg-gray-100 transition-all duration-150",
        className
      )}
      {...props}
    />
  );
};
