"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

import { FloatingSelect } from "@/components/ui/floating-select";
import { SelectItem } from "@/components/ui/select";
import { Language } from "@/constants/translations";
import { useLanguage } from "@/context/language";

const emptySubscribe = () => () => {};

export const SettingsContent = () => {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  if (!isClient) return null;

  // 🔑 Карты перевода для отображения выбранных значений
  const themeDisplayNames: Record<string, string> = {
    system: t("deviceSettings"),
    light: t("light"),
    dark: t("dark"),
  };

  const languageDisplayNames: Record<Language, string> = {
    en: t("english"),
    ru: t("russian"),
  };

  const currentTheme = theme || "system";

  return (
    <div className="w-full max-w-225 mx-auto flex flex-col space-y-6 pt-6 px-6">
      <FloatingSelect
        label={t("appearance")}
        value={currentTheme}
        onValueChange={(val) => setTheme(val as string)}
      >
        <SelectItem value="system">{t("deviceSettings")}</SelectItem>
        <SelectItem value="light">{t("light")}</SelectItem>
        <SelectItem value="dark">{t("dark")}</SelectItem>
      </FloatingSelect>

      <FloatingSelect
        label={t("language")}
        value={language}
        onValueChange={(val) => setLanguage(val as Language)}
      >
        <SelectItem value="en">{t("english")}</SelectItem>
        <SelectItem value="ru">{t("russian")}</SelectItem>
      </FloatingSelect>
    </div>
  );
};

export default SettingsContent;
