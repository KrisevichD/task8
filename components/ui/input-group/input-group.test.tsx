import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from ".";

describe("InputGroup UI Component", () => {
  it("renders input group with addons and updates input value", async () => {
    const user = userEvent.setup();

    render(
      <InputGroup>
        <InputGroupAddon align="inline-start">
          <InputGroupText>https://</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput placeholder="example.com" />
      </InputGroup>,
    );

    expect(screen.getByText("https://")).toBeInTheDocument();

    const input = screen.getByPlaceholderText("example.com");
    await user.type(input, "my-site.com");

    expect(input).toHaveValue("my-site.com");
  });

  it("renders FloatingInput when label prop is provided", () => {
    render(
      <InputGroup>
        <InputGroupInput id="email" label="Email Address" />
      </InputGroup>,
    );

    expect(screen.getByLabelText("Email Address")).toBeInTheDocument();
  });

  it("focuses input when clicking on InputGroupAddon", async () => {
    const user = userEvent.setup();

    render(
      <InputGroup>
        <InputGroupAddon align="inline-start" data-testid="addon">
          <InputGroupText>Search:</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput placeholder="Search query..." />
      </InputGroup>,
    );

    const input = screen.getByPlaceholderText("Search query...");
    expect(input).not.toHaveFocus();

    await user.click(screen.getByTestId("addon"));

    expect(input).toHaveFocus();
  });

  it("handles button clicks inside addon without focusing input", async () => {
    const user = userEvent.setup();
    const handleButtonClick = vi.fn();

    render(
      <InputGroup>
        <InputGroupInput placeholder="Password" type="password" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton onClick={handleButtonClick}>Show</InputGroupButton>
        </InputGroupAddon>
      </InputGroup>,
    );

    const button = screen.getByRole("button", { name: /show/i });
    await user.click(button);

    expect(handleButtonClick).toHaveBeenCalledTimes(1);
  });

  it("renders InputGroupTextarea correctly", async () => {
    const user = userEvent.setup();

    render(
      <InputGroup>
        <InputGroupTextarea placeholder="Enter description..." />
      </InputGroup>,
    );

    const textarea = screen.getByPlaceholderText("Enter description...");
    await user.type(textarea, "Hello World");

    expect(textarea).toHaveValue("Hello World");
  });
});
