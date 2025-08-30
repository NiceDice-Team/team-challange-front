"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";

type InputPros = {
  className?: string;
  label?: string;
  labelStyle?: string;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  error?: string[];
  id?: string;
  name?: string;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
};

export const CustomInput: React.FC<InputPros> = ({
  className = "",
  type = "text",
  placeholder = "",
  label,
  labelStyle,
  error,
  id,
  name,
  disabled,
  value,
  ...props
}) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label
          className={cn("uppercase text-base font-normal", labelStyle)}
          htmlFor={id}
        >
          {label}
        </label>
      )}
      <div
        className={cn(
          error && error.length > 0 && "border-4 border-error-border"
        )}
      >
        <Input
          type={type}
          placeholder={placeholder}
          id={id}
          name={name}
          disabled={disabled}
          className={cn(
            "w-full h-12 md:flex-1 px-4 py-padding-12 bg-white text-purple border-black rounded-none outline-none  placeholder:text-placeholder",
            "focus:outline-2 focus:outline-purple/40  focus-visible:ring-2 focus-visible:ring-purple/40 focus-visible:shadow-none ",
            error &&
              "border-error focus:ring-red-500 focus-visible:ring-red-500",
            className
          )}
          value={value}
          {...props}
        />
      </div>

      {error &&
        error.map((err, index) => (
          <div className="flex items-center gap-1" key={index}>
            <Info size={16} color="#e30000" />
            <p key={index} className="text-error text-sm">
              {err}
            </p>
          </div>
        ))}
    </div>
  );
};
