import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Separator } from ".";

describe("Separator UI Component", () => {
  it("renders horizontal separator by default", () => {
    render(<Separator data-testid="separator" />);

    const separator = screen.getByTestId("separator");
    expect(separator).toBeInTheDocument();
    expect(separator).toHaveAttribute("data-slot", "separator");
    expect(separator).toHaveClass("bg-border");
    expect(separator).toHaveAttribute("data-orientation", "horizontal");
  });

  it("renders vertical separator when orientation prop is vertical", () => {
    render(<Separator orientation="vertical" data-testid="vertical-separator" />);

    const separator = screen.getByTestId("vertical-separator");
    expect(separator).toHaveAttribute("data-orientation", "vertical");
  });

  it("applies custom className correctly alongside default classes", () => {
    render(<Separator className="my-4 bg-primary" data-testid="custom-separator" />);

    const separator = screen.getByTestId("custom-separator");
    expect(separator).toHaveClass("my-4");
    expect(separator).toHaveClass("bg-primary");
    expect(separator).toHaveClass("shrink-0");
  });
});