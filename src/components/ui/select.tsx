"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const Select = SelectPrimitive.Root;
const SelectValue = SelectPrimitive.Value;

// Trigger button with dropdown arrow
function SelectTrigger({ className, children, ...props }: React.ComponentProps<typeof SelectPrimitive.Trigger>) {
  return (
    <SelectPrimitive.Trigger
      className={cn(
        "flex h-10 w-fit min-w-[176px] items-center justify-between rounded-md border px-3 py-2 text-sm whitespace-nowrap",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="h-4 w-4 ml-10 text-[var(--color-purple)] shrink-0" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

// Dropdown content container
function SelectContent({ className, children, ...props }: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        className={cn("relative z-50 overflow-hidden rounded-md border bg-popover shadow-lg", className)}
        position="popper"
        side="bottom"
        align="start"
        sideOffset={8}
        {...props}
      >
        <SelectPrimitive.Viewport className="">{children}</SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

// Individual option item with custom checkmark
function SelectItem({ className, children, ...props }: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      className={cn(
        "relative flex gap-1 w-full cursor-default select-none items-center px-1 py-2 text-sm outline-none",
        className
      )}
      {...props}
    >
      <span className="flex h-4 w-4 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <svg width="12" height="8" viewBox="0 0 12 8" fill="var(--color-purple)">
            <path
              d="M4.36646 6.1L10.0165 0.45C10.1498 0.316667 10.3054 0.25 10.4831 0.25C10.6609 0.25 10.8165 0.316667 10.9498 0.45C11.0831 0.583333 11.1498 0.741778 11.1498 0.925333C11.1498 1.10889 11.0831 1.26711 10.9498 1.4L4.83313 7.53333C4.69979 7.66667 4.54424 7.73333 4.36646 7.73333C4.18868 7.73333 4.03313 7.66667 3.8998 7.53333L1.03313 4.66667C0.899795 4.53333 0.835795 4.37511 0.841128 4.192C0.846461 4.00889 0.916017 3.85044 1.04979 3.71667C1.18357 3.58289 1.34202 3.51622 1.52513 3.51667C1.70824 3.51711 1.86646 3.58378 1.99979 3.71667L4.36646 6.1Z"
              fill="var(--color-purple)"
            />
          </svg>
        </SelectPrimitive.ItemIndicator>
      </span>

      <div className="">
        <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      </div>
    </SelectPrimitive.Item>
  );
}

export { Select, SelectValue, SelectTrigger, SelectContent, SelectItem };
