import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { Label } from ".";

describe("Label UI Component", () => {
  it("renders text and correct data-slot attribute", () => {
    render(<Label>Username</Label>);

    const label = screen.getByText("Username");
    expect(label).toBeInTheDocument();
    expect(label.tagName).toBe("LABEL");
    expect(label).toHaveAttribute("data-slot", "label");
  });

  it("links correctly with input element via htmlFor", async () => {
    const user = userEvent.setup();

    render(
      <div>
        <Label htmlFor="input-id">Clickable Label</Label>
        <input id="input-id" type="text" />
      </div>
    );

    const input = screen.getByRole("textbox");
    expect(input).not.toHaveFocus();

    await user.click(screen.getByText("Clickable Label"));

    expect(input).toHaveFocus();
  });

  it("applies custom className correctly alongside default classes", () => {
    render(<Label className="custom-class-name">Password</Label>);

    const label = screen.getByText("Password");
    expect(label).toHaveClass("custom-class-name");
    expect(label).toHaveClass("text-xs");
  });
});