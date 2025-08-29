"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { CheckmarkIcon } from "@/svgs/icons";

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
          <CheckmarkIcon />
        </SelectPrimitive.ItemIndicator>
      </span>

      <div className="">
        <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      </div>
    </SelectPrimitive.Item>
  );
}

export { Select, SelectValue, SelectTrigger, SelectContent, SelectItem };
