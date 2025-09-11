import { useState, useEffect } from "react";

type Language = "en" | "ar";

interface Translations {
  [key: string]: string | Translations;
}

const loadTranslations = async (lang: Language): Promise<Translations> => {
  try {
    const module = await import(`../i18n/${lang}.json`);
    return module.default || module;
  } catch (error) {
    console.error(`Failed to load translations for ${lang}:`, error);
    return {};
  }
};

export const useTranslation = () => {
  const [lang, setLang] = useState<Language>("en");
  const [translations, setTranslations] = useState<Translations>({});

  useEffect(() => {
    const saved = localStorage.getItem("appLanguage");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setLang(parsed.lang === "ar" ? "ar" : "en");
      } catch {
        setLang("en");
      }
    }
  }, []);

  useEffect(() => {
    loadTranslations(lang).then(setTranslations);
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
    localStorage.setItem("appLanguage", JSON.stringify({ lang }));
  }, [lang]);

  const t = (key: string): string => {
    const keys = key.split(".");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let result: any = translations;

    for (const k of keys) {
      if (result && typeof result === "object" && k in result) {
        result = result[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }

    return typeof result === "string" ? result : key;
  };

  const changeLanguage = (newLang: Language) => {
    setLang(newLang);
  };

  return { t, lang, changeLanguage, translations };
};