import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import SkillBadge from "./";

describe("SkillBadge UI Component", () => {
  it("renders screen-reader text with current variant label", () => {
    render(<SkillBadge variant="Novice" />);

    const label = screen.getByText("Novice");
    expect(label).toBeInTheDocument();
    expect(label).toHaveClass("sr-only");
  });

  it("applies correct variant classes for different mastery levels", () => {
    const { container, rerender } = render(<SkillBadge variant="Competent" />);

    const badge = container.firstChild as HTMLElement;
    const innerBar = badge.querySelector("span[aria-hidden]");

    expect(badge).toHaveClass("bg-mastery-bg-3");
    expect(innerBar).toHaveClass("w-[60%]");
    expect(innerBar).toHaveClass("bg-mastery-3");

    rerender(<SkillBadge variant="Expert" />);
    expect(badge).toHaveClass("bg-primary");
    expect(innerBar).toHaveClass("w-full");
  });

  it("applies neutral styles when variant is pressed", () => {
    const { container } = render(<SkillBadge variant="pressed" />);

    const badge = container.firstChild as HTMLElement;
    const innerBar = badge.querySelector("span[aria-hidden]");

    expect(badge).toHaveClass("bg-muted");
    expect(innerBar).toHaveClass("bg-transparent");
    expect(screen.getByText("pressed")).toBeInTheDocument();
  });

  it("has decorative progress bar hidden from screen readers", () => {
    const { container } = render(<SkillBadge variant="Proficient" />);

    const innerBar = container.querySelector("span[aria-hidden]");
    expect(innerBar).toBeInTheDocument();
  });
});
