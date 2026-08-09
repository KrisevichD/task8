import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from ".";

const TestDialog = ({
  showContentClose = true,
  showFooterClose = false,
}: {
  showContentClose?: boolean;
  showFooterClose?: boolean;
}) => (
  <Dialog>
    <DialogTrigger render={<button type="button">Open Modal</button>} />
    <DialogContent showCloseButton={showContentClose}>
      <DialogHeader>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogDescription>Make changes to your profile here.</DialogDescription>
      </DialogHeader>
      <div>Modal Content Body</div>
      <DialogFooter showCloseButton={showFooterClose}>
        <button type="button">Save Changes</button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

describe("Dialog UI Component", () => {
  it("renders trigger button and keeps dialog hidden by default", () => {
    render(<TestDialog />);

    expect(
      screen.getByRole("button", { name: /open modal/i })
    ).toBeInTheDocument();
    expect(screen.queryByText("Edit Profile")).not.toBeInTheDocument();
  });

  it("opens dialog and renders title, description, and content when clicked", async () => {
    const user = userEvent.setup();
    render(<TestDialog />);

    const triggerBtn = screen.getByRole("button", { name: /open modal/i });
    await user.click(triggerBtn);

    expect(await screen.findByText("Edit Profile")).toBeInTheDocument();
    expect(
      screen.getByText("Make changes to your profile here.")
    ).toBeInTheDocument();
    expect(screen.getByText("Modal Content Body")).toBeInTheDocument();
  });

  it("closes dialog when clicking top-right close icon button", async () => {
    const user = userEvent.setup();
    render(<TestDialog showContentClose={true} />);

    await user.click(screen.getByRole("button", { name: /open modal/i }));

    const closeBtn = await screen.findByRole("button", { name: /close/i });
    await user.click(closeBtn);

    expect(screen.queryByText("Edit Profile")).not.toBeInTheDocument();
  });

  it("renders and handles footer close button when showCloseButton is true", async () => {
    const user = userEvent.setup();
    render(<TestDialog showContentClose={false} showFooterClose={true} />);

    await user.click(screen.getByRole("button", { name: /open modal/i }));

    const footerCloseBtn = await screen.findByRole("button", {
      name: /^close$/i,
    });
    await user.click(footerCloseBtn);

    expect(screen.queryByText("Edit Profile")).not.toBeInTheDocument();
  });
});