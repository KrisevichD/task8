import { describe, expect, it } from "vitest";

import { cn } from "../shadcn";

describe("cn utility (shadcn/tailwind-merge)", () => {
  it("merges multiple class names correctly", () => {
    const result = cn("flex", "items-center", "justify-between");

    expect(result).toBe("flex items-center justify-between");
  });

  it("handles conditional classes and falsy values", () => {
    const isTrue = true;
    const isFalse = false;

    const result = cn(
      "base-class",
      isTrue && "active-class",
      isFalse && "disabled-class",
      null,
      undefined,
      "",
    );

    expect(result).toBe("base-class active-class");
  });

  it("overrides conflicting Tailwind CSS classes correctly", () => {
    const result = cn("px-2 py-1 bg-red-500", "px-4 bg-blue-500");

    expect(result).toBe("py-1 px-4 bg-blue-500");
  });

  it("handles arrays and object syntax from clsx", () => {
    const result = cn(["font-bold", "text-sm"], {
      "text-red-500": true,
      hidden: false,
    });

    expect(result).toBe("font-bold text-sm text-red-500");
  });
});
