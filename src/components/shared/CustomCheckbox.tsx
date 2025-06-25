import React, { FC } from "react";
import { Checkbox } from "../ui/checkbox";
import { cn } from "@/lib/utils";
import { Label } from "../ui/label";

interface CheckboxProps {
  label?: React.ReactNode;
  id: string;
  disabled?: boolean;
  className?: string;
  error?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  children?: React.ReactNode;
}

const CustomCheckbox: FC<CheckboxProps> = ({
  label = "",
  id,
  disabled,
  className,
  error,
  checked,
  onCheckedChange,
  children,
  ...rest
}) => {
  return (
    <div className="flex gap-2 ">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        className={cn(
          "w-6 h-6 rounded-none border-purple cursor-pointer  ",
          "data-[state=checked]:bg-purple data-[state=checked]:border-purple focus:outline-none focus-visible:outline-none focus-visible:ring-0",
          { "border-error": error },
          className
        )}
        {...rest}
      />
      {label && (
        <Label className="text-base font-normal cursor-pointer" htmlFor={id}>
          {label}
        </Label>
      )}
    </div>
  );
};

export default CustomCheckbox;
