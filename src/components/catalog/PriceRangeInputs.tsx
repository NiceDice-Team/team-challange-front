"use client";

import { useEffect, useRef, useState } from "react";
import { useDebounce } from "@/utils/useDebounce";

export interface PriceRangeInputsProps {
  minValue: number;
  maxValue: number;
  priceCeiling: number;
  onMinChange: (value: number) => void;
  onMaxChange: (value: number) => void;
  inputClassName?: string;
  debounceMs?: number;
}

const defaultInputClassName =
  "h-8 w-[88px] border border-[#494791] px-3 py-[6px] text-base font-normal focus:outline-none focus:ring-1 focus:ring-[#494791] lg:h-10 lg:flex-1";

function formatMaxDraft(value: number, priceCeiling: number) {
  return value >= priceCeiling ? String(priceCeiling) : String(value);
}

function parseDraft(raw: string): number | null {
  if (raw === "" || raw === "-" || raw === ".") return null;
  const parsed = parseFloat(raw);
  return Number.isNaN(parsed) ? null : parsed;
}

export default function PriceRangeInputs({
  minValue,
  maxValue,
  priceCeiling,
  onMinChange,
  onMaxChange,
  inputClassName = defaultInputClassName,
  debounceMs = 300,
}: PriceRangeInputsProps) {
  const [minDraft, setMinDraft] = useState(() => String(minValue));
  const [maxDraft, setMaxDraft] = useState(() =>
    formatMaxDraft(maxValue, priceCeiling),
  );
  const minFocusedRef = useRef(false);
  const maxFocusedRef = useRef(false);

  const debouncedMinChange = useDebounce(onMinChange, debounceMs);
  const debouncedMaxChange = useDebounce(onMaxChange, debounceMs);

  useEffect(() => {
    if (!minFocusedRef.current) {
      setMinDraft(String(minValue));
    }
  }, [minValue]);

  useEffect(() => {
    if (!maxFocusedRef.current) {
      setMaxDraft(formatMaxDraft(maxValue, priceCeiling));
    }
  }, [maxValue, priceCeiling]);

  const commitMin = (raw: string, immediate: boolean) => {
    const parsed = parseDraft(raw);
    if (parsed === null) {
      if (immediate) {
        debouncedMinChange.cancel();
        onMinChange(0);
        setMinDraft("0");
      }
      return;
    }
    if (immediate) {
      debouncedMinChange.cancel();
      onMinChange(parsed);
      setMinDraft(String(parsed));
      return;
    }
    debouncedMinChange(parsed);
  };

  const commitMax = (raw: string, immediate: boolean) => {
    const parsed = parseDraft(raw);
    if (parsed === null) {
      if (immediate) {
        debouncedMaxChange.cancel();
        onMaxChange(priceCeiling);
        setMaxDraft(formatMaxDraft(priceCeiling, priceCeiling));
      }
      return;
    }
    if (immediate) {
      debouncedMaxChange.cancel();
      onMaxChange(parsed);
      setMaxDraft(formatMaxDraft(parsed, priceCeiling));
      return;
    }
    debouncedMaxChange(parsed);
  };

  return (
    <>
      <input
        type="number"
        min="0"
        max={priceCeiling}
        placeholder="Min"
        value={minDraft}
        onFocus={() => {
          minFocusedRef.current = true;
        }}
        onBlur={() => {
          minFocusedRef.current = false;
          commitMin(minDraft, true);
        }}
        onChange={(e) => {
          const raw = e.target.value;
          setMinDraft(raw);
          const parsed = parseDraft(raw);
          if (parsed !== null) {
            debouncedMinChange(parsed);
          } else {
            debouncedMinChange.cancel();
          }
        }}
        className={inputClassName}
      />
      <span
        aria-hidden="true"
        className="shrink-0 text-base font-normal text-black"
      >
        —
      </span>
      <input
        type="number"
        min="0"
        max={priceCeiling}
        placeholder="Max"
        value={maxDraft}
        onFocus={() => {
          maxFocusedRef.current = true;
        }}
        onBlur={() => {
          maxFocusedRef.current = false;
          commitMax(maxDraft, true);
        }}
        onChange={(e) => {
          const raw = e.target.value;
          setMaxDraft(raw);
          const parsed = parseDraft(raw);
          if (parsed !== null) {
            debouncedMaxChange(parsed);
          } else {
            debouncedMaxChange.cancel();
          }
        }}
        className={inputClassName}
      />
    </>
  );
}
