import { useEffect, useState } from "react";
import { CustomSelectWithSearch } from "../shared/CustomSelectWithSearch";

type Country = {
  label: string;
  value: string;
};

const CountrySelectWithSearch = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(
      "https://valid.layercode.workers.dev/list/countries?format=select&flags=true&value=code"
    )
      .then((response) => response.json())
      .then((data) => {
        setCountries(data.countries);
        setSelectedCountry(data.userSelectValue);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching countries:", error);
        setIsLoading(false);
      });
  }, []);

  return (
    <>
      <p className="font-normal text-base uppercase">Country/region</p>
      <CustomSelectWithSearch
        options={countries}
        value={selectedCountry}
        onValueChange={(value) => setSelectedCountry(value)}
        className="border-black w-full h-[48px] text-black"
        placeholder={isLoading ? "Loading countries..." : "Select a country"}
        searchPlaceholder="Search countries..."
        disabled={isLoading}
        loading={isLoading}
        loadingText="Loading countries..."
        clearable={true}
        noOptionsText="No countries available"
      />
    </>
  );
};

export default CountrySelectWithSearch;
