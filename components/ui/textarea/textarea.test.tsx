import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Textarea } from ".";

describe("Textarea UI Component", () => {
  it("renders textarea element with correct data-slot attribute", () => {
    render(<Textarea placeholder="Enter text..." />);

    const textarea = screen.getByPlaceholderText("Enter text...");
    expect(textarea).toBeInTheDocument();
    expect(textarea.tagName).toBe("TEXTAREA");
    expect(textarea).toHaveAttribute("data-slot", "textarea");
  });

  it("allows user to type text and triggers onChange callback", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<Textarea placeholder="Comments" onChange={handleChange} />);

    const textarea = screen.getByPlaceholderText("Comments");
    await user.type(textarea, "Hello World");

    expect(textarea).toHaveValue("Hello World");
    expect(handleChange).toHaveBeenCalled();
  });

  it("handles disabled state correctly", async () => {
    const user = userEvent.setup();

    render(<Textarea placeholder="Disabled area" disabled />);

    const textarea = screen.getByPlaceholderText("Disabled area");
    expect(textarea).toBeDisabled();

    await user.type(textarea, "Cannot type");
    expect(textarea).toHaveValue("");
  });

  it("applies custom className and HTML attributes", () => {
    render(
      <Textarea
        className="custom-textarea-class"
        rows={5}
        data-testid="textarea-element"
      />
    );

    const textarea = screen.getByTestId("textarea-element");
    expect(textarea).toHaveClass("custom-textarea-class");
    expect(textarea).toHaveClass("min-h-16");
    expect(textarea).toHaveAttribute("rows", "5");
  });
});