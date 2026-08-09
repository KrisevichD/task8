import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Badge } from ".";

describe("Badge UI Component", () => {
  it("renders children text correctly", () => {
    render(<Badge>New Feature</Badge>);

    const badge = screen.getByText("New Feature");
    expect(badge).toBeInTheDocument();
    expect(badge.tagName).toBe("SPAN");
  });

  it("applies variant and custom className correctly", () => {
    render(
      <Badge variant="destructive" className="custom-test-class">
        Error Status
      </Badge>,
    );

    const badge = screen.getByText("Error Status");
    expect(badge).toHaveClass("custom-test-class");
    expect(badge).toHaveClass("bg-destructive/10");
  });

  it("renders as a custom element when using render prop", () => {
    render(
      <Badge
        variant="link"
        render={<a href="https://example.com">Clickable Badge</a>}
      />,
    );

    const linkBadge = screen.getByRole("link", { name: /clickable badge/i });
    expect(linkBadge).toBeInTheDocument();
    expect(linkBadge).toHaveAttribute("href", "https://example.com");
    expect(linkBadge).toHaveClass("text-primary");
  });
});
