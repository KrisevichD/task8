"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

import { FloatingSelect } from "@/components/ui/floating-select";
import { SelectItem } from "@/components/ui/select";
import { Language } from "@/constants/translations";
import { useLanguage } from "@/context/language";

const emptySubscribe = () => () => {};

const LANGUAGE_OPTIONS: Record<Language, string> = {
  en: "English",
  ru: "Русский",
};

export const SettingsContent = () => {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  if (!isClient) return null;

  const currentTheme = theme || "system";

  return (
    <div className="w-full max-w-225 mx-auto flex flex-col space-y-6 pt-6 px-6">
      <FloatingSelect
        label={t("appearance")}
        value={currentTheme}
        onValueChange={(val) => setTheme(String(val))}
      >
        <SelectItem value="system" className="capitalize">
          {t("deviceSettings")}
        </SelectItem>
        <SelectItem value="light" className="capitalize">
          {t("light")}
        </SelectItem>
        <SelectItem value="dark" className="capitalize">
          {t("dark")}
        </SelectItem>
      </FloatingSelect>

      <FloatingSelect
        label={t("language")}
        value={language}
        onValueChange={(val) => setLanguage(val as Language)}
      >
        {Object.entries(LANGUAGE_OPTIONS).map(([code, name]) => (
          <SelectItem key={code} value={code}>
            {name}
          </SelectItem>
        ))}
      </FloatingSelect>
    </div>
  );
};

export default SettingsContent;
