import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from ".";

describe("Avatar UI Component", () => {
  beforeEach(() => {
    Object.defineProperty(global.Image.prototype, "src", {
      set(src) {
        if (src) {
          setTimeout(() => {
            this.dispatchEvent(new Event("load"));
          }, 0);
        }
      },
    });
  });

  it("renders avatar image component with correct attributes", async () => {
    render(
      <Avatar>
        <AvatarImage src="https://example.com/avatar.png" alt="User Avatar" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>,
    );

    const image = await screen.findByRole("img", { name: /user avatar/i });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "https://example.com/avatar.png");
  });

  it("renders fallback text when provided", () => {
    render(
      <Avatar>
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>,
    );

    expect(screen.getByText("JD")).toBeInTheDocument();
  });

  it("renders avatar badge and group elements correctly", () => {
    render(
      <AvatarGroup>
        <Avatar>
          <AvatarFallback>A</AvatarFallback>
          <AvatarBadge data-testid="badge" />
        </Avatar>
        <AvatarGroupCount>+3</AvatarGroupCount>
      </AvatarGroup>,
    );

    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByTestId("badge")).toBeInTheDocument();
    expect(screen.getByText("+3")).toBeInTheDocument();
  });
});
