"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

type SelectOption = {
  value: string;
  label: string;
};

type CustomSelectProps = {
  className?: string;
  placeholder?: string;
  options?: SelectOption[];
  value?: string;
  onValueChange?: (value: string) => void;
};

export const CustomSelect: React.FC<CustomSelectProps> = ({
  className,
  placeholder = "Select an option",
  options = [],
  value,
  onValueChange,
}) => {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger
        className={cn(
          "h-10 border-[var(--color-light-purple-2)] text-[var(--color-purple)] text-base rounded-none focus:outline-none",
          className
        )}
      >
        <SelectValue placeholder={placeholder} className="font-normal text-base" />
      </SelectTrigger>
      <SelectContent className="border-[1px] border-[var(--color-light-purple-2)] p-2 rounded-none min-w-[176px]">
        {options.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className="h-9 hover:bg-[var(--color-light-purple-3)] focus:bg-[var(--color-light-purple-3)] data-[state=checked]:bg-[var(--color-light-purple-3)] text-black text-base rounded-none cursor-pointer"
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
