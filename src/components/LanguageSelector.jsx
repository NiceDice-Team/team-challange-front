'use client";';
import React, { useState, useRef } from "react";
export default function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const languages = [
    { lan: "EN", id: 1 },
    { lan: "UA", id: 2 },
  ];
  const dropdownRef = useRef(null);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex flex-row items-center gap-1"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        <span>{selectedLanguage}</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className={`transform transition-transform ${isOpen ? "rotate-180" : ""}`}
        >
          <path
            d="M4.66732 5.99999L8.00065 9.33333L11.334 5.99999"
            stroke="black"
            strokeWidth="1.33333"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute min-w-20 mt-1 bg-sky-100 p-2 rounded-md shadow-lg z-10 flex flex-col gap-1">
          {languages.map((language) => {
            return (
              <button
                className={`w-full text-left hover:bg-gray-300 rounded-md p-1" key={language.id} ${
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
