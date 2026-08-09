import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { Tabs, TabsContent, TabsList, TabsTrigger } from ".";

const TestTabs = ({
  defaultValue = "tab1",
  orientation = "horizontal" as const,
  variant = "default" as const,
  isTab2Disabled = false,
}: {
  defaultValue?: string;
  orientation?: "horizontal" | "vertical";
  variant?: "default" | "line";
  isTab2Disabled?: boolean;
}) => (
  <Tabs defaultValue={defaultValue} orientation={orientation}>
    <TabsList variant={variant}>
      <TabsTrigger value="tab1">Account</TabsTrigger>
      <TabsTrigger value="tab2" disabled={isTab2Disabled}>
        Password
      </TabsTrigger>
    </TabsList>
    <TabsContent value="tab1">Account Details Content</TabsContent>
    <TabsContent value="tab2">Password Settings Content</TabsContent>
  </Tabs>
);

describe("Tabs UI Component", () => {
  it("renders default active tab content and switches content on tab click", async () => {
    const user = userEvent.setup();

    render(<TestTabs />);

    expect(screen.getByText("Account Details Content")).toBeInTheDocument();
    expect(
      screen.queryByText("Password Settings Content")
    ).not.toBeInTheDocument();

    const passwordTab = screen.getByRole("tab", { name: "Password" });
    await user.click(passwordTab);

    expect(
      await screen.findByText("Password Settings Content")
    ).toBeInTheDocument();
    expect(
      screen.queryByText("Account Details Content")
    ).not.toBeInTheDocument();
  });

  it("applies correct data-orientation attribute", () => {
    render(<TestTabs orientation="vertical" />);

    const tabsRoot = screen.getByRole("tablist").parentElement;
    expect(tabsRoot).toHaveAttribute("data-orientation", "vertical");
  });

  it("applies variant attribute to TabsList", () => {
    render(<TestTabs variant="line" />);

    const tabList = screen.getByRole("tablist");
    expect(tabList).toHaveAttribute("data-variant", "line");
  });

 it("does not switch tabs when clicking a disabled trigger", async () => {
    const user = userEvent.setup();

    render(<TestTabs isTab2Disabled={true} />);

    const disabledTab = screen.getByRole("tab", { name: "Password" });
    
    expect(disabledTab).toHaveAttribute("aria-disabled", "true");

    await user.click(disabledTab);

    expect(screen.getByText("Account Details Content")).toBeInTheDocument();
    expect(
      screen.queryByText("Password Settings Content")
    ).not.toBeInTheDocument();
  });
});