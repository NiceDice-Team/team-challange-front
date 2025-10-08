import { Info } from "lucide-react";
import { useEffect, useState } from "react";
import { CountryDropdown } from "react-country-region-selector";
import { cn } from "@/lib/utils";

interface CountrySelectWithSearchProps {
  error?: string[];
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  name?: string;
}

const CountrySelectWithSearch = ({
  error,
  value,
  onChange,
  onBlur,
  name,
}: CountrySelectWithSearchProps) => {
  const [country, setCountry] = useState(value || "");

  useEffect(() => {
    if (value !== undefined) {
      setCountry(value);
    }
  }, [value]);

  const handleChange = (val: string) => {
    setCountry(val);
    onChange?.(val);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    onBlur?.(e);
    return null;
  };

  return (
    <>
      <p className="font-normal text-base uppercase">Country/region</p>
      <CountryDropdown
        value={country}
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

export default CountrySelectWithSearch;
