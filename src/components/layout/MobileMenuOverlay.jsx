"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDownIcon } from "@/svgs/icons";
import { navigationLinks } from "./navigationLinks";

const languages = [
  { id: "en", label: "English" },
  { id: "ua", label: "Ukrainian" },
];

export default function MobileMenuOverlay({ isOpen, topOffset = 0, onClose }) {
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const originalOverflow = document.body.style.overflow;
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) return;

    setIsLanguageOpen(false);
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleClose = () => {
    setIsLanguageOpen(false);
    onClose();
  };

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
    setIsLanguageOpen(false);
  };

  return (
    <div
      className="fixed inset-x-0 z-[90] bg-white sm:hidden"
      style={{
        top: `${topOffset}px`,
        height: `calc(100dvh - ${topOffset}px)`,
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Mobile menu"
    >
      <div className="mx-auto flex h-full w-full max-w-[428px] flex-col px-4 pb-6 pt-6">
        <div className="mx-auto flex w-full max-w-[396px] flex-1 flex-col gap-8 overflow-y-auto">
          <div className="h-px w-full bg-[var(--color-light-purple-2)]" />

          <nav aria-label="Mobile navigation">
            <ul className="flex flex-col gap-6 px-4 text-[18px] leading-[22px] uppercase text-black">
              {navigationLinks.map((item) => (
                <li key={item.label}>
                  {item.isSale ? (
                    <Link href={item.href} className="flex items-center gap-3 text-[#494791]" onClick={handleClose}>
                      <span className="block h-11 w-px bg-[#494791]" aria-hidden="true" />
                      <span>{item.label}</span>
                    </Link>
                  ) : (
                    <Link href={item.href} className="block" onClick={handleClose}>
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-auto flex flex-col gap-6">
            <div className="h-px w-full bg-[var(--color-light-purple-2)]" />

            <div className="relative">
              <button
                type="button"
                className="flex h-12 w-full items-center justify-between border border-[#494791] px-4 text-base leading-[19px] text-black"
                aria-expanded={isLanguageOpen}
                aria-label="Select language"
                onClick={() => setIsLanguageOpen((currentState) => !currentState)}
              >
                <span>{selectedLanguage.label}</span>
                <ChevronDownIcon className="h-5 w-5" isExpanded={!isLanguageOpen} />
              </button>

              {isLanguageOpen && (
                <div className="absolute inset-x-0 top-full z-10 mt-2 border border-[#494791] bg-white py-2 shadow-sm">
                  {languages.map((language) => (
                    <button
                      key={language.id}
                      type="button"
                      className="block w-full px-4 py-2 text-left text-base leading-[19px] text-black transition-colors hover:bg-[#f4f3fb]"
                      onClick={() => handleLanguageSelect(language)}
                    >
                      {language.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
