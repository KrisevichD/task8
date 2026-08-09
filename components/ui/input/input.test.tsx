import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Input } from ".";

describe("Input UI Component", () => {
  it("renders input element and updates value on typing", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <Input
        placeholder="Enter your name"
        onChange={handleChange}
      />
    );

    const input = screen.getByPlaceholderText("Enter your name");
    expect(input).toBeInTheDocument();

    await user.type(input, "Alice");

    expect(input).toHaveValue("Alice");
    expect(handleChange).toHaveBeenCalled();
  });

  it("does not allow typing when disabled", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <Input
        disabled
        placeholder="Disabled input"
        onChange={handleChange}
      />
    );

    const input = screen.getByPlaceholderText("Disabled input");
    expect(input).toBeDisabled();

    await user.type(input, "Test");

    expect(input).toHaveValue("");
    expect(handleChange).not.toHaveBeenCalled();
  });

  it("applies correct input type attribute", () => {
    render(<Input type="password" placeholder="Password" />);

    const input = screen.getByPlaceholderText("Password");
    expect(input).toHaveAttribute("type", "password");
  });

  it("applies aria-invalid attribute when in invalid state", () => {
    render(<Input aria-invalid="true" placeholder="Invalid input" />);

    const input = screen.getByPlaceholderText("Invalid input");
    expect(input).toHaveAttribute("aria-invalid", "true");
  });
});