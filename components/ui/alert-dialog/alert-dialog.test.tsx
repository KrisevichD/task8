import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from ".";

const TestAlertDialog = ({
  onConfirm,
  onCancel,
}: {
  onConfirm?: () => void;
  onCancel?: () => void;
}) => (
  <AlertDialog>
    <AlertDialogTrigger render={<button type="button">Open Dialog</button>} />
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={onConfirm}>Confirm</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

describe("AlertDialog UI Component", () => {
  it("renders trigger button and hides dialog content by default", () => {
    render(<TestAlertDialog />);

    expect(
      screen.getByRole("button", { name: /open dialog/i }),
    ).toBeInTheDocument();

    expect(
      screen.queryByText("Are you absolutely sure?"),
    ).not.toBeInTheDocument();
  });

  it("opens dialog and displays title and description on trigger click", async () => {
    const user = userEvent.setup();
    render(<TestAlertDialog />);

    const triggerBtn = screen.getByRole("button", { name: /open dialog/i });
    await user.click(triggerBtn);

    expect(
      await screen.findByText("Are you absolutely sure?"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("This action cannot be undone."),
    ).toBeInTheDocument();
  });

  it("calls onConfirm callback when clicking Confirm button", async () => {
    const user = userEvent.setup();
    const handleConfirm = vi.fn();

    render(<TestAlertDialog onConfirm={handleConfirm} />);

    await user.click(screen.getByRole("button", { name: /open dialog/i }));

    const confirmBtn = await screen.findByRole("button", { name: /confirm/i });
    await user.click(confirmBtn);

    expect(handleConfirm).toHaveBeenCalledTimes(1);
  });

  it("calls onCancel callback when clicking Cancel button", async () => {
    const user = userEvent.setup();
    const handleCancel = vi.fn();

    render(<TestAlertDialog onCancel={handleCancel} />);

    await user.click(screen.getByRole("button", { name: /open dialog/i }));

    const cancelBtn = await screen.findByRole("button", { name: /cancel/i });
    await user.click(cancelBtn);

    expect(handleCancel).toHaveBeenCalledTimes(1);
  });
});
