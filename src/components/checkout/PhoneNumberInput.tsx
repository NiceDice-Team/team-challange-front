"use client";

import { cn } from "@/lib/utils";
import { Info } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import "react-phone-number-input/style.css";

const PhoneInput = dynamic(() => import("react-phone-number-input"), {
  ssr: false,
});

interface PhoneNumberInputProps {
  error?: string[];
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  name?: string;
}

const PhoneNumberInput = ({
  error,
  value,
  onChange,
  onBlur,
  name,
}: PhoneNumberInputProps) => {
  const [phone, setPhone] = useState(value || "");

  useEffect(() => {
    if (value !== undefined) {
      setPhone(value);
    }
  }, [value]);

  const handleChange = (phoneValue: string | undefined) => {
    const phoneStr = phoneValue || "";
    setPhone(phoneStr);
    onChange?.(phoneStr);
  };

  const handleBlur = () => {
    onBlur?.();
  };

  return (
    <>
      <p className="font-normal text-base uppercase">Phone number</p>
      <PhoneInput
        country={"us"}
        defaultCountry="US"
        value={phone}
        limitMaxLength={true}
        onChange={handleChange}
        onBlur={handleBlur}
        name={name}
        className={cn(
          "px-4 border-1 border-black focus-visible:outline-none w-full h-[48px] text-black",
          error && "border-error focus:ring-red-500 focus-visible:ring-red-500"
        )}
      />
      {error &&
        error.map((err, index) => (
          <div className="flex items-center gap-1" key={index}>
            <Info size={16} color="#e30000" />
            <p key={index} className="text-error text-sm">
              {err}
            </p>
          </div>
        ))}
    </>
  );
};

export default PhoneNumberInput;
