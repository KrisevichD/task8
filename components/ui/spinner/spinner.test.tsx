import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Spinner } from ".";

describe("Spinner UI Component", () => {
  it("renders spinner icon with correct accessibility role and label", () => {
    render(<Spinner />);

    const spinner = screen.getByRole("status", { name: /loading/i });
    expect(spinner).toBeInTheDocument();
  });

  it("applies default spinner classes and data-slot attribute", () => {
    render(<Spinner />);

    const spinner = screen.getByRole("status");
    expect(spinner).toHaveAttribute("data-slot", "spinner");
    expect(spinner).toHaveClass("animate-spin");
    expect(spinner).toHaveClass("size-12");
  });

  it("merges custom className with default classes", () => {
    render(<Spinner className="size-6 text-primary" />);

    const spinner = screen.getByRole("status");
    expect(spinner).toHaveClass("size-6");
    expect(spinner).toHaveClass("text-primary");
    expect(spinner).toHaveClass("animate-spin");
  });

  it("passes additional SVG props down to the icon element", () => {
    render(<Spinner data-testid="custom-spinner" id="loading-spinner" />);

    const spinner = screen.getByTestId("custom-spinner");
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveAttribute("id", "loading-spinner");
  });
});
