"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpApi from "i18next-http-backend";

if (!i18n.isInitialized) {
  i18n
    .use(HttpApi)
    .use(initReactI18next)
    .init({
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
