import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from ".";

const TestSelect = ({
  onValueChange,
  disabled = false,
  defaultValue,
}: {
  onValueChange?: (value: string | null) => void;
  disabled?: boolean;
  defaultValue?: string;
}) => (
  <Select
    onValueChange={onValueChange}
    disabled={disabled}
    defaultValue={defaultValue}
  >
    <SelectTrigger>
      <SelectValue placeholder="Select a fruit" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectLabel>Fruits</SelectLabel>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
);

describe("Select UI Component", () => {
  it("renders trigger and displays placeholder", () => {
    render(<TestSelect />);

    const trigger = screen.getByRole("combobox");
    expect(trigger).toBeInTheDocument();
    expect(screen.getByText("Select a fruit")).toBeInTheDocument();
  });

  it("opens options list when clicking trigger", async () => {
    const user = userEvent.setup();

    render(<TestSelect />);

    await user.click(screen.getByRole("combobox"));

    expect(await screen.findByText("Fruits")).toBeInTheDocument();
    expect(screen.getByText("Apple")).toBeInTheDocument();
    expect(screen.getByText("Banana")).toBeInTheDocument();
  });

  it("calls onValueChange when an item is selected", async () => {
    const user = userEvent.setup();
    const handleValueChange = vi.fn();

    render(<TestSelect onValueChange={handleValueChange} />);

    await user.click(screen.getByRole("combobox"));

    const option = await screen.findByText("Banana");
    await user.click(option);

    expect(handleValueChange).toHaveBeenCalledWith("banana", expect.anything());
  });

  it("does not open popover when select is disabled", async () => {
    const user = userEvent.setup();

    render(<TestSelect disabled />);

    const trigger = screen.getByRole("combobox");
    expect(trigger).toBeDisabled();

    await user.click(trigger);

    expect(screen.queryByText("Apple")).not.toBeInTheDocument();
  });
});
