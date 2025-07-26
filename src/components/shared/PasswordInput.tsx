"use client";

import { FC, useState } from "react";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, Info } from "lucide-react";

interface PasswordProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  label?: string;
  labelStyle?: string;
  placeholder?: string;
  id: string;
  error?: string[];
  hideToggle?: boolean;
  name?: string;
}

export const PasswordInput: FC<PasswordProps> = ({
  label,
  labelStyle,
  id,
  name,
  placeholder = "",
  error,
  className,
  hideToggle = false,
  ...rest
}) => {
  const [visible, setVisible] = useState(hideToggle);
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
      <div
        className={cn(
          "relative",
          error && error.length > 0 && "border-4 border-error-border"
        )}
      >
        <Input
          type={visible && !hideToggle ? "text" : "password"}
          id={id}
          placeholder={placeholder}
          name={name}
          autoComplete="off"
          className={cn(
            "w-full h-12 md:flex-1 px-4 py-padding-12 bg-white text-purple border-black rounded-none outline-none  placeholder:text-placeholder",
            "focus:outline-none focus-visible:otline-none focus-visible:ring-0 focus-visible:shadow-none ",
            error &&
              "border-error focus:ring-red-500 focus-visible:ring-red-500",
            className
          )}
          {...rest}
        />

        {!hideToggle && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center px-4  hover:border-transparent focus:outline-0 focus-visible:outline-0"
            onClick={() => setVisible(!visible)}
            tabIndex={-1}
            aria-label={visible ? "Hide password" : "Show password"}
          >
            {visible ? (
              <EyeOff size={24} className={cn({ "text-error": error })} />
            ) : (
              <Eye size={24} className={cn({ "text-error": error })} />
            )}
          </button>
        )}
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
