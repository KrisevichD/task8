import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from ".";

const TestDropdownMenu = ({
  onItemClick,
  onCheckedChange,
  isChecked = false,
}: {
  onItemClick?: () => void;
  onCheckedChange?: (checked: boolean) => void;
  isChecked?: boolean;
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger render={<button type="button">Open Options</button>} />
    <DropdownMenuContent>
      <DropdownMenuGroup>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onItemClick}>
          Profile
          <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuCheckboxItem
          checked={isChecked}
          onCheckedChange={onCheckedChange}
        >
          Show Status Bar
        </DropdownMenuCheckboxItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  </DropdownMenu>
);

describe("DropdownMenu UI Component", () => {
  it("renders trigger button and keeps menu content hidden by default", () => {
    render(<TestDropdownMenu />);

    expect(
      screen.getByRole("button", { name: /open options/i })
    ).toBeInTheDocument();
    expect(screen.queryByText("My Account")).not.toBeInTheDocument();
  });

  it("opens menu and calls onClick when clicking menu item", async () => {
    const user = userEvent.setup();
    const handleItemClick = vi.fn();

    render(<TestDropdownMenu onItemClick={handleItemClick} />);

    await user.click(screen.getByRole("button", { name: /open options/i }));

    expect(await screen.findByText("My Account")).toBeInTheDocument();
    expect(screen.getByText("⌘P")).toBeInTheDocument();

    const profileItem = screen.getByText("Profile");
    await user.click(profileItem);

    expect(handleItemClick).toHaveBeenCalledTimes(1);
  });

  it("handles checkbox item toggling correctly", async () => {
    const user = userEvent.setup();
    const handleCheckedChange = vi.fn();

    render(
      <TestDropdownMenu
        isChecked={false}
        onCheckedChange={handleCheckedChange}
      />
    );

    await user.click(screen.getByRole("button", { name: /open options/i }));

    const checkboxItem = await screen.findByRole("menuitemcheckbox", {
      name: /show status bar/i,
    });
    await user.click(checkboxItem);

    expect(handleCheckedChange).toHaveBeenCalledWith(true, expect.anything());
  });
});