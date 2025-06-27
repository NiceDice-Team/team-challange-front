"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type InputPros = {
  className?: string;
  label?: string;
  labelStyle?: string;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  error?: string[];
  id?: string;
};

export const CustomInput: React.FC<InputPros> = ({
  className = "",
  type = "text",
  placeholder = "",
  label,
  labelStyle,
  error,
  id,
  ...props
}) => {
  return (
    <div className="w-full flex flex-col gap-2">
      {label && (
        <label
          className={cn("uppercase text-base font-normal", labelStyle)}
          htmlFor={id}
        >
          {label}
        </label>
      )}
      <Input
        type={type}
        placeholder={placeholder}
        id={id}
        className={cn(
          "w-full h-12 md:flex-1 px-4 py-padding-12 bg-white text-purple border-black rounded-none outline-none  placeholder:text-placeholder",
          "focus:outline-none focus-visible:otline-none focus-visible:ring-0 focus-visible:shadow-none ",
          error && "border-red-500 focus:ring-red-500",
          className
        )}
        {...props}
      />
      {error &&
        error.map((err, index) => (
          <p key={index} className="text-red-500 text-sm">
            {err}
          </p>
        ))}
    </div>
  );
};
