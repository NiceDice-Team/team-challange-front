"use client";

export interface PriceRangeInputsProps {
  minValue: number;
  maxValue: number;
  priceCeiling: number;
  onMinChange: (value: number) => void;
  onMaxChange: (value: number) => void;
  inputClassName?: string;
}

const defaultInputClassName =
  "h-8 w-[88px] border border-[#494791] px-3 py-[6px] text-base font-normal focus:outline-none focus:ring-2 focus:ring-[#494791] lg:h-10 lg:flex-1";

export default function PriceRangeInputs({
  minValue,
  maxValue,
  priceCeiling,
  onMinChange,
  onMaxChange,
  inputClassName = defaultInputClassName,
}: PriceRangeInputsProps) {
  return (
    <>
      <input
        type="number"
        min="0"
        max={priceCeiling}
        placeholder="Min"
        value={minValue}
        onChange={(e) => {
          const parsedValue = parseFloat(e.target.value);
          onMinChange(Number.isNaN(parsedValue) ? 0 : parsedValue);
        }}
        className={inputClassName}
      />
      <span aria-hidden="true" className="shrink-0 text-base font-normal text-black">
        —
      </span>
      <input
        type="number"
        min="0"
        max={priceCeiling}
        placeholder="Max"
        value={maxValue}
        onChange={(e) => {
          const parsedValue = parseFloat(e.target.value);
          onMaxChange(Number.isNaN(parsedValue) ? priceCeiling : parsedValue);
        }}
        className={inputClassName}
      />
    </>
  );
}
