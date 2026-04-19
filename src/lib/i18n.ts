"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpApi from "i18next-http-backend";

export const I18N_LANG_STORAGE_KEY = "i18nextLng";

function readStoredLanguage(): string | undefined {
  if (typeof window === "undefined") return undefined;
  const stored = window.localStorage.getItem(I18N_LANG_STORAGE_KEY);
  return stored === "en" || stored === "ua" ? stored : undefined;
}

if (!i18n.isInitialized) {
  const storedLng = readStoredLanguage();

  i18n
    .use(HttpApi)
    .use(initReactI18next)
    .init({
      ...(storedLng ? { lng: storedLng } : {}),
      fallbackLng: "en",
      supportedLngs: ["ua", "en"],
      ns: ["common"],
      defaultNS: "common",
      interpolation: {
        escapeValue: false,
      },
      backend: {
        loadPath: "/locales/{{lng}}/{{ns}}.json",
      },
    });
}

export default i18n;
