import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { FloatingInput } from ".";

describe("FloatingInput UI Component", () => {
  it("renders input and associates label correctly using id", () => {
    render(<FloatingInput id="email-field" label="Email Address" />);

    const input = screen.getByLabelText("Email Address");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("id", "email-field");
  });

  it("handles user typing and triggers onChange callback", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <FloatingInput
        id="username"
        label="Username"
        onChange={handleChange}
      />
    );

    const input = screen.getByLabelText("Username");
    await user.type(input, "john_doe");

    expect(input).toHaveValue("john_doe");
    expect(handleChange).toHaveBeenCalled();
  });

  it("initializes with defaultValue and sets label state", () => {
    render(
      <FloatingInput
        id="search"
        label="Search"
        defaultValue="React"
      />
    );

    const input = screen.getByLabelText("Search");
    expect(input).toHaveValue("React");
  });

  it("forwards ref to the underlying HTML input element", () => {
    const ref = React.createRef<HTMLInputElement>();

    render(<FloatingInput ref={ref} id="ref-test" label="Ref Test" />);

    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe("INPUT");
  });
});