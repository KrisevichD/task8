import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Icon } from ".";

describe("Icon UI Component", () => {
  it("renders SVG icon with correct sprite href for a variant", () => {
    const { container } = render(<Icon variant="search" />);

    const svg = container.querySelector("svg");
    const use = container.querySelector("use");

    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(use).toHaveAttribute("href", "/sprite.svg#search");
  });

  it("applies size variants and custom className correctly", () => {
    const { container } = render(
      <Icon variant="user" size="sm" className="text-red-500" />
    );

    const svg = container.querySelector("svg");
    expect(svg).toHaveClass("size-4");
    expect(svg).toHaveClass("text-red-500");
  });

  it("renders screen reader label when label prop is provided", () => {
    render(<Icon variant="delete" label="Delete item" />);

    const labelText = screen.getByText("Delete item");
    expect(labelText).toBeInTheDocument();
    expect(labelText).toHaveClass("sr-only");
  });

  it("forwards ref to the underlying SVG element", () => {
    const ref = React.createRef<SVGSVGElement>();

    render(<Icon ref={ref} variant="add" />);

    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe("svg");
  });
});