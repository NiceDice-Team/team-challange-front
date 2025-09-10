import { Info } from "lucide-react";
import { useEffect, useState } from "react";
import { CountryDropdown } from "react-country-region-selector";
import { cn } from "@/lib/utils";

const CountrySelectWithSearch = ({ error }: { error: any }) => {
  const [country, setCountry] = useState("");

  return (
    <>
      <p className="font-normal text-base uppercase">Country/region</p>
      <CountryDropdown
        value={country}
        onChange={(val) => setCountry(val)}
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
