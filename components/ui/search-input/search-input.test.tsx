import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { SearchInput } from "./";


vi.mock("@/context/language", () => ({
  useLanguage: () => ({
    t: (key: string) => (key === "search" ? "Search..." : key),
  }),
}));

describe("SearchInput Component", () => {
  it("renders with default localized placeholder and value", () => {
    render(<SearchInput value="Initial query" onChange={vi.fn()} />);

    const input = screen.getByPlaceholderText("Search...");
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue("Initial query");
  });

  it("renders custom placeholder when provided", () => {
    render(
      <SearchInput
        value=""
        onChange={vi.fn()}
        placeholder="Type to search users..."
      />,
    );

    expect(
      screen.getByPlaceholderText("Type to search users..."),
    ).toBeInTheDocument();
  });

  it("calls onChange callback with updated string value on user typing", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<SearchInput value="" onChange={handleChange} />);

    const input = screen.getByPlaceholderText("Search...");
    await user.type(input, "A");

    expect(handleChange).toHaveBeenCalledWith("A");
  });

  it("applies custom wrapper className", () => {
    const { container } = render(
      <SearchInput
        value=""
        onChange={vi.fn()}
        className="custom-search-width"
      />,
    );

    expect(container.firstChild).toHaveClass("custom-search-width");
  });
});
