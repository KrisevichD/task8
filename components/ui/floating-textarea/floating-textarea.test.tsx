import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { FloatingTextarea } from ".";

describe("FloatingTextarea UI Component", () => {
  it("renders textarea and links label correctly via id", () => {
    render(<FloatingTextarea id="bio" label="Biography" />);

    const textarea = screen.getByLabelText("Biography");
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveAttribute("id", "bio");
  });

  it("handles user typing and triggers onChange callback", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <FloatingTextarea
        id="description"
        label="Description"
        onChange={handleChange}
      />
    );

    const textarea = screen.getByLabelText("Description");
    await user.type(textarea, "Line 1\nLine 2");

    expect(textarea).toHaveValue("Line 1\nLine 2");
    expect(handleChange).toHaveBeenCalled();
  });

  it("initializes with defaultValue and displays filled content", () => {
    render(
      <FloatingTextarea
        id="notes"
        label="Notes"
        defaultValue="Initial multiline content"
      />
    );

    const textarea = screen.getByLabelText("Notes");
    expect(textarea).toHaveValue("Initial multiline content");
  });

  it("forwards ref to the HTMLTextAreaElement node", () => {
    const ref = React.createRef<HTMLTextAreaElement>();

    render(<FloatingTextarea ref={ref} id="ref-textarea" label="Ref Test" />);

    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe("TEXTAREA");
  });
});