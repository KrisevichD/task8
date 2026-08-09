import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Skeleton } from ".";

describe("Skeleton UI Component", () => {
  it("renders skeleton element with default classes and data-slot attribute", () => {
    render(<Skeleton data-testid="skeleton-loader" />);

    const skeleton = screen.getByTestId("skeleton-loader");
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveAttribute("data-slot", "skeleton");
    expect(skeleton).toHaveClass("animate-pulse");
    expect(skeleton).toHaveClass("bg-muted");
  });

  it("applies custom className correctly for sizing and shape", () => {
    render(<Skeleton className="h-12 w-12 rounded-full" data-testid="avatar-skeleton" />);

    const skeleton = screen.getByTestId("avatar-skeleton");
    expect(skeleton).toHaveClass("h-12");
    expect(skeleton).toHaveClass("w-12");
    expect(skeleton).toHaveClass("rounded-full");
    expect(skeleton).toHaveClass("animate-pulse");
  });

  it("passes additional HTML attributes correctly", () => {
    render(<Skeleton data-testid="skeleton" aria-busy="true" id="card-skeleton" />);

    const skeleton = screen.getByTestId("skeleton");
    expect(skeleton).toHaveAttribute("aria-busy", "true");
    expect(skeleton).toHaveAttribute("id", "card-skeleton");
  });
});