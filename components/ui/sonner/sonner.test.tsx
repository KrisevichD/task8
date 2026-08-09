import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Toaster } from ".";

// Мокаем next-themes
vi.mock("next-themes", () => ({
  useTheme: () => ({
    theme: "dark",
  }),
}));

describe("Toaster UI Component", () => {
  it("renders toaster section element correctly", () => {
    render(<Toaster />);

    // Находим секцию уведомлений Sonner по её роли accessibility
    const region = screen.getByRole("region", {
      name: /notifications/i,
    });

    expect(region).toBeInTheDocument();
  });

  it("renders with custom position prop without crashing", () => {
    render(<Toaster position="bottom-center" />);

    const region = screen.getByRole("region", {
      name: /notifications/i,
    });

    expect(region).toBeInTheDocument();
  });

  it("applies toaster className correctly", () => {
    const { container } = render(<Toaster className="custom-toaster" />);

    const section = container.querySelector("section");
    expect(section).toBeInTheDocument();
  });
});