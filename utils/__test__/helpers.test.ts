import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { validateDateString, validateProjectDate } from "../helpers";

describe("helpers utils", () => {
  describe("validateProjectDate", () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2025-01-01T00:00:00.000Z"));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("returns 'Till now' if the date is in the future", () => {
      const futureDate = "2026-05-15";
      const result = validateProjectDate(futureDate);

      expect(result).toBe("Till now");
    });

    it("formats date as DD/MM/YYYY when variant is 'cv-projects'", () => {
      const pastDate = "2023-04-05";
      const result = validateProjectDate(pastDate, "cv-projects");

      expect(result).toBe("05/04/2023");
    });

    it("formats date as MM.YYYY when variant is 'preview'", () => {
      const pastDate = "2023-09-12";
      const result = validateProjectDate(pastDate, "preview");

      expect(result).toBe("09.2023");
    });

    it("returns default toLocaleString when variant is not provided", () => {
      const pastDate = "2022-10-20T10:00:00.000Z";
      const result = validateProjectDate(pastDate);

      const expectedDate = new Date(pastDate).toLocaleString();
      expect(result).toBe(expectedDate);
    });
  });

  describe("validateDateString", () => {
    it("converts a valid date string into ISO format", () => {
      const inputDate = "2023-01-01";
      const result = validateDateString(inputDate);

      expect(result).toBe(new Date("2023-01-01").toISOString());
    });
  });
});
