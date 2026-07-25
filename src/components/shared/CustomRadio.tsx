import type { ChangeEventHandler, ReactNode } from "react";

interface RadioButtonProps {
  id: string;
  name: string;
  value: string;
  checked?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  children?: ReactNode;
  className?: string;
}

export const RadioButton = ({
  id,
  name,
  value,
  checked,
  onChange,
  children,
  className = "",
}: RadioButtonProps) => {
  return (
    <label
      className={`flex items-center cursor-pointer ${className}`}
    >
      <div className="relative">
        <input
          type="radio"
          id={id}
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          className="sr-only"
        />
        <div
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
            checked ? "border-purple bg-white" : "border-purple bg-white"
          }`}
        >
          {checked && <div className="bg-purple rounded-full w-3 h-3"></div>}
        </div>
      </div>
      <div className="flex-1">{children}</div>
    </label>
  );
};
