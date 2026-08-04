"use client";

import { createContext, useContext, useState } from "react";

import {
  Language,
  TranslationKeys,
  translations,
} from "@/constants/translations";

interface ILanguageContext {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKeys) => string;
}

const LanguageContext = createContext<ILanguageContext | undefined>(undefined);

function getLanguageFromCookie(): Language {
  if (typeof document === "undefined") return "en";

  const match = document.cookie.match(/(?:^|; )app_language=([^;]*)/);
  const lang = match ? decodeURIComponent(match[1]) : null;

  if (lang === "ru" || lang === "en") {
    return lang;
  }

  const savedLocal = localStorage.getItem("app_language") as Language;
  return savedLocal === "ru" || savedLocal === "en" ? savedLocal : "en";
}

export const LanguageProvider = ({
  children,
  initialLanguage,
}: {
  children: React.ReactNode;
  initialLanguage?: Language;
}) => {
  // 🔑 Инициализация сразу берёт нужный язык (без useEffect и без перезаписи)
  const [language, setLanguageState] = useState<Language>(
    () => initialLanguage || getLanguageFromCookie(),
  );

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("app_language", lang);
    document.cookie = `app_language=${lang}; path=/; max-age=31536000; SameSite=Lax`;
  };

  const t = (key: TranslationKeys): string => {
    const dict = translations[language] as Record<TranslationKeys, string>;
    const defaultDict = translations.en as Record<TranslationKeys, string>;

    return dict?.[key] || defaultDict?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
