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
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label
          className={cn("font-normal text-base uppercase", labelStyle)}
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
            "md:flex-1 bg-white px-4 py-padding-12 border-black rounded-none outline-none w-full h-12 text-purple placeholder:text-placeholder",
            "focus:outline-none focus-visible:otline-none focus-visible:ring-0 focus-visible:shadow-none ",
            error &&
              error.length > 0 &&
              "border-error focus:ring-red-500 focus-visible:ring-red-500",
            className
          )}
          {...rest}
        />

        {!hideToggle && (
          <button
            type="button"
            className="right-0 absolute inset-y-0 flex items-center px-4 hover:border-transparent focus-visible:outline-0 focus:outline-0"
            onClick={() => setVisible(!visible)}
            tabIndex={-1}
            aria-label={visible ? "Hide password" : "Show password"}
          >
            {visible ? (
              <EyeOff
                size={24}
                className={cn({ "text-error": error.length > 0 })}
              />
            ) : (
              <Eye size={24} className={cn({ "text-error": error.length > 0 })} />
            )}
          </button>
        )}
      </div>

      {error &&
        error.length > 0 &&
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
