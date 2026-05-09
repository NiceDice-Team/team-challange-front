"use client";

import React, { useMemo, useRef, useState } from "react";
import useClickOutside from "../../utils/useClickOutside";
import { SimpleChevronIcon } from "@/svgs/icons";
import { useTranslation } from "react-i18next";
import { I18N_LANG_STORAGE_KEY } from "@/lib/i18n";

type LangCode = "en" | "ua";

interface LanguageOption {
  label: string;
  code: LangCode;
}

const LANGUAGES: LanguageOption[] = [
  { label: "EN", code: "en" },
  { label: "UA", code: "ua" },
];

function languageCodeToLabel(language: string): string {
  const base = language.split("-")[0]?.toLowerCase() ?? "en";
  const match = LANGUAGES.find((l) => l.code === base);
  return match?.label ?? "EN";
}

export default function LanguageSelector() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedLabel = useMemo(
    () => languageCodeToLabel(i18n.resolvedLanguage || i18n.language || "en"),
    [i18n.resolvedLanguage, i18n.language],
  );

  useClickOutside(dropdownRef, () => {
    setIsOpen(false);
  });

  const handleSelect = async (code: LangCode) => {
    const current = i18n.language.split("-")[0]?.toLowerCase();
    if (current === code) {
      setIsOpen(false);
      return;
    }

    await i18n.changeLanguage(code);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(I18N_LANG_STORAGE_KEY, code);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative " ref={dropdownRef}>
      <button
        type="button"
        className="flex flex-row items-center gap-1 hover:bg-gray-200 hover:text-blue-700 rounded-md px-1 transition duration-200"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        <span>{selectedLabel}</span>
        <SimpleChevronIcon isOpen={isOpen} />
      </button>
      {isOpen && (
        <div className="absolute min-w-20 mt-1 bg-sky-100 p-2 rounded-md shadow-lg z-10 flex flex-col gap-1">
          {LANGUAGES.map((language) => (
            <button
              type="button"
              key={language.code}
              className={`w-full text-left pl-1 hover:bg-gray-300 rounded-md transition duration-200 hover:shadow-md ${
                language.label === selectedLabel ? "bg-gray-300" : ""
              }`}
              onClick={() => {
                void handleSelect(language.code);
              }}
            >
              {language.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
