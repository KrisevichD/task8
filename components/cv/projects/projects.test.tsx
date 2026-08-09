import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import CvProjects from ".";

vi.mock("./form", () => ({
  default: vi.fn(() => <div data-testid="cv-projects-form" />),
}));

vi.mock("./list", () => ({
  default: vi.fn(({ searchQuery }: { searchQuery?: string }) => (
    <div data-testid="cv-projects-list">
      Current Query: {searchQuery || "empty"}
    </div>
  )),
}));

describe("CvProjects Container Component", () => {
  it("renders search input, form and list components", () => {
    render(<CvProjects />);

    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.getByTestId("cv-projects-form")).toBeInTheDocument();
    expect(screen.getByTestId("cv-projects-list")).toBeInTheDocument();
  });

  it("updates searchQuery state and passes it to CvProjectsList on user input", async () => {
    const user = userEvent.setup();

    render(<CvProjects />);

    const searchInput = screen.getByRole("textbox");

    expect(screen.getByText("Current Query: empty")).toBeInTheDocument();

    await user.type(searchInput, "Fintech");

    expect(searchInput).toHaveValue("Fintech");
    expect(screen.getByText("Current Query: Fintech")).toBeInTheDocument();
  });
});
