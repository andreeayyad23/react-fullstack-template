// src/i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import enTranslation from "./assets/locals/en/translation.json";
import arTranslation from "./assets/locals/ar/translation.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslation,
      },
      ar: {
        translation: arTranslation,
      },
    },
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    detection: {
      caches: ["localStorage", "cookie"],
    },
  });

// ✅ Handle direction (LTR/RTL) globally
i18n.on("languageChanged", (lng) => {
  if (typeof document !== "undefined") {
    document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lng;
  }
});

export default i18n;
