import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { SelectItem } from "@/components/ui/select";
import { FloatingSelect } from ".";

describe("FloatingSelect UI Component", () => {
  it("renders trigger with floating label correctly", () => {
    render(
      <FloatingSelect label="Country">
        <SelectItem value="us">United States</SelectItem>
        <SelectItem value="ca">Canada</SelectItem>
      </FloatingSelect>
    );

    expect(screen.getByText("Country")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("opens select content options on trigger click", async () => {
    const user = userEvent.setup();

    render(
      <FloatingSelect label="Country">
        <SelectItem value="us">United States</SelectItem>
        <SelectItem value="ca">Canada</SelectItem>
      </FloatingSelect>
    );

    const trigger = screen.getByRole("combobox");
    await user.click(trigger);

    expect(await screen.findByText("United States")).toBeInTheDocument();
    expect(screen.getByText("Canada")).toBeInTheDocument();
  });

  it("calls onValueChange callback when an item is selected", async () => {
    const user = userEvent.setup();
    const handleValueChange = vi.fn();

    render(
      <FloatingSelect label="Country" onValueChange={handleValueChange}>
        <SelectItem value="us">United States</SelectItem>
        <SelectItem value="ca">Canada</SelectItem>
      </FloatingSelect>
    );

    await user.click(screen.getByRole("combobox"));

    const option = await screen.findByText("United States");
    await user.click(option);

    expect(handleValueChange).toHaveBeenCalledWith("us", expect.anything());
  });

  it("displays selected value in controlled state", () => {
    render(
      <FloatingSelect label="Country" value="ca">
        <SelectItem value="us">United States</SelectItem>
        <SelectItem value="ca">Canada</SelectItem>
      </FloatingSelect>
    );

    expect(screen.getByText("ca")).toBeInTheDocument();
  });
});