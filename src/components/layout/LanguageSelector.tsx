"use client";
import React, { useState, useRef } from "react";
import useClickOutside from "../../utils/useClickOutside";
import { SimpleChevronIcon } from "@/svgs/icons";

interface Language {
  lan: string;
  id: number;
}

export default function LanguageSelector() {
  const languages: Language[] = [
    { lan: "EN", id: 1 }, //🇬🇧
    { lan: "UA", id: 2 }, //🇺🇦
  ];
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0].lan);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => {
    setIsOpen(false);
  });

  return (
    <div className="relative " ref={dropdownRef}>
      <button
        className="flex flex-row items-center gap-1 hover:bg-gray-200 hover:text-blue-700 rounded-md px-1 transition duration-200"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        <span>{selectedLanguage}</span>
        <SimpleChevronIcon isOpen={isOpen} />
      </button>
      {isOpen && (
        <div className="absolute min-w-20 mt-1 bg-sky-100 p-2 rounded-md shadow-lg z-10 flex flex-col gap-1">
          {languages.map((language) => {
            return (
              <button
                key={language.id}
                className={`w-full text-left pl-1 hover:bg-gray-300 rounded-md transition duration-200 hover:shadow-md ${
                  language.lan === selectedLanguage ? "bg-gray-300" : ""
                }`}
                onClick={() => {
                  setSelectedLanguage(language.lan);
                  setIsOpen(false);
                }}
              >
                {language.lan}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
