import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";
import { vi } from "vitest";

import { translations } from "@/constants/translations";

vi.mock("@/context/language", () => {
  return {
    useLanguage: () => ({
      language: "en",
      setLanguage: vi.fn(),
      t: (key: string) => {
        const defaultDict = translations.en as Record<string, string>;
        return defaultDict?.[key] || key;
      },
    }),
  };
});

afterEach(() => {
  cleanup();
});
