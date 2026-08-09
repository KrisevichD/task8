import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Toggle } from ".";

describe("Toggle UI Component", () => {
  it("renders toggle element with default props", () => {
    render(<Toggle>Toggle Me</Toggle>);

    const toggle = screen.getByRole("button", { name: "Toggle Me" });
    expect(toggle).toBeInTheDocument();
    expect(toggle).toHaveAttribute("data-slot", "toggle");
    expect(toggle).toHaveAttribute("aria-pressed", "false");
  });

  it("toggles pressed state on click and calls onPressedChange", async () => {
    const user = userEvent.setup();
    const handlePressedChange = vi.fn();

    render(
      <Toggle onPressedChange={handlePressedChange}>
        Bold
      </Toggle>
    );

    const toggle = screen.getByRole("button", { name: "Bold" });
    expect(toggle).toHaveAttribute("aria-pressed", "false");

    await user.click(toggle);

    expect(handlePressedChange).toHaveBeenCalledWith(true, expect.anything());
  });

  it("applies variant and size classes correctly", () => {
    render(
      <Toggle variant="outline" size="sm">
        Italic
      </Toggle>
    );

    const toggle = screen.getByRole("button", { name: "Italic" });
    expect(toggle).toHaveClass("border");
    expect(toggle).toHaveClass("border-input");
    expect(toggle).toHaveClass("h-7");
  });

  it("handles disabled state correctly", () => {
    render(<Toggle disabled>Disabled Toggle</Toggle>);

    const toggle = screen.getByRole("button", { name: "Disabled Toggle" });
    
    expect(toggle).toBeDisabled();
  });
});